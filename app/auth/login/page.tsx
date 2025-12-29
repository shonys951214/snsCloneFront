'use client';

// /auth/login 경로를 /login으로 리다이렉트

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div>리다이렉트 중...</div>
    </div>
  );
}

