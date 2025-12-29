'use client';

// 사이드바 네비게이션 컴포넌트

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export const Sidebar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { href: '/feed', label: '홈', icon: '🏠' },
    { href: '/profile', label: '프로필', icon: '👤' },
    { href: '/posts/create', label: '글 작성', icon: '✏️' },
  ];

  const isActive = (href: string) => {
    if (href === '/feed') {
      return pathname === '/feed' || pathname === '/';
    }
    return pathname === href || pathname?.startsWith(href + '/');
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 border-r bg-white flex flex-col">
      {/* 로고 */}
      <div className="p-6 border-b">
        <Link href="/feed" className="text-2xl font-bold">
          instagram
        </Link>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-gray-100 font-semibold text-black'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* 사용자 정보 및 로그아웃 */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-4 px-4">
          {user?.profileImage ? (
            <Image
              src={user.profileImage}
              alt={user.nickname || '프로필'}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm text-gray-500">
                {user?.nickname?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          )}
          <span className="text-sm font-medium text-gray-700">
            {user?.nickname || '사용자'}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-left text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          로그아웃
        </button>
      </div>
    </aside>
  );
};

