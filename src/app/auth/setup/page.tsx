'use client';

import { useRouter } from 'next/navigation';
import OAuthSetup from '@/components/OAuthSetup';

export default function SetupPage() {
  const router = useRouter();

  const handleSetupComplete = () => {
    // 설정 완료 후 로그인 페이지로 이동
    router.push('/auth/signin');
  };

  return <OAuthSetup onComplete={handleSetupComplete} />;
}