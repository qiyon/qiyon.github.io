import { copyText, showStatus } from "./clipboard";
import { formatJson } from "./json-core";
import {
  type LogJsonSegment,
  type LogLinesResult,
  type LogParseResult,
  type LogRecord,
  parseLogInput,
} from "./log-core";

const MAX_RENDER_RECORDS = 3000;

const input = document.querySelector<HTMLTextAreaElement>("[data-log-input]");
const decodeInput = document.querySelector<HTMLInputElement>("[data-log-decode]");
const parseButton = document.querySelector<HTMLButtonElement>("[data-log-parse]");
const expandButton = document.querySelector<HTMLButtonElement>("[data-log-expand]");
const collapseButton = document.querySelector<HTMLButtonElement>("[data-log-collapse]");
const copyButton = document.querySelector<HTMLButtonElement>("[data-log-copy]");
const clearButton = document.querySelector<HTMLButtonElement>("[data-log-clear]");
const status = document.querySelector<HTMLElement>("[data-log-status]");
const jsonView = document.querySelector<HTMLElement>("[data-log-json-view]");
const jsonNote = document.querySelector<HTMLElement>("[data-log-json-note]");
const jsonOutput = document.querySelector<HTMLElement>("[data-log-json-output]");
const jsonOriginalView = document.querySelector<HTMLDetailsElement>(
  "[data-log-json-original-view]",
);
const jsonOriginalOutput = document.querySelector<HTMLElement>("[data-log-json-original-output]");
const linesView = document.querySelector<HTMLElement>("[data-log-lines-view]");
const linesList = document.querySelector<HTMLOListElement>("[data-log-lines]");

let lastResult: LogParseResult | null = null;
let lastSource = "";

function decodedPathMessage(paths: string[]): string {
  const visible = paths.slice(0, 4).join("、");
  return paths.length > 4 ? `${visible} 等 ${paths.length} 处` : visible;
}

function renderJsonSegment(segment: LogJsonSegment, decode: boolean): HTMLDetailsElement {
  const details = document.createElement("details");
  details.className = "log-json";
  details.open = true;

  const summary = document.createElement("summary");
  const expanded = decode && segment.decodedPaths.length > 0;
  if (segment.encoded) {
    summary.textContent = expanded ? "转义 JSON · 已解码" : "转义 JSON";
  } else {
    summary.textContent = expanded ? `JSON · 已展开 ${segment.decodedPaths.length} 处` : "JSON";
  }
  const pre = document.createElement("pre");
  pre.textContent = formatJson(expanded ? segment.displayValue : segment.value, {
    indent: 2,
    compact: true,
  });
  details.append(summary, pre);

  if (expanded) {
    const note = document.createElement("p");
    note.className = "log-json-note";
    note.textContent = `已展开：${decodedPathMessage(segment.decodedPaths)}`;
    details.append(note);

    const original = document.createElement("details");
    original.className = "log-original";
    const originalSummary = document.createElement("summary");
    originalSummary.textContent = "查看原始编码";
    const originalPre = document.createElement("pre");
    originalPre.textContent = formatJson(segment.value, { indent: 2, compact: true });
    original.append(originalSummary, originalPre);
    details.append(original);
  }
  return details;
}

function lineLabel(record: LogRecord): string {
  return record.startLine === record.endLine
    ? String(record.startLine)
    : `${record.startLine}–${record.endLine}`;
}

function renderRecord(record: LogRecord, decode: boolean): HTMLLIElement {
  const item = document.createElement("li");
  item.className = "log-line";
  if (record.level) item.dataset.level = record.level.toLowerCase();

  const lineNumber = document.createElement("span");
  lineNumber.className = "log-line-number";
  lineNumber.textContent = lineLabel(record);
  lineNumber.title = `原始行 ${lineLabel(record)}`;
  item.append(lineNumber);

  if (record.level) {
    const badge = document.createElement("span");
    badge.className = `log-badge log-badge-${record.level.toLowerCase()}`;
    badge.textContent = record.level;
    item.append(badge);
  }
  for (const segment of record.segments) {
    if (segment.kind === "json") {
      item.append(renderJsonSegment(segment, decode));
      continue;
    }
    if (segment.text === "" && record.raw !== "") continue;
    const text = document.createElement("span");
    text.className = "log-text";
    text.textContent = segment.text === "" ? " " : segment.text;
    item.append(text);
  }
  return item;
}

