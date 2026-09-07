import { readdir, readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { parse } from "yaml";

const EXPECTED_POST_COUNT = 70;
const CONTENT_DIRECTORY = "posts";

interface Frontmatter {
  title?: unknown;
  publishedAt?: unknown;
  tags?: unknown;
  draft?: unknown;
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`[validate:content] ${message}`);
}

function splitMarkdown(markdown: string, id: string) {
  const match = /^---\n([\s\S]*?)\n---\n(?:\n|$)([\s\S]*)$/.exec(markdown);
  assert(match, `${id}.md 缺少合法 Frontmatter`);
  return { frontmatter: match[1], body: match[2] };
}

const files = (await readdir(CONTENT_DIRECTORY)).filter((file) => file.endsWith(".md")).sort();
assert(
  files.length === EXPECTED_POST_COUNT,
  `应有 ${EXPECTED_POST_COUNT} 篇，实际为 ${files.length} 篇`,
);

const ids = new Set<string>();
for (const file of files) {
  const id = basename(file, ".md");
  assert(!ids.has(id), `重复 ID：${id}`);
  ids.add(id);

  const markdown = await readFile(join(CONTENT_DIRECTORY, file), "utf8");
  const { frontmatter: yaml, body } = splitMarkdown(markdown, id);
  const data = parse(yaml) as Frontmatter;

  assert(typeof data.title === "string" && data.title.trim().length > 0, `${id} 标题无效`);
  assert(
    typeof data.publishedAt === "string" &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+08:00$/.test(data.publishedAt) &&
      !Number.isNaN(Date.parse(data.publishedAt)),
    `${id} 发布时间无效`,
  );
  assert(
    Array.isArray(data.tags) &&
      data.tags.length > 0 &&
      data.tags.every((tag) => typeof tag === "string" && tag.trim().length > 0),
    `${id} 标签无效`,
  );
  assert(data.draft === false, `${id} 的 draft 应为 false`);
  assert(body.trim().length > 0, `${id} 正文为空`);
  assert(!/^#\s+/.test(body), `${id} 正文开头仍包含一级标题`);
}

console.log(`内容验证通过：${files.length} 篇文章，${ids.size} 个唯一 ID。`);
