'use client';

// 메인 레이아웃 래퍼 컴포넌트

import React from 'react';
import { Sidebar } from './Sidebar';
import { ProtectedRoute } from './ProtectedRoute';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 ml-64 py-8">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
};

