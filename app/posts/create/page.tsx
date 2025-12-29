'use client';

// 게시글 작성 페이지

import React from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '../../../components/layout/MainLayout';
import { PostForm } from '../../../components/posts/PostForm';
import { postsApi } from '../../../lib/api/posts.api';
import { CreatePostRequest } from '../../../lib/types/post.types';

export default function CreatePostPage() {
  const router = useRouter();

  const handleSubmit = async (data: CreatePostRequest) => {
    await postsApi.createPost(data);
    router.push('/feed');
  };

  const handleCancel = () => {
    router.push('/feed');
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">게시글 작성</h1>
        <PostForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </MainLayout>
  );
}

