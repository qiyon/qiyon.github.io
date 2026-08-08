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

文章位于 `src/content/posts/`。新增文章时使用现有 Frontmatter 格式，文件名即稳定文章 ID 与 `/post/<id>/` 路由。

构建产物写入 `dist/`，不提交到源码分支。
