import { copyText, showStatus } from "./clipboard";
import {
  escapeAsJsonString,
  formatJson,
  type JsonFormatOptions,
  minifyJson,
  parseJsonInput,
  unescapeJsonString,
} from "./json-core";

const OPTIONS_KEY = "qiyon-tool-json-options";

const input = document.querySelector<HTMLTextAreaElement>("[data-json-input]");
const output = document.querySelector<HTMLElement>("[data-json-output]");
const status = document.querySelector<HTMLElement>("[data-json-status]");
const indentRadios = [...document.querySelectorAll<HTMLInputElement>('[name="json-indent"]')];
const compactToggle = document.querySelector<HTMLInputElement>("[data-json-compact]");
const formatButton = document.querySelector<HTMLButtonElement>("[data-json-format]");
const minifyButton = document.querySelector<HTMLButtonElement>("[data-json-minify]");
const escapeButton = document.querySelector<HTMLButtonElement>("[data-json-escape]");
const unescapeButton = document.querySelector<HTMLButtonElement>("[data-json-unescape]");
const copyButton = document.querySelector<HTMLButtonElement>("[data-json-copy]");
const clearButton = document.querySelector<HTMLButtonElement>("[data-json-clear]");

let lastOutput = "";

function loadOptions(): JsonFormatOptions {
  try {
    const saved = window.localStorage.getItem(OPTIONS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<JsonFormatOptions>;
      return {
        indent: parsed.indent === 4 ? 4 : 2,
        compact: parsed.compact !== false,
      };
    }
  } catch {
    // 存储不可用时使用默认选项
  }
  return { indent: 2, compact: true };
}

function saveOptions(options: JsonFormatOptions): void {
  try {
    window.localStorage.setItem(OPTIONS_KEY, JSON.stringify(options));
  } catch {
    // 存储不可用时仅本次会话生效
  }
}

function currentOptions(): JsonFormatOptions {
  const checked = indentRadios.find((radio) => radio.checked);
  return {
    indent: checked?.value === "4" ? 4 : 2,
    compact: compactToggle?.checked ?? true,
  };
}

function applyOptions(options: JsonFormatOptions): void {
  for (const radio of indentRadios) radio.checked = radio.value === String(options.indent);
  if (compactToggle) compactToggle.checked = options.compact;
}

function setOutput(text: string, message: string): void {
  lastOutput = text;
  if (output) output.textContent = text;
  showStatus(status, message, "info");
}

function showParseError(message: string, line: number | null, column: number | null): void {
  const where = line !== null && column !== null ? `（第 ${line} 行第 ${column} 列）` : "";
  showStatus(status, `解析失败${where}：${message}`, "error");
}

if (input && output) {
  applyOptions(loadOptions());

  for (const radio of indentRadios) {
    radio.addEventListener("change", () => saveOptions(currentOptions()));
  }
  compactToggle?.addEventListener("change", () => saveOptions(currentOptions()));

  formatButton?.addEventListener("click", () => {
    const result = parseJsonInput(input.value);
    if (!result.ok) {
      showParseError(result.message, result.line, result.column);
      return;
    }
    const text = formatJson(result.value, currentOptions());
    setOutput(text, result.autoUnescaped ? "已自动解除一层引号转义并格式化" : "格式化完成");
  });

  minifyButton?.addEventListener("click", () => {
    const result = parseJsonInput(input.value);
    if (!result.ok) {
      showParseError(result.message, result.line, result.column);
      return;
    }
    const text = minifyJson(result.value);
    setOutput(text, result.autoUnescaped ? "已自动解除一层引号转义并压缩" : "压缩完成");
  });

  escapeButton?.addEventListener("click", () => {
    if (input.value === "") {
      showStatus(status, "输入为空", "error");
      return;
    }
    setOutput(escapeAsJsonString(input.value), "已添加转义");
  });

  unescapeButton?.addEventListener("click", () => {
    const result = unescapeJsonString(input.value);
    if (!result.ok) {
      showStatus(status, result.message, "error");
      return;
    }
    setOutput(result.text, "已去除转义");
  });

  copyButton?.addEventListener("click", async () => {
    if (lastOutput === "") {
      showStatus(status, "没有可复制的结果", "error");
      return;
    }
    const ok = await copyText(lastOutput);
    showStatus(
      status,
      ok ? "已复制结果" : "复制失败，请手动选择复制",
      ok ? "info" : "error",
      false,
    );
  });

  clearButton?.addEventListener("click", () => {
    input.value = "";
    lastOutput = "";
    output.textContent = "";
    showStatus(status, "", "info");
    input.focus();
  });
}
