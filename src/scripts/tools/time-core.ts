/**
 * Unix 时间戳工具核心逻辑：输入自动识别、UTC+8 解析与格式化。
 * 纯函数模块，不访问 DOM，不依赖浏览器时区与 ICU 数据。
 *
 * 约定：内部统一使用 UTC 毫秒数；解析与格式化全部按北京时间（UTC+8）。
 * 禁止使用 Date.parse / new Date(string) 及本地时区 getter 处理用户输入。
 */

export type TimeInputKind = "datetime" | "date" | "time" | "unix-seconds" | "unix-millis";

export const TIME_INPUT_KIND_LABELS: Record<TimeInputKind, string> = {
  datetime: "日期时间（按北京时间解释）",
  date: "日期（北京时间当日 00:00:00）",
  time: "时间（北京时间今天）",
  "unix-seconds": "Unix 秒",
  "unix-millis": "Unix 毫秒",
};

export interface TimeParseSuccess {
  ok: true;
  kind: TimeInputKind;
  ms: number;
}

export interface TimeParseFailure {
  ok: false;
  message: string;
}

export type TimeParseResult = TimeParseSuccess | TimeParseFailure;

const BEIJING_OFFSET_MS = 8 * 3600_000;

/** 将北京时间年月日时分秒转换为 UTC 毫秒。 */
function beijingMs(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  millis = 0,
): number {
  return Date.UTC(year, month - 1, day, hour, minute, second, millis) - BEIJING_OFFSET_MS;
}

/** 真实历法校验（拒绝 2026-02-30 这类日期）。 */
function isValidDate(year: number, month: number, day: number): boolean {
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}

function isValidTime(hour: number, minute: number, second: number): boolean {
  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59 && second >= 0 && second <= 59;
}

/** 北京时间“今天”的年月日（now 为 UTC 毫秒）。 */
function beijingToday(now: number): { year: number; month: number; day: number } {
  const shifted = new Date(now + BEIJING_OFFSET_MS);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  };
}

// 2026-01-01 13:55:01 / 2026-01-01T13:55 / 2026/01/01 13:55:01.123（时区后缀忽略，按 UTC+8 解释）
const DATETIME_PATTERN =
  /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d{1,3}))?)?(?:\s*(?:[zZ]|[+-]\d{2}:?\d{2}))?$/;
// 2026-01-01 / 2026/01/01
const DATE_PATTERN = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/;
// 20260101
const COMPACT_DATE_PATTERN = /^(\d{4})(\d{2})(\d{2})$/;
// 13:55 / 13:55:01
const COLON_TIME_PATTERN = /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/;
// 13时 / 13时55分 / 13时55分01秒
const CN_TIME_PATTERN = /^(\d{1,2})时(?:(\d{1,2})分)?(?:(\d{1,2})秒?)?$/;
const DIGITS_PATTERN = /^\d+$/;

function fail(message: string): TimeParseFailure {
  return { ok: false, message };
}

function invalidInput(): TimeParseFailure {
  return fail(
    "无法识别输入。支持：Unix 秒（9–10 位）、Unix 毫秒（11–13 位）、日期时间（2026-01-01 13:55:01）、日期（20260101）、时间（13 / 13:55 / 13:55:01）",
  );
}

/**
 * 自动识别输入并解析为 UTC 毫秒。
 * now 用于“今天”基准，注入以保证测试确定性。
 */
