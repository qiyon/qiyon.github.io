import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

export async function getStaticPaths() {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { id: post.id },
    props: { post },
  }));
}

export function GET({ props }: { props: { post: CollectionEntry<"posts"> } }) {
  const { post } = props;
  const markdown = `# ${post.data.title}\n\n${(post.body ?? "").trimStart()}`;
  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
