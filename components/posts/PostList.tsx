'use client';

// 게시글 목록 컴포넌트

import React from 'react';
import { Post } from '../../lib/types/post.types';
import { PostCard } from './PostCard';

interface PostListProps {
  posts: Post[];
  onDelete?: (id: number) => void;
  showDeleteButton?: boolean;
  currentUserId?: number;
}

export const PostList: React.FC<PostListProps> = ({
  posts,
  onDelete,
  showDeleteButton = false,
  currentUserId,
}) => {
  // posts가 배열이 아닌 경우 처리
  if (!Array.isArray(posts)) {
    console.error('PostList: posts가 배열이 아닙니다:', posts);
    return (
      <div className="text-center py-12 text-red-500">
        게시글 데이터 형식 오류가 발생했습니다.
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        게시글이 없습니다.
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onDelete={onDelete}
          showDeleteButton={
            showDeleteButton && currentUserId === post.userId
          }
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
};

