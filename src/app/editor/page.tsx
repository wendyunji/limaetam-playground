'use client';

import PostEditor from '@/components/PostEditor';
import { PostMetadata } from '@/types/post';

export default function EditorPage() {
  const handleSave = async (metadata: PostMetadata, content: string) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ metadata, content }),
      });

      if (!response.ok) {
        throw new Error('Failed to save post');
      }

      const result = await response.json();
      alert(`글이 성공적으로 저장되었습니다! (${result.slug})`);
      
      // Redirect to home page to see the new post
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to save post:', error);
      alert('글 저장에 실패했습니다.');
    }
  };

  return <PostEditor onSave={handleSave} />;
}