import { copyText, showStatus } from "./clipboard";
import { formatTime, parseTimeInput, TIME_INPUT_KIND_LABELS } from "./time-core";

const input = document.querySelector<HTMLInputElement>("[data-time-input]");
const parseButton = document.querySelector<HTMLButtonElement>("[data-time-parse]");
const status = document.querySelector<HTMLElement>("[data-time-status]");
const resultPanel = document.querySelector<HTMLElement>("[data-time-result]");
const resultKind = document.querySelector<HTMLElement>("[data-time-kind]");
const nowSeconds = document.querySelector<HTMLElement>("[data-now-seconds]");
const nowMillis = document.querySelector<HTMLElement>("[data-now-millis]");
const nowBeijing = document.querySelector<HTMLElement>("[data-now-beijing]");
const fillNowButton = document.querySelector<HTMLButtonElement>("[data-now-fill]");

const RESULT_KEYS = [
  "unix-seconds",
  "unix-millis",
  "beijing",
  "beijing-compact",
  "iso",
  "utc",
  "weekday",
] as const;

type ResultKey = (typeof RESULT_KEYS)[number];

const resultValues = new Map<ResultKey, HTMLElement>();
const copyButtons = new Map<ResultKey, HTMLButtonElement>();
for (const key of RESULT_KEYS) {
  const valueEl = document.querySelector<HTMLElement>(`[data-result="${key}"]`);
  const copyEl = document.querySelector<HTMLButtonElement>(`[data-copy="${key}"]`);
  if (valueEl) resultValues.set(key, valueEl);
  if (copyEl) copyButtons.set(key, copyEl);
}

let debounceTimer: number | undefined;
let ticker: number | undefined;

function displayKey(key: ResultKey): keyof ReturnType<typeof formatTime> {
  return key === "beijing-compact"
    ? "beijingCompact"
    : key === "unix-seconds"
      ? "unixSeconds"
      : key === "unix-millis"
        ? "unixMillis"
        : key;
}

function renderResult(ms: number, kindLabel: string): void {
  const display = formatTime(ms);
  if (resultKind) resultKind.textContent = kindLabel;
  for (const key of RESULT_KEYS) {
    const value = display[displayKey(key)];
    const valueEl = resultValues.get(key);
    if (valueEl) valueEl.textContent = value;
    const copyEl = copyButtons.get(key);
    if (copyEl) copyEl.hidden = false;
  }
  if (resultPanel) resultPanel.hidden = false;
}

function parseAndRender(): void {
  if (!input) return;
  const text = input.value.trim();
  if (text === "") {
    if (resultPanel) resultPanel.hidden = true;
    showStatus(status, "", "info");
    return;
  }
  const result = parseTimeInput(text, Date.now());
  if (!result.ok) {
    if (resultPanel) resultPanel.hidden = true;
    showStatus(status, result.message, "error");
    return;
  }
  renderResult(result.ms, TIME_INPUT_KIND_LABELS[result.kind]);
  showStatus(status, "", "info");
}

function renderNow(): void {
  const display = formatTime(Date.now());
  if (nowSeconds) nowSeconds.textContent = display.unixSeconds;
  if (nowMillis) nowMillis.textContent = display.unixMillis;
  if (nowBeijing) nowBeijing.textContent = display.beijing;
}

function startTicker(): void {
  if (ticker !== undefined) return;
  renderNow();
  ticker = window.setInterval(renderNow, 1000);
}

function stopTicker(): void {
  if (ticker === undefined) return;
  window.clearInterval(ticker);
  ticker = undefined;
}

if (input) {
  input.addEventListener("input", () => {
    if (debounceTimer !== undefined) window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(parseAndRender, 150);
  });

  parseButton?.addEventListener("click", parseAndRender);

  fillNowButton?.addEventListener("click", () => {
    input.value = String(Math.floor(Date.now() / 1000));
    parseAndRender();
    input.focus();
  });

  for (const [key, button] of copyButtons) {
    button.addEventListener("click", async () => {
      const value = resultValues.get(key)?.textContent ?? "";
      if (value === "" || value === "—") return;
      const ok = await copyText(value);
      showStatus(status, ok ? "已复制" : "复制失败", ok ? "info" : "error", false);
    });
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopTicker();
    else startTicker();
  });

  startTicker();
}
