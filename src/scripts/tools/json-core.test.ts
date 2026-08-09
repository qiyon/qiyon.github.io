import { describe, expect, it } from "bun:test";
import {
  escapeAsJsonString,
  formatJson,
  minifyJson,
  parseJsonInput,
  unescapeJsonString,
} from "./json-core";

describe("parseJsonInput", () => {
  it("解析标准 JSON", () => {
    const result = parseJsonInput('{"a": 1}');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({ a: 1 });
      expect(result.autoUnescaped).toBe(false);
    }
  });

  it("自动解一层引号转义", () => {
    const result = parseJsonInput(String.raw`"{\"a\": 1, \"b\": [1, 2]}"`);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({ a: 1, b: [1, 2] });
      expect(result.autoUnescaped).toBe(true);
    }
  });

  it("普通字符串不作为 JSON 解转义", () => {
    const result = parseJsonInput('"hello"');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBe("hello");
      expect(result.autoUnescaped).toBe(false);
    }
  });

  it("空输入报错", () => {
    const result = parseJsonInput("   ");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toBe("输入为空");
  });

  it("非法输入返回错误与行列号", () => {
    const result = parseJsonInput('{\n  "a": 1,\n  bad\n}');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).not.toBe("");
      if (result.line !== null) {
        expect(result.line).toBe(3);
        expect(result.column).toBeGreaterThan(0);
      }
    }
  });
});

describe("formatJson（compact 关闭，对齐 JSON.stringify）", () => {
  const value = {
    name: "demo",
    ports: [80, 443],
    nested: { list: [{ id: 1 }], flag: true },
    empty: {},
    emptyList: [],
  };

  it("2 空格缩进与 JSON.stringify 一致", () => {
    expect(formatJson(value, { indent: 2, compact: false })).toBe(JSON.stringify(value, null, 2));
  });

  it("4 空格缩进与 JSON.stringify 一致", () => {
    expect(formatJson(value, { indent: 4, compact: false })).toBe(JSON.stringify(value, null, 4));
  });
});

describe("formatJson（compact 开启）", () => {
  it("数字、字符串数组单行", () => {
    const result = formatJson(
      { ports: [80, 443, 8080], tags: ["php", "linux"] },
      {
        indent: 2,
        compact: true,
      },
    );
    expect(result).toBe('{\n  "ports": [80, 443, 8080],\n  "tags": ["php", "linux"]\n}');
  });

  it("嵌套紧凑数组单行", () => {
    const result = formatJson(
      {
        matrix: [
          [1, 2],
          [3, 4],
        ],
      },
      { indent: 2, compact: true },
    );
    expect(result).toBe('{\n  "matrix": [[1, 2], [3, 4]]\n}');
  });

  it("含 boolean、null、对象的数组仍展开", () => {
    const result = formatJson(
      { flags: [true, false], items: [{ id: 1 }] },
      {
        indent: 2,
        compact: true,
      },
    );
    expect(result).toBe(
      [
        "{",
        '  "flags": [',
        "    true,",
        "    false",
        "  ],",
        '  "items": [',
        "    {",
        '      "id": 1',
        "    }",
        "  ]",
        "}",
      ].join("\n"),
    );
  });

  it("空数组与空对象", () => {
    expect(formatJson({ a: [], b: {} }, { indent: 2, compact: true })).toBe(
      '{\n  "a": [],\n  "b": {}\n}',
    );
  });

  it("顶层为数组", () => {
    expect(formatJson([1, "a", [2, 3]], { indent: 2, compact: true })).toBe('[1, "a", [2, 3]]');
  });

  it("紧凑结果仍是合法 JSON 且数据不变", () => {
    const value = { a: [1, 2, [3, [4]]], b: "x", c: [{ d: [5, 6] }], e: null };
    const result = formatJson(value, { indent: 4, compact: true });
    expect(JSON.parse(result)).toEqual(value);
  });

  it("特殊键名转义", () => {
    expect(formatJson({ 'a"b': 1 }, { indent: 2, compact: true })).toBe('{\n  "a\\"b": 1\n}');
  });
});

describe("minifyJson", () => {
  it("去除全部空白", () => {
    expect(minifyJson({ a: [1, 2], b: { c: "x" } })).toBe('{"a":[1,2],"b":{"c":"x"}}');
  });
});

describe("escapeAsJsonString / unescapeJsonString", () => {
  it("添加转义生成字符串字面量", () => {
    expect(escapeAsJsonString('{"a": 1}\n第二行')).toBe('"{\\"a\\": 1}\\n第二行"');
  });

  it("去除转义还原内容", () => {
    const result = unescapeJsonString(String.raw`"{\"a\": 1}\n第二行"`);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.text).toBe('{"a": 1}\n第二行');
  });

  it("去除转义：非字符串 JSON 报错", () => {
    const result = unescapeJsonString('{"a": 1}');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain("不是被引号包裹");
  });

  it("去除转义：非法字面量报错", () => {
    const result = unescapeJsonString('"abc');
    expect(result.ok).toBe(false);
  });
});
