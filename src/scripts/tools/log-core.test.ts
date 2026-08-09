import { describe, expect, it } from "bun:test";
import { type LogLinesResult, parseLogInput } from "./log-core";

function expectLines(result: ReturnType<typeof parseLogInput>): LogLinesResult {
  expect(result.kind).toBe("lines");
  if (result.kind !== "lines") throw new Error("expected lines result");
  return result;
}

describe("parseLogInput：解转义", () => {
  it("引号包裹含 \\n 的字符串解为多行", () => {
    const result = expectLines(parseLogInput(String.raw`"第一行\n第二行"`));
    expect(result.unescaped).toBe(true);
    expect(result.lines.map((line) => line.raw)).toEqual(["第一行", "第二行"]);
  });

  it("普通多行文本不解转义", () => {
    const result = expectLines(parseLogInput("第一行\n第二行"));
    expect(result.unescaped).toBe(false);
    expect(result.stats.total).toBe(2);
  });

  it("包裹转义的 JSON：解转义后识别为整体 JSON", () => {
    const result = parseLogInput(String.raw`"{\"a\": 1, \"b\": [1, 2]}"`);
    expect(result.kind).toBe("json");
    expect(result.unescaped).toBe(true);
    if (result.kind === "json") expect(result.value).toEqual({ a: 1, b: [1, 2] });
  });
});

describe("parseLogInput：整体 JSON", () => {
  it("单行 JSON", () => {
    const result = parseLogInput('{"a": 1}');
    expect(result.kind).toBe("json");
    if (result.kind === "json") expect(result.value).toEqual({ a: 1 });
  });

  it("已美化的多行 JSON", () => {
    const result = parseLogInput('{\n  "a": 1,\n  "b": [1, 2]\n}');
    expect(result.kind).toBe("json");
    if (result.kind === "json") expect(result.value).toEqual({ a: 1, b: [1, 2] });
  });

  it("顶层数组 JSON", () => {
    const result = parseLogInput('[1, "a", {"b": 2}]');
    expect(result.kind).toBe("json");
  });
});

describe("parseLogInput：逐行处理", () => {
  it("整行 JSON 被提取，前缀为空", () => {
    const result = expectLines(parseLogInput('2026-07-07 16:00:00 {"code": 0}'));
    expect(result.lines[0].prefix).toBe("2026-07-07 16:00:00");
    expect(result.lines[0].json).toEqual({ code: 0 });
    expect(result.stats.withJson).toBe(1);
  });

  it("普通行原样保留", () => {
    const result = expectLines(parseLogInput("plain log line"));
    expect(result.lines[0]).toEqual({
      raw: "plain log line",
      level: null,
      prefix: "plain log line",
      json: null,
      suffix: "",
    });
  });

  it("JSON 后的尾部文本保留", () => {
    const result = expectLines(parseLogInput('got {"a": 1} done'));
    expect(result.lines[0].prefix).toBe("got");
    expect(result.lines[0].json).toEqual({ a: 1 });
    expect(result.lines[0].suffix).toBe("done");
  });

  it("字符串内含括号不误判", () => {
    const result = expectLines(parseLogInput('data {"a": "{]", "b": 1} end'));
    expect(result.lines[0].json).toEqual({ a: "{]", b: 1 });
    expect(result.lines[0].suffix).toBe("end");
  });

  it("无法配对的括号视为普通文本", () => {
    const result = expectLines(parseLogInput("broken {a: 1}"));
    expect(result.lines[0].json).toBeNull();
  });

  it("行内数组 JSON", () => {
    const result = expectLines(parseLogInput("ids: [1, 2, 3]"));
    expect(result.lines[0].json).toEqual([1, 2, 3]);
  });
});

describe("parseLogInput：级别识别与统计", () => {
  it("识别各级别并统计", () => {
    const input = [
      "2026-07-07 INFO started",
      "2026-07-07 WARN slow query",
      "2026-07-07 ERROR failed",
      "debug detail",
      "no level line",
    ].join("\n");
    const result = expectLines(parseLogInput(input));
    expect(result.lines.map((line) => line.level)).toEqual([
      "INFO",
      "WARN",
      "ERROR",
      "DEBUG",
      null,
    ]);
    expect(result.stats.total).toBe(5);
    expect(result.stats.levels).toEqual({ INFO: 1, WARN: 1, ERROR: 1, DEBUG: 1 });
  });

  it("WARNING 归一为 WARN，CRITICAL 归一为 FATAL，大小写不敏感", () => {
    const result = expectLines(parseLogInput("warning a\nCRITICAL b\nerror c"));
    expect(result.lines.map((line) => line.level)).toEqual(["WARN", "FATAL", "ERROR"]);
  });

  it("取行内第一个级别词", () => {
    const result = expectLines(parseLogInput("ERROR ... INFO ..."));
    expect(result.lines[0].level).toBe("ERROR");
  });

  it("空输入返回空行列表", () => {
    const result = expectLines(parseLogInput("   "));
    expect(result.lines).toEqual([]);
    expect(result.stats.total).toBe(0);
  });

  it("兼容 \\r\\n 换行", () => {
    const result = expectLines(parseLogInput("a\r\nb"));
    expect(result.lines.map((line) => line.raw)).toEqual(["a", "b"]);
  });
});
