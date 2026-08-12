/**
 * 日志查看工具核心逻辑：解转义、跨行 JSON 提取、JSON 字符串递归展开与级别识别。
 * 纯函数模块，不访问 DOM，可在 Bun 测试中直接运行。
 */

export type LogLevel = "TRACE" | "DEBUG" | "INFO" | "NOTICE" | "WARN" | "ERROR" | "FATAL";

export interface LogTextSegment {
  kind: "text";
  text: string;
}

export interface LogJsonSegment {
  kind: "json";
  /** 输入中的 JSON 原文，可能是普通 JSON，也可能是被引号包裹的 JSON 字符串。 */
  raw: string;
  /** JSON.parse 后的原始值，不做嵌套 JSON 字符串替换。 */
  value: unknown;
  /** 递归展开 JSON 字符串字段后的展示值。 */
  displayValue: unknown;
  /** 发生 JSON 字符串展开的字段路径。 */
  decodedPaths: string[];
  /** 整个片段本身是否为被引号包裹的 JSON 字符串。 */
  encoded: boolean;
}

export type LogSegment = LogTextSegment | LogJsonSegment;

export interface LogRecord {
  /** 完整原文；跨行 JSON 会保留换行。 */
  raw: string;
  level: LogLevel | null;
  /** 从 1 开始的原始行号范围。 */
  startLine: number;
  endLine: number;
  segments: LogSegment[];
}

export interface LogStats {
  /** 逻辑日志记录数。 */
  total: number;
  /** 输入的物理行数。 */
  physicalLines: number;
  withJson: number;
  jsonFragments: number;
  decodedFields: number;
  levels: Partial<Record<LogLevel, number>>;
}

export interface LogJsonResult {
  kind: "json";
  unescaped: boolean;
  value: unknown;
  displayValue: unknown;
  decodedPaths: string[];
}

export interface LogLinesResult {
  kind: "lines";
  unescaped: boolean;
  records: LogRecord[];
  stats: LogStats;
}

export type LogParseResult = LogJsonResult | LogLinesResult;

const LEVEL_NORMALIZE: Record<string, LogLevel> = {
  TRACE: "TRACE",
  DEBUG: "DEBUG",
  INFO: "INFO",
  NOTICE: "NOTICE",
  WARN: "WARN",
  WARNING: "WARN",
  ERROR: "ERROR",
  FATAL: "FATAL",
  CRITICAL: "FATAL",
};
const LEVEL_NAMES = "TRACE|DEBUG|INFO|NOTICE|WARN|WARNING|ERROR|FATAL|CRITICAL";
const EXPLICIT_LEVEL_PATTERN = new RegExp(
  `(?:level|severity|log\\.level)\\s*[:=]\\s*["']?(${LEVEL_NAMES})\\b`,
  "i",
);
const BRACKET_LEVEL_PATTERN = new RegExp(`\\[(${LEVEL_NAMES})\\]`, "i");
const UPPERCASE_LEVEL_PATTERN = new RegExp(`(?:^|\\s)(${LEVEL_NAMES})(?=\\s|[\\]:,;|-]|$)`);
const LEADING_LEVEL_PATTERN = new RegExp(`^\\s*(${LEVEL_NAMES})\\b`, "i");
const MAX_NESTED_JSON_DEPTH = 20;

function normalizeLevel(level: string): LogLevel | null {
  return LEVEL_NORMALIZE[level.toUpperCase()] ?? null;
}

function getObjectLevel(value: unknown): LogLevel | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return null;
  const object = value as Record<string, unknown>;
  const candidates = [object.level, object.severity];
  if (object.log !== null && typeof object.log === "object" && !Array.isArray(object.log)) {
    candidates.push((object.log as Record<string, unknown>).level);
  }
  for (const candidate of candidates) {
    if (typeof candidate !== "string") continue;
    const level = normalizeLevel(candidate);
    if (level) return level;
  }
  return null;
}

function detectLevel(record: string, segments: LogSegment[]): LogLevel | null {
  for (const segment of segments) {
    if (segment.kind !== "json") continue;
    const level = getObjectLevel(segment.displayValue);
    if (level) return level;
  }

  const text = segments
    .filter((segment): segment is LogTextSegment => segment.kind === "text")
    .map((segment) => segment.text)
    .join(" ");
  for (const pattern of [EXPLICIT_LEVEL_PATTERN, BRACKET_LEVEL_PATTERN, UPPERCASE_LEVEL_PATTERN]) {
    const match = text.match(pattern);
    if (match) return normalizeLevel(match[1]);
  }
  const leading = record.match(LEADING_LEVEL_PATTERN);
  return leading ? normalizeLevel(leading[1]) : null;
}

