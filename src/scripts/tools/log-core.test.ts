import { describe, expect, it } from "bun:test";
import { expandNestedJsonStrings, type LogLinesResult, parseLogInput } from "./log-core";

function expectLines(result: ReturnType<typeof parseLogInput>): LogLinesResult {
  expect(result.kind).toBe("lines");
  if (result.kind !== "lines") throw new Error("expected lines result");
  return result;
}

function jsonSegments(result: LogLinesResult, recordIndex = 0) {
  return result.records[recordIndex].segments.filter((segment) => segment.kind === "json");
}

describe("parseLogInput：整体内容", () => {
  it("解除被引号包裹日志的一层转义", () => {
    const result = expectLines(parseLogInput(String.raw`"第一行\n第二行"`));
    expect(result.unescaped).toBe(true);
    expect(result.records.map((record) => record.raw)).toEqual(["第一行", "第二行"]);
  });

  it("整体 JSON 同时返回原始值和嵌套展开值", () => {
    const result = parseLogInput(String.raw`{"code":0,"payload":"{\"id\":1}"}`);
    expect(result.kind).toBe("json");
    if (result.kind !== "json") return;
    expect(result.value).toEqual({ code: 0, payload: '{"id":1}' });
    expect(result.displayValue).toEqual({ code: 0, payload: { id: 1 } });
    expect(result.decodedPaths).toEqual(["$.payload"]);
  });

  it("被引号包裹转义的整体 JSON 可继续展开字段", () => {
    const source = JSON.stringify(JSON.stringify({ payload: JSON.stringify({ items: [1, 2] }) }));
    const result = parseLogInput(source);
    expect(result.kind).toBe("json");
    if (result.kind !== "json") return;
    expect(result.unescaped).toBe(true);
    expect(result.displayValue).toEqual({ payload: { items: [1, 2] } });
  });
});

describe("expandNestedJsonStrings", () => {
  it("递归展开对象、数组里的 JSON 字符串", () => {
    const result = expandNestedJsonStrings({
      payload: JSON.stringify({ detail: JSON.stringify({ ok: true }) }),
      list: [JSON.stringify([1, 2])],
    });
    expect(result.value).toEqual({
      payload: { detail: { ok: true } },
      list: [[1, 2]],
    });
    expect(result.decodedPaths).toEqual(["$.payload", "$.payload.detail", "$.list[0]"]);
  });

  it("不展开 JSON 标量和普通业务字符串", () => {
    const value = { number: "123", bool: "true", text: "{not json}", empty: "[] not json" };
    const result = expandNestedJsonStrings(value);
    expect(result.value).toEqual(value);
    expect(result.decodedPaths).toEqual([]);
  });

  it("特殊字段名使用括号路径", () => {
    const result = expandNestedJsonStrings({ "biz-data": '{"ok":true}' });
    expect(result.decodedPaths).toEqual(['$["biz-data"]']);
  });
});

