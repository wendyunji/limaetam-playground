'use client';

import { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

interface OAuthSetupProps {
  onComplete: () => void;
}

export default function OAuthSetup({ onComplete }: OAuthSetupProps) {
  const { setOAuthSettings } = useSettings();
  const [formData, setFormData] = useState({
    clientId: '',
    clientSecret: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientId || !formData.clientSecret) {
      alert('Client ID와 Client Secret을 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    
    try {
      // 서버에 OAuth 설정 전송
      const response = await fetch('/api/auth/update-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: formData.clientId,
          clientSecret: formData.clientSecret,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update OAuth configuration');
      }

      // 클라이언트 설정도 저장
      setOAuthSettings({
        clientId: formData.clientId,
        clientSecret: formData.clientSecret,
        isConfigured: true,
      });

      setTimeout(() => {
        setIsLoading(false);
        onComplete();
      }, 1000);
    } catch (error) {
      console.error('Failed to save OAuth settings:', error);
      alert('OAuth 설정 저장에 실패했습니다.');
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          GitHub OAuth 설정
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          본인의 GitHub OAuth 앱 정보를 입력해주세요
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {showInstructions && (
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    GitHub OAuth 앱 만들기
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ol className="list-decimal list-inside space-y-1">
                      <li>GitHub.com → Settings → Developer settings → OAuth Apps → New OAuth App</li>
                      <li>Application name: <code className="bg-blue-100 px-1 rounded">기술 블로그</code></li>
                      <li>Homepage URL: <code className="bg-blue-100 px-1 rounded">http://localhost:3000</code></li>
                      <li>Authorization callback URL: <code className="bg-blue-100 px-1 rounded">http://localhost:3000/api/auth/callback/github</code></li>
                      <li>Register application → Client ID와 Client Secret 복사</li>
                    </ol>
                  </div>
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => setShowInstructions(false)}
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      설명 숨기기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!showInstructions && (
            <button
              type="button"
              onClick={() => setShowInstructions(true)}
              className="mb-4 text-sm text-blue-600 hover:text-blue-500"
            >
              📖 OAuth 앱 만들기 설명 보기
            </button>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
                GitHub Client ID
              </label>
              <div className="mt-1">
                <input
                  id="clientId"
                  name="clientId"
                  type="text"
                  required
                  value={formData.clientId}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Ov23liO3YF0Dp5Ym9q68"
                />
              </div>
            </div>

            <div>
              <label htmlFor="clientSecret" className="block text-sm font-medium text-gray-700">
                GitHub Client Secret
              </label>
              <div className="mt-1">
                <input
                  id="clientSecret"
                  name="clientSecret"
                  type="password"
                  required
                  value={formData.clientSecret}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••••••••••••••••••••••••••••••••••"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Client Secret은 안전하게 브라우저에만 저장되며, 외부로 전송되지 않습니다.
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '설정 중...' : '설정 완료'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}