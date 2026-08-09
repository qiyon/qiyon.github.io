import { describe, expect, it } from "bun:test";
import { formatTime, parseTimeInput } from "./time-core";

// 固定“现在”：北京时间 2026-07-07 16:00:00（Unix 秒 1783411200）
const NOW = 1783411200_000;
const DAY_MS = 24 * 3600_000;

function expectOk(result: ReturnType<typeof parseTimeInput>) {
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(`expected success, got: ${result.message}`);
  return result;
}

function expectFail(result: ReturnType<typeof parseTimeInput>) {
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error("expected failure");
  return result;
}

describe("parseTimeInput：时间戳", () => {
  it("10 位按 Unix 秒", () => {
    const result = expectOk(parseTimeInput("1783411200", NOW));
    expect(result.kind).toBe("unix-seconds");
    expect(result.ms).toBe(NOW);
  });

  it("13 位按 Unix 毫秒", () => {
    const result = expectOk(parseTimeInput("1783411200000", NOW));
    expect(result.kind).toBe("unix-millis");
    expect(result.ms).toBe(NOW);
  });

  it("3–7 位按 Unix 秒", () => {
    const result = expectOk(parseTimeInput("86400", NOW));
    expect(result.kind).toBe("unix-seconds");
    expect(result.ms).toBe(86400_000);
  });

  it("8 位非合法日期回退为 Unix 秒", () => {
    const result = expectOk(parseTimeInput("99999999", NOW));
    expect(result.kind).toBe("unix-seconds");
  });

  it("14 位及以上报错", () => {
    expectFail(parseTimeInput("17834112000000", NOW));
  });
});

describe("parseTimeInput：日期与日期时间", () => {
  it("紧凑日期 20260101", () => {
    const result = expectOk(parseTimeInput("20260101", NOW));
    expect(result.kind).toBe("date");
    expect(result.ms).toBe(1767196800_000); // 北京时间 2026-01-01 00:00:00
  });

  it("横线日期 2026-01-01", () => {
    const result = expectOk(parseTimeInput("2026-01-01", NOW));
    expect(result.ms).toBe(1767196800_000);
  });

  it("斜线日期 2026/01/01", () => {
    const result = expectOk(parseTimeInput("2026/01/01", NOW));
    expect(result.ms).toBe(1767196800_000);
  });

  it("日期时间 2026-07-07 16:00:00 按北京时间解释", () => {
    const result = expectOk(parseTimeInput("2026-07-07 16:00:00", NOW));
    expect(result.kind).toBe("datetime");
    expect(result.ms).toBe(NOW);
  });

  it("秒可省略", () => {
    const result = expectOk(parseTimeInput("2026-07-07 16:00", NOW));
    expect(result.ms).toBe(NOW);
  });

  it("T 分隔与时区后缀（后缀忽略，仍按 UTC+8）", () => {
    const result = expectOk(parseTimeInput("2026-07-07T16:00:00Z", NOW));
    expect(result.ms).toBe(NOW);
    const withOffset = expectOk(parseTimeInput("2026-07-07T16:00:00+08:00", NOW));
    expect(withOffset.ms).toBe(NOW);
  });

  it("斜线日期时间", () => {
    const result = expectOk(parseTimeInput("2026/07/07 16:00:00", NOW));
    expect(result.ms).toBe(NOW);
  });

  it("无效日期报错", () => {
    expectFail(parseTimeInput("2026-02-30", NOW));
    expectFail(parseTimeInput("2026-13-01 10:00:00", NOW));
  });

  it("8 位数字月份非法时回退为 Unix 秒", () => {
    const result = expectOk(parseTimeInput("20261301", NOW));
    expect(result.kind).toBe("unix-seconds");
  });

  it("无效时间报错", () => {
    expectFail(parseTimeInput("2026-01-01 25:00:00", NOW));
  });
});

