type ThemePreference = "light" | "dark" | "system";

const STORAGE_KEY = "qiyon-theme";
const root = document.documentElement;
const themeSelect = document.querySelector<HTMLSelectElement>("[data-theme-select]");
const colorPreference = window.matchMedia("(prefers-color-scheme: dark)");

function isThemePreference(value: string | null): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

function savedPreference(): ThemePreference {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return isThemePreference(saved) ? saved : "system";
  } catch {
    return "system";
  }
}

function applyTheme(preference: ThemePreference) {
  const resolved =
    preference === "system" ? (colorPreference.matches ? "dark" : "light") : preference;
  root.classList.toggle("dark", resolved === "dark");
  root.dataset.theme = resolved;
  root.style.colorScheme = resolved;
}

function setTheme(preference: ThemePreference) {
  try {
    window.localStorage.setItem(STORAGE_KEY, preference);
  } catch {
    // Storage may be disabled; the selected theme still applies for this page.
  }
  applyTheme(preference);
}

const initialPreference = savedPreference();
applyTheme(initialPreference);
if (themeSelect) {
  themeSelect.value = initialPreference;
  themeSelect.addEventListener("change", () => {
    if (isThemePreference(themeSelect.value)) setTheme(themeSelect.value);
  });
}

colorPreference.addEventListener("change", () => {
  if (savedPreference() === "system") applyTheme("system");
});