export function parseTimeInput(raw: string, now: number): TimeParseResult {
  const text = raw.trim();
  if (text === "") return fail("输入为空");

  const datetime = text.match(DATETIME_PATTERN);
  if (datetime) {
    const [, y, mo, d, h, mi, s, fraction] = datetime;
    const year = Number(y);
    const month = Number(mo);
    const day = Number(d);
    const hour = Number(h);
    const minute = Number(mi);
    const second = Number(s ?? "0");
    if (!isValidDate(year, month, day)) return fail(`无效日期：${y}-${mo}-${d}`);
    if (!isValidTime(hour, minute, second)) return fail(`无效时间：${h}:${mi}:${s ?? "0"}`);
    const millis = fraction ? Number(fraction.padEnd(3, "0")) : 0;
    return {
      ok: true,
      kind: "datetime",
      ms: beijingMs(year, month, day, hour, minute, second, millis),
    };
  }

  const date = text.match(DATE_PATTERN);
  if (date) {
    const [, y, mo, d] = date;
    if (!isValidDate(Number(y), Number(mo), Number(d))) return fail(`无效日期：${text}`);
    return { ok: true, kind: "date", ms: beijingMs(Number(y), Number(mo), Number(d), 0, 0, 0) };
  }

  const colonTime = text.match(COLON_TIME_PATTERN);
  if (colonTime) {
    const [, h, mi, s] = colonTime;
    const hour = Number(h);
    const minute = Number(mi);
    const second = Number(s ?? "0");
    if (!isValidTime(hour, minute, second)) return fail(`无效时间：${text}（时 0–23，分秒 0–59）`);
    const today = beijingToday(now);
    return {
      ok: true,
      kind: "time",
      ms: beijingMs(today.year, today.month, today.day, hour, minute, second),
    };
  }

  const cnTime = text.match(CN_TIME_PATTERN);
  if (cnTime) {
    const [, h, mi, s] = cnTime;
    const hour = Number(h);
    const minute = Number(mi ?? "0");
    const second = Number(s ?? "0");
    if (!isValidTime(hour, minute, second)) return fail(`无效时间：${text}（时 0–23，分秒 0–59）`);
    const today = beijingToday(now);
    return {
      ok: true,
      kind: "time",
      ms: beijingMs(today.year, today.month, today.day, hour, minute, second),
    };
  }

  const compactDate = text.match(COMPACT_DATE_PATTERN);
  if (
    compactDate &&
    isValidDate(Number(compactDate[1]), Number(compactDate[2]), Number(compactDate[3]))
  ) {
    return {
      ok: true,
      kind: "date",
      ms: beijingMs(
        Number(compactDate[1]),
        Number(compactDate[2]),
        Number(compactDate[3]),
        0,
        0,
        0,
      ),
    };
  }

  if (DIGITS_PATTERN.test(text)) {
    const length = text.length;
    if (length <= 2) {
      const hour = Number(text);
      if (hour <= 23) {
        const today = beijingToday(now);
        return {
          ok: true,
          kind: "time",
          ms: beijingMs(today.year, today.month, today.day, hour, 0, 0),
        };
      }
      return fail(`按小时解读需在 0–23 之间；若为时间戳请提供完整 Unix 秒或毫秒`);
    }
    if (length <= 10) return { ok: true, kind: "unix-seconds", ms: Number(text) * 1000 };
    if (length <= 13) return { ok: true, kind: "unix-millis", ms: Number(text) };
    return fail("暂不支持 14 位及以上时间戳（微秒/纳秒）");
  }

  return invalidInput();
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"] as const;

export interface TimeDisplay {
  unixSeconds: string;
  unixMillis: string;
  beijing: string;
  beijingCompact: string;
  iso: string;
  utc: string;
  weekday: string;
}

/** 将 UTC 毫秒格式化为多种展示形式（日期时间按北京时间，另附 UTC）。 */
export function formatTime(ms: number): TimeDisplay {
  const beijing = new Date(ms + BEIJING_OFFSET_MS);
  const utc = new Date(ms);

  const bjDate = `${beijing.getUTCFullYear()}-${pad2(beijing.getUTCMonth() + 1)}-${pad2(beijing.getUTCDate())}`;
  const bjTime = `${pad2(beijing.getUTCHours())}:${pad2(beijing.getUTCMinutes())}:${pad2(beijing.getUTCSeconds())}`;
  const utcDate = `${utc.getUTCFullYear()}-${pad2(utc.getUTCMonth() + 1)}-${pad2(utc.getUTCDate())}`;
  const utcTime = `${pad2(utc.getUTCHours())}:${pad2(utc.getUTCMinutes())}:${pad2(utc.getUTCSeconds())}`;

  return {
    unixSeconds: String(Math.floor(ms / 1000)),
    unixMillis: String(Math.floor(ms)),
    beijing: `${bjDate} ${bjTime}`,
    beijingCompact: `${beijing.getUTCFullYear()}${pad2(beijing.getUTCMonth() + 1)}${pad2(beijing.getUTCDate())}${pad2(beijing.getUTCHours())}${pad2(beijing.getUTCMinutes())}${pad2(beijing.getUTCSeconds())}`,
    iso: `${bjDate}T${bjTime}+08:00`,
    utc: `${utcDate} ${utcTime} UTC`,
    weekday: `星期${WEEKDAYS[beijing.getUTCDay()]}`,
  };
}
