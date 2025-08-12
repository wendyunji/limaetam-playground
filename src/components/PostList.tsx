import Link from 'next/link';
import { Post } from '@/types/post';
import { formatDate } from '@/lib/utils';

interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">아직 작성된 글이 없습니다.</p>
        <Link
          href="/editor"
          className="inline-block mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          첫 글 작성하기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">기술 블로그</h1>
        <Link
          href="/editor"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          새 글 작성
        </Link>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <Link href={`/posts/${post.slug}`}>
              <h2 className="text-xl font-semibold mb-2 hover:text-blue-600">
                {post.title}
              </h2>
            </Link>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
              <time>{formatDate(post.date)}</time>
              {post.author && <span>by {post.author}</span>}
            </div>

            <p className="text-gray-700 mb-4">{post.excerpt}</p>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}