'use client';

// 게시글 작성 페이지

import React from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '../../../components/layout/MainLayout';
import { PostForm } from '../../../components/posts/PostForm';
import { postsApi } from '../../../lib/api/posts.api';
import { CreatePostRequest, UpdatePostRequest } from '../../../lib/types/post.types';

export default function CreatePostPage() {
  const router = useRouter();

  const handleSubmit = async (data: CreatePostRequest | UpdatePostRequest) => {
    // 작성 페이지에서는 title과 content가 필수
    if (!data.title || !data.content) {
      throw new Error('제목과 내용은 필수입니다.');
    }
    
    const createData: CreatePostRequest = {
      title: data.title,
      content: data.content,
      imageIds: data.imageIds,
    };
    
    await postsApi.createPost(createData);
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