function tryParse(text: string): { ok: true; value: unknown } | { ok: false } {
  try {
    return { ok: true, value: JSON.parse(text) as unknown };
  } catch {
    return { ok: false };
  }
}

function looksLikeJsonContainer(text: string): boolean {
  const trimmed = text.trim();
  return (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  );
}

function appendObjectPath(path: string, key: string): string {
  return /^[A-Za-z_$][\w$]*$/.test(key) ? `${path}.${key}` : `${path}[${JSON.stringify(key)}]`;
}

/** 递归展开对象/数组字段中由 JSON 字符串编码的对象或数组。 */
export function expandNestedJsonStrings(value: unknown): {
  value: unknown;
  decodedPaths: string[];
} {
  const paths = new Set<string>();

  function visit(current: unknown, path: string, depth: number): unknown {
    if (depth >= MAX_NESTED_JSON_DEPTH) return current;
    if (typeof current === "string" && looksLikeJsonContainer(current)) {
      const parsed = tryParse(current.trim());
      if (parsed.ok && parsed.value !== null && typeof parsed.value === "object") {
        paths.add(path);
        return visit(parsed.value, path, depth + 1);
      }
    }
    if (Array.isArray(current)) {
      return current.map((entry, index) => visit(entry, `${path}[${index}]`, depth + 1));
    }
    if (current !== null && typeof current === "object") {
      return Object.fromEntries(
        Object.entries(current as Record<string, unknown>).map(([key, entry]) => [
          key,
          visit(entry, appendObjectPath(path, key), depth + 1),
        ]),
      );
    }
    return current;
  }

  return { value: visit(value, "$", 0), decodedPaths: [...paths] };
}

