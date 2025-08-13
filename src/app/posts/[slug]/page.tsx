import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { formatDate } from '@/lib/utils';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  let post;
  
  try {
    post = getPostBySlug(slug);
  } catch (error) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link
        href="/"
        className="inline-block mb-6 text-blue-500 hover:text-blue-600"
      >
        ← 목록으로
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center gap-4 text-gray-600 mb-4">
            <time>{formatDate(post.date)}</time>
            {post.author && <span>by {post.author}</span>}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </article>
    </div>
  );
}