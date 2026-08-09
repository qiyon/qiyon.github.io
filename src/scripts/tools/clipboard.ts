/** 复制到剪贴板与状态提示（工具页面共享）。 */

/** 复制文本，优先使用 Clipboard API，降级到隐藏 textarea。 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // 继续尝试降级方案
  }
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    textarea.remove();
    return ok;
  } catch {
    return false;
  }
}

let statusTimer: number | undefined;

/** 在状态行展示信息，短暂消息自动消失；持久消息传 persist。 */
export function showStatus(
  el: HTMLElement | null,
  message: string,
  kind: "info" | "error" = "info",
  persist = true,
): void {
  if (!el) return;
  if (statusTimer !== undefined) {
    window.clearTimeout(statusTimer);
    statusTimer = undefined;
  }
  el.textContent = message;
  el.dataset.kind = kind;
  el.hidden = message === "";
  if (!persist && message !== "") {
    statusTimer = window.setTimeout(() => {
      el.textContent = "";
      el.hidden = true;
    }, 1500);
  }
}
