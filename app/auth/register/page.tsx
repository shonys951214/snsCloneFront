'use client';

// /auth/register 경로를 /register로 리다이렉트

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthRegisterRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/register');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div>리다이렉트 중...</div>
    </div>
  );
}

