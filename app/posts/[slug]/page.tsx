import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { marked } from "marked";

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = allPosts.find((p) => p.slug === params.slug);
  if (!post) return notFound();
  return (
    <article>
      <h1>{post.title}</h1>
      <div style={{ fontSize: 12, opacity: 0.7 }}>{new Date(post.date).toLocaleString()}</div>
      <div dangerouslySetInnerHTML={{ __html: marked.parse(post.body.raw) as string }} />
    </article>
  );
}
