import { allPosts } from "contentlayer/generated";

export default function HomePage() {
  const posts = allPosts.sort((a, b) => +new Date(b.date) - +new Date(a.date));
  return (
    <main>
      <h1>블로그</h1>
      <ul>
        {posts.map((p) => (
          <li key={p._id}>
            <a href={`/posts/${p.slug}`}>{p.title}</a>
            <div style={{ fontSize: 12, opacity: 0.7 }}>{new Date(p.date).toLocaleDateString()}</div>
            {p.description && <p>{p.description}</p>}
          </li>
        ))}
      </ul>
    </main>
  );
}
