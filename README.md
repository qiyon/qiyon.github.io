# qiyon.github.io

HeQiyong 的个人技术网站，使用 Astro 静态生成并部署到 GitHub Pages。

## 本地开发

需要 Bun `1.3.14`。

```bash
bun install --frozen-lockfile
bun run dev
```

## 检查与构建

```bash
bun run verify
```

文章按 Frontmatter 中 `publishedAt` 的年月存放在根目录 `posts/YYYYMM/`，例如 `posts/201704/php-stream.md`。新增文章时使用现有 Frontmatter 格式，文件名必须全局唯一。文件名即稳定文章 ID，网页路由保持 `/post/<id>/`，不包含年月目录。

构建产物写入 `dist/`，不提交到源码分支。