describe("parseLogInput：复杂 JSON 片段", () => {
  it("保留业务信息并提取普通行内 JSON", () => {
    const result = expectLines(
      parseLogInput('2026-08-12 10:00:00 INFO xx biz info, data:{"code":0} complete'),
    );
    expect(result.records).toHaveLength(1);
    expect(result.records[0].segments).toMatchObject([
      { kind: "text", text: "2026-08-12 10:00:00 INFO xx biz info, data:" },
      { kind: "json", value: { code: 0 } },
      { kind: "text", text: " complete" },
    ]);
  });

  it("一条日志可以提取多个 JSON", () => {
    const result = expectLines(parseLogInput('INFO request={"id":1}, response={"ok":true}'));
    expect(jsonSegments(result).map((segment) => segment.value)).toEqual([{ id: 1 }, { ok: true }]);
    expect(result.stats.jsonFragments).toBe(2);
  });

  it("跨行 JSON 合并为一条记录并保留行号范围", () => {
    const input = [
      "2026-08-12 INFO biz data: {",
      '  "user": {"id": 1},',
      '  "items": [1, 2]',
      "} done",
      "2026-08-12 ERROR next",
    ].join("\n");
    const result = expectLines(parseLogInput(input));
    expect(result.records).toHaveLength(2);
    expect(result.records[0].startLine).toBe(1);
    expect(result.records[0].endLine).toBe(4);
    expect(jsonSegments(result)[0].value).toEqual({ user: { id: 1 }, items: [1, 2] });
    expect(result.records[1].startLine).toBe(5);
  });

  it("行内被引号转义的 JSON 作为结构化片段", () => {
    const result = expectLines(
      parseLogInput(String.raw`INFO xx biz info, data:"{\"code\":0,\"ok\":true}" done`),
    );
    const segment = jsonSegments(result)[0];
    expect(segment.encoded).toBe(true);
    expect(segment.value).toBe('{"code":0,"ok":true}');
    expect(segment.displayValue).toEqual({ code: 0, ok: true });
    expect(segment.decodedPaths).toEqual(["$"]);
  });

  it("普通 JSON 内的 JSON 字符串字段递归展开", () => {
    const payload = JSON.stringify({
      code: 0,
      data: JSON.stringify({ orderId: 123, ext: JSON.stringify({ source: "web" }) }),
    });
    const result = expectLines(parseLogInput(`INFO xx biz info, data:${payload}`));
    const segment = jsonSegments(result)[0];
    expect(segment.value).toEqual({
      code: 0,
      data: '{"orderId":123,"ext":"{\\"source\\":\\"web\\"}"}',
    });
    expect(segment.displayValue).toEqual({
      code: 0,
      data: { orderId: 123, ext: { source: "web" } },
    });
    expect(segment.decodedPaths).toEqual(["$.data", "$.data.ext"]);
  });

  it("JSON 字符串中的括号和转义引号不影响配对", () => {
    const result = expectLines(parseLogInput(String.raw`data:{"text":"{]} \"quoted\"","ok":true}`));
    expect(jsonSegments(result)[0].value).toEqual({ text: '{]} "quoted"', ok: true });
  });

  it("不合法 JSON 保留为普通文本", () => {
    const result = expectLines(parseLogInput("INFO broken data:{a: 1}"));
    expect(jsonSegments(result)).toHaveLength(0);
    expect(result.records[0].raw).toBe("INFO broken data:{a: 1}");
  });
});

describe("parseLogInput：级别、统计和原文", () => {
  it("优先从结构化 level 字段识别级别", () => {
    const result = expectLines(
      parseLogInput('{"message":"ERROR is documentation","level":"info"}\nplain'),
    );
    expect(result.records[0].level).toBe("INFO");
  });

  it("识别显式、括号和大写级别格式", () => {
    const result = expectLines(
      parseLogInput("level=warning slow\n[CRITICAL] failed\n2026-08-12 DEBUG detail"),
    );
    expect(result.records.map((record) => record.level)).toEqual(["WARN", "FATAL", "DEBUG"]);
  });

  it("不把 URL 路径里的 error 当成错误级别", () => {
    const result = expectLines(parseLogInput("GET /error/documentation returned 200"));
    expect(result.records[0].level).toBeNull();
  });

  it("保留首尾空行、缩进和尾部空格", () => {
    const result = expectLines(parseLogInput("\n  INFO indented  \n"));
    expect(result.records.map((record) => record.raw)).toEqual(["", "  INFO indented  ", ""]);
    expect(result.stats.physicalLines).toBe(3);
  });

  it("兼容 CRLF 换行", () => {
    const result = expectLines(parseLogInput("a\r\nb"));
    expect(result.records.map((record) => record.raw)).toEqual(["a", "b"]);
    expect(result.stats.physicalLines).toBe(2);
  });

  it("空输入返回空记录", () => {
    const result = expectLines(parseLogInput("   "));
    expect(result.records).toEqual([]);
    expect(result.stats.total).toBe(0);
  });
});
