'use client';

// 게시물 그리드 뷰 컴포넌트 (3열)

import React from 'react';
import { useRouter } from 'next/navigation';
import { Post } from '../../lib/types/post.types';
import Image from 'next/image';

interface PostGridProps {
  posts: Post[];
}

export const PostGrid: React.FC<PostGridProps> = ({ posts }) => {
  const router = useRouter();

  if (!Array.isArray(posts) || posts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        게시물이 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1">
      {posts.map((post) => {
        const firstImage = post.images && post.images.length > 0 ? post.images[0] : null;
        
        return (
          <div
            key={post.id}
            onClick={() => router.push(`/posts/${post.id}`)}
            className="aspect-square relative bg-gray-100 cursor-pointer group overflow-hidden"
          >
            {firstImage ? (
              <Image
                src={firstImage.url}
                alt={post.title || '게시물'}
                fill
                sizes="(max-width: 768px) 33vw, 300px"
                className="object-cover group-hover:opacity-75 transition-opacity"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-400 text-sm">이미지 없음</span>
              </div>
            )}
            
            {/* 호버 시 오버레이 (선택사항) */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-4 text-white">
                <div className="flex items-center gap-1">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span className="text-sm font-semibold">0</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span className="text-sm font-semibold">0</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

