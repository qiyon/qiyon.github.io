/**
 * JSON 工具核心逻辑：解析、美化（含 nested 紧凑）、压缩、转义处理。
 * 纯函数模块，不访问 DOM，可在 Bun 测试中直接运行。
 */

export interface JsonFormatOptions {
  indent: 2 | 4;
  compact: boolean;
}

export interface JsonParseSuccess {
  ok: true;
  value: unknown;
  /** 输入为被引号包裹转义的 JSON 字符串时，自动解一层转义后为 true */
  autoUnescaped: boolean;
}

export interface JsonParseFailure {
  ok: false;
  message: string;
  line: number | null;
  column: number | null;
}

export type JsonParseResult = JsonParseSuccess | JsonParseFailure;

interface TryParseSuccess {
  ok: true;
  value: unknown;
}

interface TryParseFailure {
  ok: false;
  message: string;
}

type TryParseResult = TryParseSuccess | TryParseFailure;

function tryParse(text: string): TryParseResult {
  try {
    return { ok: true, value: JSON.parse(text) as unknown };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : String(error) };
  }
}

/** 从 JSON.parse 报错信息中提取 position（V8 格式），换算为行列号。 */
function locateError(
  text: string,
  message: string,
): { line: number | null; column: number | null } {
  const match = message.match(/position (\d+)/);
  if (!match) return { line: null, column: null };
  const position = Number(match[1]);
  if (!Number.isFinite(position) || position < 0) return { line: null, column: null };
  const before = text.slice(0, position);
  const lines = before.split("\n");
  return { line: lines.length, column: (lines.at(-1)?.length ?? 0) + 1 };
}

function looksLikeJson(text: string): boolean {
  const trimmed = text.trim();
  return trimmed.startsWith("{") || trimmed.startsWith("[");
}

/**
 * 解析用户输入：
 * 1. 直接 JSON.parse；成功且结果为“像 JSON 的字符串”时，自动解一层转义再解析；
 * 2. 失败时返回带行列号（引擎支持时）的错误。
 */
export function parseJsonInput(raw: string): JsonParseResult {
  const text = raw.trim();
  if (text === "") return { ok: false, message: "输入为空", line: null, column: null };

  const direct = tryParse(text);
  if (!direct.ok) {
    const { line, column } = locateError(text, direct.message);
    return { ok: false, message: direct.message, line, column };
  }

  if (typeof direct.value === "string" && looksLikeJson(direct.value)) {
    const inner = tryParse(direct.value.trim());
    if (inner.ok) return { ok: true, value: inner.value, autoUnescaped: true };
  }

  return { ok: true, value: direct.value, autoUnescaped: false };
}

/** 去除转义：解析被引号包裹的 JSON 字符串字面量，输出其内容。 */
export function unescapeJsonString(
  raw: string,
): { ok: true; text: string } | { ok: false; message: string } {
  const text = raw.trim();
  if (text === "") return { ok: false, message: "输入为空" };
  const parsed = tryParse(text);
  if (!parsed.ok) return { ok: false, message: `不是合法的 JSON 字符串字面量：${parsed.message}` };
  if (typeof parsed.value !== "string") {
    return { ok: false, message: "输入不是被引号包裹转义的字符串" };
  }
  return { ok: true, text: parsed.value };
}

/** 添加转义：将输入原文整体作为字符串生成 JSON 字符串字面量。 */
export function escapeAsJsonString(raw: string): string {
  return JSON.stringify(raw);
}

/** 递归判断值是否可在紧凑模式下单行输出：数字、字符串，或元素全部可单行的数组。 */
function isInlineValue(value: unknown): boolean {
  if (typeof value === "number" || typeof value === "string") return true;
  if (Array.isArray(value)) return value.every(isInlineValue);
  return false;
}

/**
 * 美化序列化。
 * compact 开启时，纯数字/字符串数组（含嵌套紧凑数组）输出为单行；
 * compact 关闭时输出与 JSON.stringify(value, null, indent) 一致。
 */
export function formatJson(value: unknown, options: JsonFormatOptions): string {
  const indentUnit = " ".repeat(options.indent);

  function serializeInline(item: unknown): string {
    if (Array.isArray(item)) return `[${item.map(serializeInline).join(", ")}]`;
    return JSON.stringify(item) ?? "null";
  }

  function serialize(item: unknown, level: number): string {
    if (Array.isArray(item)) {
      if (item.length === 0) return "[]";
      if (options.compact && isInlineValue(item)) {
        return `[${item.map(serializeInline).join(", ")}]`;
      }
      const pad = indentUnit.repeat(level + 1);
      const closePad = indentUnit.repeat(level);
      const lines = item.map((entry) => `${pad}${serialize(entry, level + 1)}`);
      return `[\n${lines.join(",\n")}\n${closePad}]`;
    }
    if (item !== null && typeof item === "object") {
      const entries = Object.entries(item as Record<string, unknown>);
      if (entries.length === 0) return "{}";
      const pad = indentUnit.repeat(level + 1);
      const closePad = indentUnit.repeat(level);
      const lines = entries.map(
        ([key, entry]) => `${pad}${JSON.stringify(key)}: ${serialize(entry, level + 1)}`,
      );
      return `{\n${lines.join(",\n")}\n${closePad}}`;
    }
    return JSON.stringify(item) ?? "null";
  }

  return serialize(value, 0);
}

/** 压缩：去除全部空白。 */
export function minifyJson(value: unknown): string {
  return JSON.stringify(value) ?? "null";
}