function statsMessage(result: LogLinesResult): string {
  const parts = [`共 ${result.stats.total} 条记录 / ${result.stats.physicalLines} 行`];
  if (result.stats.jsonFragments > 0) {
    parts.push(`${result.stats.withJson} 条含 ${result.stats.jsonFragments} 个 JSON`);
  }
  if (result.stats.decodedFields > 0)
    parts.push(`可展开 ${result.stats.decodedFields} 处 JSON 字符串`);
  const levelParts = Object.entries(result.stats.levels)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([level, count]) => `${level} × ${count}`);
  if (levelParts.length > 0) parts.push(levelParts.join("，"));
  if (result.unescaped) parts.push("已自动解除整段日志的引号转义");
  if (result.stats.total > MAX_RENDER_RECORDS) {
    parts.push(`仅渲染前 ${MAX_RENDER_RECORDS} 条记录`);
  }
  return parts.join("；");
}

function renderLines(result: LogLinesResult): void {
  if (!linesList || !linesView) return;
  const decode = decodeInput?.checked ?? true;
  const visible = result.records.slice(0, MAX_RENDER_RECORDS);
  const fragment = document.createDocumentFragment();
  for (const record of visible) fragment.append(renderRecord(record, decode));
  linesList.replaceChildren(fragment);
  linesView.hidden = false;
  showStatus(status, statsMessage(result), "info");
}

function renderWholeJson(result: Extract<LogParseResult, { kind: "json" }>): void {
  const decode = decodeInput?.checked ?? true;
  const expanded = decode && result.decodedPaths.length > 0;
  const text = formatJson(expanded ? result.displayValue : result.value, {
    indent: 2,
    compact: true,
  });
  if (jsonOutput) jsonOutput.textContent = text;
  if (jsonView) jsonView.hidden = false;

  if (jsonNote) {
    jsonNote.hidden = !expanded;
    jsonNote.textContent = expanded
      ? `已展开 JSON 字符串字段：${decodedPathMessage(result.decodedPaths)}`
      : "";
  }
  if (jsonOriginalView && jsonOriginalOutput) {
    jsonOriginalView.hidden = !expanded;
    jsonOriginalView.open = false;
    jsonOriginalOutput.textContent = expanded
      ? formatJson(result.value, { indent: 2, compact: true })
      : "";
  }
  const message = [result.unescaped ? "已自动解除整段内容的引号转义" : "识别为 JSON 数据"];
  if (result.decodedPaths.length > 0) {
    message.push(`发现 ${result.decodedPaths.length} 处 JSON 字符串字段`);
  }
  showStatus(status, message.join("；"), "info");
}

function renderResult(result: LogParseResult): void {
  if (jsonView) jsonView.hidden = true;
  if (linesView) linesView.hidden = true;
  if (result.kind === "json") renderWholeJson(result);
  else renderLines(result);
}

function parseAndRender(): void {
  if (!input) return;
  if (input.value.trim() === "") {
    showStatus(status, "输入为空", "error");
    return;
  }
  lastSource = input.value;
  lastResult = parseLogInput(input.value);
  renderResult(lastResult);
}

function setAllJsonOpen(open: boolean): void {
  document.querySelectorAll<HTMLDetailsElement>(".log-json").forEach((details) => {
    details.open = open;
  });
}

if (input && jsonView && linesView) {
  parseButton?.addEventListener("click", parseAndRender);
  decodeInput?.addEventListener("change", () => {
    if (lastResult) renderResult(lastResult);
  });
  input.addEventListener("input", () => {
    if (input.value === lastSource) return;
    lastResult = null;
    lastSource = "";
  });
  expandButton?.addEventListener("click", () => setAllJsonOpen(true));
  collapseButton?.addEventListener("click", () => setAllJsonOpen(false));

  copyButton?.addEventListener("click", async () => {
    if (!lastResult || lastSource === "") {
      showStatus(status, "没有可复制的结果，请先解析", "error");
      return;
    }
    const ok = await copyText(lastSource);
    showStatus(
      status,
      ok ? "已复制原始日志" : "复制失败，请手动选择复制",
      ok ? "info" : "error",
      false,
    );
  });

  clearButton?.addEventListener("click", () => {
    input.value = "";
    lastResult = null;
    lastSource = "";
    if (jsonOutput) jsonOutput.textContent = "";
    if (jsonOriginalOutput) jsonOriginalOutput.textContent = "";
    if (linesList) linesList.replaceChildren();
    jsonView.hidden = true;
    linesView.hidden = true;
    showStatus(status, "", "info");
    input.focus();
  });
}