/** 从 start 处扫描一个 JSON 对象或数组，严格匹配括号类型。 */
function scanJsonContainerEnd(text: string, start: number): number {
  const stack: string[] = [];
  let inString = false;
  let escaped = false;
  for (let index = start; index < text.length; index += 1) {
    const character = text[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (inString) {
      if (character === "\\") escaped = true;
      else if (character === '"') inString = false;
      continue;
    }
    if (character === '"') {
      inString = true;
    } else if (character === "{") {
      stack.push("}");
    } else if (character === "[") {
      stack.push("]");
    } else if (character === "}" || character === "]") {
      if (stack.pop() !== character) return -1;
      if (stack.length === 0) return index + 1;
    }
  }
  return -1;
}

/** 从 start 处扫描一个双引号 JSON 字符串字面量。 */
function scanJsonStringEnd(text: string, start: number): number {
  let escaped = false;
  for (let index = start + 1; index < text.length; index += 1) {
    const character = text[index];
    if (escaped) {
      escaped = false;
    } else if (character === "\\") {
      escaped = true;
    } else if (character === '"') {
      return index + 1;
    } else if (character === "\n") {
      return -1;
    }
  }
  return -1;
}

interface LocatedJson extends LogJsonSegment {
  start: number;
  end: number;
}

function createJsonSegment(raw: string, value: unknown, encoded: boolean): LogJsonSegment {
  const expanded = expandNestedJsonStrings(value);
  return {
    kind: "json",
    raw,
    value,
    displayValue: expanded.value,
    decodedPaths: expanded.decodedPaths,
    encoded,
  };
}

function findJsonAt(text: string, start: number): LocatedJson | null {
  const character = text[start];
  if (character === "{" || character === "[") {
    const end = scanJsonContainerEnd(text, start);
    if (end === -1) return null;
    const raw = text.slice(start, end);
    const parsed = tryParse(raw);
    return parsed.ok ? { ...createJsonSegment(raw, parsed.value, false), start, end } : null;
  }
  if (character === '"') {
    const end = scanJsonStringEnd(text, start);
    if (end === -1) return null;
    const raw = text.slice(start, end);
    const parsed = tryParse(raw);
    if (!parsed.ok || typeof parsed.value !== "string" || !looksLikeJsonContainer(parsed.value)) {
      return null;
    }
    const inner = tryParse(parsed.value.trim());
    if (!inner.ok || inner.value === null || typeof inner.value !== "object") return null;
    const segment = createJsonSegment(raw, parsed.value, true);
    return { ...segment, start, end };
  }
  return null;
}

function findJsonFragments(text: string, start: number, initialEnd: number): LocatedJson[] {
  const fragments: LocatedJson[] = [];
  let recordEnd = initialEnd;
  let index = start;
  while (index < recordEnd) {
    const character = text[index];
    if (character !== "{" && character !== "[" && character !== '"') {
      index += 1;
      continue;
    }
    const fragment = findJsonAt(text, index);
    if (!fragment) {
      index += 1;
      continue;
    }
    fragments.push(fragment);
    const followingNewline = text.indexOf("\n", fragment.end);
    recordEnd = followingNewline === -1 ? text.length : followingNewline;
    index = fragment.end;
  }
  return fragments;
}

function buildSegments(
  record: string,
  absoluteStart: number,
  fragments: LocatedJson[],
): LogSegment[] {
  const segments: LogSegment[] = [];
  let cursor = 0;
  for (const fragment of fragments) {
    const start = fragment.start - absoluteStart;
    const end = fragment.end - absoluteStart;
    if (start > cursor) segments.push({ kind: "text", text: record.slice(cursor, start) });
    const { start: _start, end: _end, ...segment } = fragment;
    segments.push(segment);
    cursor = end;
  }
  if (cursor < record.length) segments.push({ kind: "text", text: record.slice(cursor) });
  if (segments.length === 0) segments.push({ kind: "text", text: record });
  return segments;
}

function parseRecords(text: string): LogRecord[] {
  const records: LogRecord[] = [];
  let cursor = 0;
  let currentLine = 1;
  while (cursor < text.length) {
    const firstNewline = text.indexOf("\n", cursor);
    let recordEnd = firstNewline === -1 ? text.length : firstNewline;
    const fragments = findJsonFragments(text, cursor, recordEnd);
    for (const fragment of fragments) {
      if (fragment.end <= recordEnd) continue;
      const followingNewline = text.indexOf("\n", fragment.end);
      recordEnd = followingNewline === -1 ? text.length : followingNewline;
    }
    const record = text.slice(cursor, recordEnd);
    const segments = buildSegments(record, cursor, fragments);
    const lineBreaks = record.match(/\n/g)?.length ?? 0;
    const startLine = currentLine;
    records.push({
      raw: record,
      level: detectLevel(record, segments),
      startLine,
      endLine: startLine + lineBreaks,
      segments,
    });
    if (recordEnd === text.length) break;
    cursor = recordEnd + 1;
    currentLine += lineBreaks + 1;
  }
  if (text.endsWith("\n")) {
    records.push({
      raw: "",
      level: null,
      startLine: currentLine,
      endLine: currentLine,
      segments: [{ kind: "text", text: "" }],
    });
  }
  return records;
}

/**
 * 解析日志输入：
 * 1. 整体被引号包裹时可解析为字符串，解除一层转义；
 * 2. 结果整体为 JSON 时，提供原始值和递归展开后的展示值；
 * 3. 否则按逻辑记录拆分，提取普通、跨行和被引号转义的 JSON 片段。
 */
export function parseLogInput(raw: string): LogParseResult {
  let text = raw.replace(/\r\n?/g, "\n");
  let detectionText = text.trim();
  let unescaped = false;

  if (detectionText.length >= 2 && detectionText.startsWith('"') && detectionText.endsWith('"')) {
    const wrapped = tryParse(detectionText);
    if (wrapped.ok && typeof wrapped.value === "string") {
      text = wrapped.value.replace(/\r\n?/g, "\n");
      detectionText = text.trim();
      unescaped = true;
    }
  }

  if (detectionText !== "" && (detectionText.startsWith("{") || detectionText.startsWith("["))) {
    const whole = tryParse(detectionText);
    if (whole.ok) {
      const expanded = expandNestedJsonStrings(whole.value);
      return {
        kind: "json",
        unescaped,
        value: whole.value,
        displayValue: expanded.value,
        decodedPaths: expanded.decodedPaths,
      };
    }
  }

  const records = detectionText === "" ? [] : parseRecords(text);
  const stats: LogStats = {
    total: records.length,
    physicalLines: text === "" ? 0 : (text.match(/\n/g)?.length ?? 0) + 1,
    withJson: 0,
    jsonFragments: 0,
    decodedFields: 0,
    levels: {},
  };
  for (const record of records) {
    const jsonSegments = record.segments.filter(
      (segment): segment is LogJsonSegment => segment.kind === "json",
    );
    if (jsonSegments.length > 0) stats.withJson += 1;
    stats.jsonFragments += jsonSegments.length;
    stats.decodedFields += jsonSegments.reduce(
      (total, segment) => total + segment.decodedPaths.length,
      0,
    );
    if (record.level !== null) {
      stats.levels[record.level] = (stats.levels[record.level] ?? 0) + 1;
    }
  }
  return { kind: "lines", unescaped, records, stats };
}
