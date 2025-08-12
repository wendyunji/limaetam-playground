'use client';

import { useState } from 'react';
import { PostMetadata } from '@/types/post';

interface PostEditorProps {
  onSave: (metadata: PostMetadata, content: string) => Promise<void>;
}

export default function PostEditor({ onSave }: PostEditorProps) {
  const [metadata, setMetadata] = useState<PostMetadata>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    excerpt: '',
    tags: [],
    author: '',
  });
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddTag = () => {
    if (tagInput.trim() && !metadata.tags?.includes(tagInput.trim())) {
      setMetadata(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setMetadata(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleSave = async () => {
    if (!metadata.title || !content) return;
    
    setIsLoading(true);
    try {
      await onSave(metadata, content);
      // Reset form after successful save
      setMetadata({
        title: '',
        date: new Date().toISOString().split('T')[0],
        excerpt: '',
        tags: [],
        author: '',
      });
      setContent('');
    } catch (error) {
      console.error('Failed to save post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">새 글 작성</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">제목</label>
            <input
              type="text"
              value={metadata.title}
              onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="글 제목을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">날짜</label>
            <input
              type="date"
              value={metadata.date}
              onChange={(e) => setMetadata(prev => ({ ...prev, date: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">요약</label>
            <textarea
              value={metadata.excerpt}
              onChange={(e) => setMetadata(prev => ({ ...prev, excerpt: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="글 요약을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">작성자</label>
            <input
              type="text"
              value={metadata.author}
              onChange={(e) => setMetadata(prev => ({ ...prev, author: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="작성자 이름"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">태그</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="태그 입력 후 Enter"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                추가
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {metadata.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-200 rounded-md text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">내용 (Markdown)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-96 p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
            placeholder="마크다운으로 글을 작성하세요..."
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={!metadata.title || !content || isLoading}
          className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? '저장 중...' : '저장 및 커밋'}
        </button>
      </div>
    </div>
  );
}