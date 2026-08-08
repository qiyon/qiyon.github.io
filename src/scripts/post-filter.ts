const searchInput = document.querySelector<HTMLInputElement>("[data-post-search]");
const tagButtons = [...document.querySelectorAll<HTMLButtonElement>("[data-filter-tag]")];
const postItems = [...document.querySelectorAll<HTMLElement>("[data-post-item]")];
const resultStatus = document.querySelector<HTMLElement>("[data-result-status]");
const emptyState = document.querySelector<HTMLElement>("[data-empty-state]");
const clearButton = document.querySelector<HTMLButtonElement>("[data-clear-filters]");

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("zh-CN");
}

function currentState() {
  const url = new URL(window.location.href);
  return {
    query: url.searchParams.get("q") ?? "",
    tag: url.searchParams.get("tag") ?? "",
  };
}

function syncUrl(query: string, tag: string) {
  const url = new URL(window.location.href);
  if (query) url.searchParams.set("q", query);
  else url.searchParams.delete("q");
  if (tag) url.searchParams.set("tag", tag);
  else url.searchParams.delete("tag");
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

function applyFilters(query: string, tag: string, updateUrl = true) {
  const normalizedQuery = normalize(query);
  const normalizedTag = normalize(tag);
  let visibleCount = 0;

  for (const item of postItems) {
    const searchable = normalize(item.dataset.search ?? "");
    const tags = JSON.parse(item.dataset.tags ?? "[]") as string[];
    const matchesQuery = normalizedQuery === "" || searchable.includes(normalizedQuery);
    const matchesTag =
      normalizedTag === "" || tags.some((itemTag) => normalize(itemTag) === normalizedTag);
    const visible = matchesQuery && matchesTag;
    item.hidden = !visible;
    if (visible) visibleCount += 1;
  }

  for (const button of tagButtons) {
    const selected = normalize(button.dataset.filterTag ?? "") === normalizedTag;
    button.setAttribute("aria-pressed", String(selected));
    button.dataset.selected = String(selected);
  }

  if (resultStatus) resultStatus.textContent = `显示 ${visibleCount} / ${postItems.length} 篇文章`;
  if (emptyState) emptyState.hidden = visibleCount !== 0;
  if (clearButton) clearButton.hidden = normalizedQuery === "" && normalizedTag === "";
  if (updateUrl) syncUrl(query.trim(), tag.trim());
}

if (searchInput && postItems.length > 0) {
  const initial = currentState();
  searchInput.value = initial.query;
  applyFilters(initial.query, initial.tag, false);

  searchInput.addEventListener("input", () => {
    applyFilters(searchInput.value, currentState().tag);
  });

  for (const button of tagButtons) {
    button.addEventListener("click", () => {
      const selectedTag = button.dataset.filterTag ?? "";
      const activeTag = currentState().tag;
      applyFilters(
        searchInput.value,
        normalize(selectedTag) === normalize(activeTag) ? "" : selectedTag,
      );
    });
  }

  clearButton?.addEventListener("click", () => {
    searchInput.value = "";
    applyFilters("", "");
    searchInput.focus();
  });

  window.addEventListener("popstate", () => {
    const state = currentState();
    searchInput.value = state.query;
    applyFilters(state.query, state.tag, false);
  });
}
