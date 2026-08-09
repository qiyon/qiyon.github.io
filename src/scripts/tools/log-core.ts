/**
 * 日志查看工具核心逻辑：解转义、整体 JSON 识别、逐行级别识别与行内 JSON 提取。
 * 纯函数模块，不访问 DOM，可在 Bun 测试中直接运行。
 */

export type LogLevel = "TRACE" | "DEBUG" | "INFO" | "NOTICE" | "WARN" | "ERROR" | "FATAL";

export interface LogLine {
  /** 原文 */
  raw: string;
  /** 规范化后的日志级别，未识别为 null */
  level: LogLevel | null;
  /** 行内 JSON 之前的前缀文本；无 JSON 时为整行 */
  prefix: string;
  /** 提取到的行内 JSON，未提取到为 null */
  json: unknown | null;
  /** 行内 JSON 之后的尾部文本 */
  suffix: string;
}

export interface LogStats {
  total: number;
  withJson: number;
  levels: Partial<Record<LogLevel, number>>;
}

export interface LogJsonResult {
  kind: "json";
  /** 是否发生过引号解转义 */
  unescaped: boolean;
  value: unknown;
}

export interface LogLinesResult {
  kind: "lines";
  unescaped: boolean;
  lines: LogLine[];
  stats: LogStats;
}

export type LogParseResult = LogJsonResult | LogLinesResult;

const LEVEL_PATTERN = /\b(TRACE|DEBUG|INFO|NOTICE|WARN|WARNING|ERROR|FATAL|CRITICAL)\b/i;

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

function detectLevel(line: string): LogLevel | null {
  const match = line.match(LEVEL_PATTERN);
  if (!match) return null;
  return LEVEL_NORMALIZE[match[1].toUpperCase()] ?? null;
}

function tryParse(text: string): { ok: true; value: unknown } | { ok: false } {
  try {
    return { ok: true, value: JSON.parse(text) as unknown };
  } catch {
    return { ok: false };
  }
}

/**
 * 从 start 处（须为 { 或 [）做括号配对扫描，返回配对闭合位置。
 * 扫描跳过字符串字面量及其中的转义字符；未配对返回 -1。
 * 括号类型是否匹配交由 JSON.parse 最终判定。
 */
function scanJsonEnd(line: string, start: number): number {
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < line.length; i++) {
    const ch = line[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (inString) {
      if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === "{" || ch === "[") depth += 1;
    else if (ch === "}" || ch === "]") {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

interface InlineJson {
  start: number;
  end: number;
  value: unknown;
}

/** 提取行内第一个可解析的 JSON 片段。 */
function extractInlineJson(line: string): InlineJson | null {
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch !== "{" && ch !== "[") continue;
    const end = scanJsonEnd(line, i);
    if (end === -1) continue;
    const parsed = tryParse(line.slice(i, end + 1));
    if (parsed.ok) return { start: i, end: end + 1, value: parsed.value };
  }
  return null;
}

function parseLine(line: string): LogLine {
  const level = detectLevel(line);
  const inline = extractInlineJson(line);
  if (!inline) return { raw: line, level, prefix: line, json: null, suffix: "" };
  return {
    raw: line,
    level,
    prefix: line.slice(0, inline.start).trimEnd(),
    json: inline.value,
    suffix: line.slice(inline.end).trimStart(),
  };
}

/**
 * 解析日志输入：
 * 1. 整体被引号包裹时可解析为字符串 → 解一层转义；
 * 2. 结果整体可 JSON.parse → 单一 JSON 视图；
 * 3. 否则按行拆分，逐行识别级别并提取行内 JSON。
 */
export function parseLogInput(raw: string): LogParseResult {
  let text = raw.trim();
  let unescaped = false;

  if (text.length >= 2 && text.startsWith('"') && text.endsWith('"')) {
    const wrapped = tryParse(text);
    if (wrapped.ok && typeof wrapped.value === "string") {
      text = wrapped.value.trim();
      unescaped = true;
    }
  }

  if (text !== "" && (text.startsWith("{") || text.startsWith("["))) {
    const whole = tryParse(text);
    if (whole.ok) return { kind: "json", unescaped, value: whole.value };
  }

  const lines = text === "" ? [] : text.split(/\r?\n/).map(parseLine);
  const stats: LogStats = { total: lines.length, withJson: 0, levels: {} };
  for (const line of lines) {
    if (line.json !== null) stats.withJson += 1;
    if (line.level !== null) stats.levels[line.level] = (stats.levels[line.level] ?? 0) + 1;
  }
  return { kind: "lines", unescaped, lines, stats };
}
