'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import PostEditor from '@/components/PostEditor';
import { PostMetadata } from '@/types/post';
import { useAuth } from '@/contexts/AuthContext';

export default function EditorPage() {
  const { data: session, status } = useSession();
  const { selectedRepo } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
    }
  }, [session, status, router]);

  const handleSave = async (metadata: PostMetadata, content: string) => {
    if (!selectedRepo) {
      alert('저장소를 선택해주세요.');
      return;
    }

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          metadata, 
          content, 
          repository: selectedRepo 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save post');
      }

      const result = await response.json();
      
      const message = `글이 성공적으로 저장되었습니다!\n\n` +
        `• 제목: ${metadata.title}\n` +
        `• 저장소: ${selectedRepo}\n` +
        `• 커밋: ${result.commitUrl ? '성공' : '실패'}`;
      
      alert(message);
      
      // Redirect to home page to see the new post
      router.push('/');
    } catch (error: any) {
      console.error('Failed to save post:', error);
      alert(`글 저장에 실패했습니다: ${error.message}`);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (!selectedRepo) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                저장소 선택 필요
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>글을 작성하기 전에 상단 네비게이션에서 저장소를 선택해주세요.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <PostEditor onSave={handleSave} />;
}