'use client';

// Header 컴포넌트 (네비게이션, 로그아웃)

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/feed" className="text-xl font-bold">
            SNS
          </Link>
          <nav className="flex gap-4">
            <Link href="/feed" className="hover:underline">
              피드
            </Link>
            <Link href="/profile" className="hover:underline">
              내 페이지
            </Link>
            <Link href="/posts/create" className="hover:underline">
              글 작성
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm">{user.nickname}</span>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
};

