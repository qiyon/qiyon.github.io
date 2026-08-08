import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { siteConfig } from "../config";

export async function GET(context: { site: URL | undefined }) {
  const posts = (await getCollection("posts", ({ data }) => !data.draft)).sort(
    (left, right) => right.data.publishedAt.valueOf() - left.data.publishedAt.valueOf(),
  );

  return rss({
    title: siteConfig.name,
    description: siteConfig.description,
    site: context.site ?? siteConfig.url,
    customData: `<language>${siteConfig.locale}</language>`,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description ?? siteConfig.description,
      pubDate: post.data.publishedAt,
      link: `/post/${post.id}/`,
      categories: post.data.tags,
    })),
  });
}