describe("parseTimeInput：单时间（北京时间今天 2026-07-07）", () => {
  it("纯小时 13 → 今天 13:00:00", () => {
    const result = expectOk(parseTimeInput("13", NOW));
    expect(result.kind).toBe("time");
    expect(result.ms).toBe(NOW - 3 * 3600_000);
  });

  it("0 点", () => {
    const result = expectOk(parseTimeInput("0", NOW));
    expect(result.ms).toBe(NOW - 16 * 3600_000);
  });

  it("24–99 报错并提示", () => {
    const result = expectFail(parseTimeInput("25", NOW));
    expect(result.message).toContain("0–23");
  });

  it("13:55 → 今天 13:55:00", () => {
    const result = expectOk(parseTimeInput("13:55", NOW));
    expect(result.kind).toBe("time");
    expect(result.ms).toBe(NOW - (2 * 3600_000 + 5 * 60_000));
  });

  it("13:55:01", () => {
    const result = expectOk(parseTimeInput("13:55:01", NOW));
    expect(result.ms).toBe(NOW - (2 * 3600_000 + 5 * 60_000) + 1000);
  });

  it("中文格式 13时55分01秒 / 13时55分 / 13时", () => {
    expect(expectOk(parseTimeInput("13时55分01秒", NOW)).ms).toBe(
      NOW - (2 * 3600_000 + 5 * 60_000) + 1000,
    );
    expect(expectOk(parseTimeInput("13时55分", NOW)).ms).toBe(NOW - (2 * 3600_000 + 5 * 60_000));
    expect(expectOk(parseTimeInput("13时", NOW)).ms).toBe(NOW - 3 * 3600_000);
  });

  it("无效时间 25:00 / 13:61 报错", () => {
    expectFail(parseTimeInput("25:00", NOW));
    expectFail(parseTimeInput("13:61", NOW));
  });

  it("跨天边界：now 为北京时间深夜时“今天”仍按北京时间", () => {
    // 北京时间 2026-07-08 00:30（UTC 2026-07-07 16:30）
    const lateNow = NOW + 8 * 3600_000 + 30 * 60_000;
    const result = expectOk(parseTimeInput("13", lateNow));
    // 北京时间 2026-07-08 13:00:00
    expect(result.ms).toBe(NOW + DAY_MS - 3 * 3600_000);
  });
});

describe("parseTimeInput：其他", () => {
  it("空输入报错", () => {
    expectFail(parseTimeInput("   ", NOW));
  });

  it("负数不支持", () => {
    expectFail(parseTimeInput("-86400", NOW));
  });

  it("无法识别的文本报错并说明支持形式", () => {
    const result = expectFail(parseTimeInput("hello", NOW));
    expect(result.message).toContain("无法识别");
  });
});

describe("formatTime", () => {
  it("北京时间 2026-07-07 16:00:00 的全部输出", () => {
    const display = formatTime(NOW);
    expect(display.unixSeconds).toBe("1783411200");
    expect(display.unixMillis).toBe("1783411200000");
    expect(display.beijing).toBe("2026-07-07 16:00:00");
    expect(display.beijingCompact).toBe("20260707160000");
    expect(display.iso).toBe("2026-07-07T16:00:00+08:00");
    expect(display.utc).toBe("2026-07-07 08:00:00 UTC");
    expect(display.weekday).toBe("星期二");
  });

  it("北京时间与 UTC 恒差 8 小时", () => {
    const display = formatTime(1767196800_000); // 北京时间 2026-01-01 00:00:00
    expect(display.beijing).toBe("2026-01-01 00:00:00");
    expect(display.utc).toBe("2025-12-31 16:00:00 UTC");
  });

  it("跨日界时星期按北京时间", () => {
    // 北京时间 2026-07-08 00:30（UTC 还是 7 日）
    const display = formatTime(NOW + 8 * 3600_000 + 30 * 60_000);
    expect(display.beijing).toBe("2026-07-08 00:30:00");
    expect(display.weekday).toBe("星期三");
  });

  it("毫秒保留在 unixMillis，秒级展示向下取整", () => {
    const display = formatTime(NOW + 123);
    expect(display.unixMillis).toBe("1783411200123");
    expect(display.unixSeconds).toBe("1783411200");
    expect(display.beijing).toBe("2026-07-07 16:00:00");
  });
});
