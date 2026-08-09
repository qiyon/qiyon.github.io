import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";

const EXPECTED_POST_COUNT = 70;
const DIST_DIRECTORY = "dist";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`[validate:routes] ${message}`);
}

async function isFile(path: string) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

async function exists(path: string) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

for (const route of [
  "index.html",
  "about/index.html",
  "404.html",
  "rss.xml",
  "sitemap-index.xml",
  "CNAME",
  "favicon.ico",
  "robots.txt",
  "tool/index.html",
  "tool/json/index.html",
  "tool/unixtimestamp/index.html",
  "tool/logview/index.html",
]) {
  assert(await isFile(join(DIST_DIRECTORY, route)), `缺少构建产物：${route}`);
}

const postRoot = join(DIST_DIRECTORY, "post");
const postIds = (await readdir(postRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
assert(
  postIds.length === EXPECTED_POST_COUNT,
  `文章页面应为 ${EXPECTED_POST_COUNT} 个，实际为 ${postIds.length} 个`,
);

for (const id of postIds) {
  const routeFile = join(postRoot, id, "index.html");
  assert(await isFile(routeFile), `缺少文章页面：/post/${id}/`);
  const html = await readFile(routeFile, "utf8");
  const h1Count = html.match(/<h1(?:\s|>)/g)?.length ?? 0;
  assert(h1Count === 1, `/post/${id}/ 应只有一个 H1，实际为 ${h1Count}`);
  assert(html.includes(`/src/content/posts/${id}.md`), `/post/${id}/ 的 GitHub 源文件链接无效`);
  assert(!html.includes("posts.json"), `/post/${id}/ 仍引用 posts.json`);
  assert(!html.includes("/js/app.js"), `/post/${id}/ 仍引用旧客户端包`);
}

assert(!(await exists(join(DIST_DIRECTORY, "posts"))), "不应生成旧 /posts/*.md 兼容路由");

const home = await readFile(join(DIST_DIRECTORY, "index.html"), "utf8");
assert(!home.includes("posts.json"), "首页仍引用 posts.json");
assert(!home.includes("/js/app.js"), "首页仍引用旧客户端包");

for (const route of ["tool/json", "tool/unixtimestamp", "tool/logview"]) {
  const html = await readFile(join(DIST_DIRECTORY, route, "index.html"), "utf8");
  assert(!html.includes("posts.json"), `/${route}/ 仍引用 posts.json`);
  assert(!html.includes("/js/app.js"), `/${route}/ 仍引用旧客户端包`);
}

console.log(`路由验证通过：${postIds.length} 个文章页面，未生成旧 Markdown 兼容路由。`);
