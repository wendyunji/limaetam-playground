'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Navigation() {
  const { data: session } = useSession();
  const { repositories, selectedRepo, setSelectedRepo } = useAuth();

  const handleRepoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRepo(event.target.value);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              기술 블로그
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                {repositories.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <label htmlFor="repo-select" className="text-sm text-gray-600">
                      저장소:
                    </label>
                    <select
                      id="repo-select"
                      value={selectedRepo}
                      onChange={handleRepoChange}
                      className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">저장소 선택</option>
                      {repositories.map((repo) => (
                        <option key={repo.id} value={repo.full_name}>
                          {repo.name} {repo.private ? '🔒' : '📖'}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <Link
                  href="/editor"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  글 작성
                </Link>

                <div className="flex items-center space-x-3">
                  <img
                    src={session.user?.image || ''}
                    alt={session.user?.name || ''}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm text-gray-700">{session.user?.name}</span>
                  <button
                    onClick={() => signOut()}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    로그아웃
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}