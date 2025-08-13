'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Post } from '@/types/post';
import { formatDate } from '@/lib/utils';

interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts }: PostListProps) {
  const { data: session } = useSession();

  if (posts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
            <svg
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">글이 없습니다</h3>
          <p className="mt-1 text-sm text-gray-500">
            {session 
              ? "첫 번째 글을 작성해보세요!"
              : "로그인하여 글을 작성해보세요!"
            }
          </p>
          <div className="mt-6">
            {session ? (
              <Link
                href="/editor"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                첫 글 작성하기
              </Link>
            ) : (
              <Link
                href="/auth/signin"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                로그인하기
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <Link href={`/posts/${post.slug}`}>
              <h2 className="text-xl font-semibold mb-2 hover:text-blue-600 cursor-pointer">
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
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
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