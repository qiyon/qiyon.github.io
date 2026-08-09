import { copyText, showStatus } from "./clipboard";
import { formatJson } from "./json-core";
import { type LogLine, type LogLinesResult, parseLogInput } from "./log-core";

const MAX_RENDER_LINES = 5000;

const input = document.querySelector<HTMLTextAreaElement>("[data-log-input]");
const parseButton = document.querySelector<HTMLButtonElement>("[data-log-parse]");
const copyButton = document.querySelector<HTMLButtonElement>("[data-log-copy]");
const clearButton = document.querySelector<HTMLButtonElement>("[data-log-clear]");
const status = document.querySelector<HTMLElement>("[data-log-status]");
const jsonView = document.querySelector<HTMLElement>("[data-log-json-view]");
const jsonOutput = document.querySelector<HTMLElement>("[data-log-json-output]");
const linesView = document.querySelector<HTMLElement>("[data-log-lines-view]");
const linesList = document.querySelector<HTMLOListElement>("[data-log-lines]");

let lastPlainText = "";

function renderLine(line: LogLine): HTMLLIElement {
  const item = document.createElement("li");
  item.className = "log-line";
  if (line.level) {
    item.dataset.level = line.level.toLowerCase();
    const badge = document.createElement("span");
    badge.className = `log-badge log-badge-${line.level.toLowerCase()}`;
    badge.textContent = line.level;
    item.append(badge);
  }
  if (line.prefix !== "") {
    const prefix = document.createElement("span");
    prefix.className = "log-text";
    prefix.textContent = line.prefix;
    item.append(prefix);
  }
  if (line.json !== null) {
    const details = document.createElement("details");
    details.className = "log-json";
    details.open = true;
    const summary = document.createElement("summary");
    summary.textContent = "JSON";
    const pre = document.createElement("pre");
    pre.textContent = formatJson(line.json, { indent: 2, compact: true });
    details.append(summary, pre);
    item.append(details);
  }
  if (line.suffix !== "") {
    const suffix = document.createElement("span");
    suffix.className = "log-text";
    suffix.textContent = line.suffix;
    item.append(suffix);
  }
  if (item.childNodes.length === 0) {
    // 空行占位，保持行号与视觉节奏
    const blank = document.createElement("span");
    blank.className = "log-text";
    blank.textContent = " ";
    item.append(blank);
  }
  return item;
}

function statsMessage(result: LogLinesResult): string {
  const parts = [`共 ${result.stats.total} 行`];
  if (result.stats.withJson > 0) parts.push(`含 JSON ${result.stats.withJson} 行`);
  const levelParts = Object.entries(result.stats.levels)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([level, count]) => `${level} × ${count}`);
  if (levelParts.length > 0) parts.push(levelParts.join("，"));
  if (result.unescaped) parts.push("已自动解除引号转义");
  if (result.stats.total > MAX_RENDER_LINES) {
    parts.push(`仅渲染前 ${MAX_RENDER_LINES} 行`);
  }
  return parts.join("；");
}

function renderLines(result: LogLinesResult): void {
  if (!linesList || !linesView) return;
  const visible = result.lines.slice(0, MAX_RENDER_LINES);
  const fragment = document.createDocumentFragment();
  for (const line of visible) fragment.append(renderLine(line));
  linesList.replaceChildren(fragment);
  linesView.hidden = false;
  showStatus(status, statsMessage(result), "info");
  lastPlainText = result.lines.map((line) => line.raw).join("\n");
}

function parseAndRender(): void {
  if (!input) return;
  if (input.value.trim() === "") {
    showStatus(status, "输入为空", "error");
    return;
  }
  const result = parseLogInput(input.value);

  if (jsonView) jsonView.hidden = true;
  if (linesView) linesView.hidden = true;

  if (result.kind === "json") {
    const text = formatJson(result.value, { indent: 2, compact: true });
    if (jsonOutput) jsonOutput.textContent = text;
    if (jsonView) jsonView.hidden = false;
    showStatus(
      status,
      result.unescaped ? "已自动解除引号转义，识别为 JSON 数据" : "识别为 JSON 数据",
      "info",
    );
    lastPlainText = text;
    return;
  }

  renderLines(result);
}

if (input && jsonView && linesView) {
  parseButton?.addEventListener("click", parseAndRender);

  copyButton?.addEventListener("click", async () => {
    if (lastPlainText === "") {
      showStatus(status, "没有可复制的结果，请先解析", "error");
      return;
    }
    const ok = await copyText(lastPlainText);
    showStatus(
      status,
      ok ? "已复制解析结果" : "复制失败，请手动选择复制",
      ok ? "info" : "error",
      false,
    );
  });

  clearButton?.addEventListener("click", () => {
    input.value = "";
    lastPlainText = "";
    if (jsonOutput) jsonOutput.textContent = "";
    if (linesList) linesList.replaceChildren();
    jsonView.hidden = true;
    linesView.hidden = true;
    showStatus(status, "", "info");
    input.focus();
  });
}
