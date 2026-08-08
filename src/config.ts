export const siteConfig = {
  name: "何其勇的个人网站",
  shortName: "He Qiyong",
  description: "关于 Web 开发、PHP、Linux 与工程实践的个人技术笔记。",
  url: "https://www.heqiyong.com",
  locale: "zh-CN",
  author: "何其勇",
  github: {
    repository: "https://github.com/qiyon/qiyon.github.io",
    branch: "master",
    contentDirectory: "src/content/posts",
  },
} as const;

export function postSourceUrl(id: string, action: "blob" | "edit") {
  const { repository, branch, contentDirectory } = siteConfig.github;
  return `${repository}/${action}/${branch}/${contentDirectory}/${encodeURIComponent(id)}.md`;
}

export function formatPostDate(date: Date) {
  return new Intl.DateTimeFormat(siteConfig.locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Shanghai",
  }).format(date);
}
