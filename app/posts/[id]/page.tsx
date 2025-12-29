'use client';

// 게시글 상세 페이지

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { MainLayout } from '../../../components/layout/MainLayout';
import { postsApi } from '../../../lib/api/posts.api';
import { Post, UpdatePostRequest } from '../../../lib/types/post.types';
import { useAuth } from '../../../context/AuthContext';
import Image from 'next/image';
import { ImageModal } from '../../../components/images/ImageModal';
import { PostForm } from '../../../components/posts/PostForm';

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const postId = params?.id ? parseInt(params.id as string) : null;

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) {
        setError('게시글 ID가 없습니다.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const postData = await postsApi.getPostById(postId);
        setPost(postData);
      } catch (err: any) {
        console.error('게시글 로드 실패:', err);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          '게시글을 불러오는데 실패했습니다.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleDelete = async () => {
    if (!post || !confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    try {
      await postsApi.deletePost(post.id);
      router.push('/feed');
    } catch (err) {
      console.error('게시글 삭제 실패:', err);
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  const handleUpdate = async (data: UpdatePostRequest) => {
    if (!postId) return;

    try {
      await postsApi.updatePost(postId, data);
      // 수정 후 게시글 다시 로드
      const updatedPost = await postsApi.getPostById(postId);
      setPost(updatedPost);
      setIsEditMode(false);
    } catch (err: any) {
      console.error('게시글 수정 실패:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        '게시글 수정에 실패했습니다.';
      alert(errorMessage);
      throw err;
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">로딩 중...</div>
        </div>
      </MainLayout>
    );
  }

  if (error || !post) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12 text-red-500">
            {error || '게시글을 찾을 수 없습니다.'}
          </div>
          <div className="text-center">
            <button
              onClick={() => router.push('/feed')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              피드로 돌아가기
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const canEdit = user && user.id === post.userId;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4">
        {/* 뒤로 가기 버튼 */}
        <button
          onClick={() => router.back()}
          className="mb-4 text-gray-600 hover:text-gray-800 flex items-center gap-2"
        >
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          뒤로 가기
        </button>

        {/* 수정 모드일 때는 폼 표시 */}
        {isEditMode ? (
          <div className="border rounded-lg p-6 bg-white">
            <h2 className="text-2xl font-bold mb-6">게시글 수정</h2>
            <PostForm
              onSubmit={handleUpdate}
              onCancel={() => setIsEditMode(false)}
              initialData={post}
              isEditMode={true}
            />
          </div>
        ) : (
          <article className="border rounded-lg p-6 bg-white">
            {/* 사용자 정보 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {post.user.profileImage && (
                  <Image
                    src={post.user.profileImage}
                    alt={post.user.nickname}
                    width={50}
                    height={50}
                    className="rounded-full"
                    style={{ width: 'auto', height: 'auto' }}
                  />
                )}
                <div>
                  <h3 className="font-semibold text-lg">{post.user.nickname}</h3>
                  <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                </div>
              </div>
              {canEdit && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="text-blue-500 hover:text-blue-700 px-3 py-1 rounded hover:bg-blue-50"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-red-500 hover:text-red-700 px-3 py-1 rounded hover:bg-red-50"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>

          {/* 제목 */}
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

          {/* 내용 */}
          <div className="mb-6">
            <p className="text-gray-700 whitespace-pre-wrap text-lg leading-relaxed">
              {post.content}
            </p>
          </div>

          {/* 이미지 */}
          {post.images && post.images.length > 0 && (
            <div className="mb-6">
              {post.images.length === 1 ? (
                <div
                  className="relative w-full max-h-[600px] cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => handleImageClick(0)}
                >
                  <Image
                    src={post.images[0].url}
                    alt={post.images[0].originalName || '이미지'}
                    width={1200}
                    height={1200}
                    className="object-contain w-full h-auto rounded-lg"
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {post.images.map((image, index) => (
                    <div
                      key={image.id}
                      className="relative aspect-square cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => handleImageClick(index)}
                    >
                      <Image
                        src={image.url}
                        alt={image.originalName || `이미지 ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 400px"
                        className="object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

            {/* 수정 시간 표시 (수정된 경우) */}
            {post.updatedAt && post.updatedAt !== post.createdAt && (
              <p className="text-xs text-gray-400 mt-4">
                수정됨: {formatDate(post.updatedAt)}
              </p>
            )}
          </article>
        )}
      </div>

      {/* 이미지 모달 */}
      {post.images && post.images.length > 0 && (
        <ImageModal
          images={post.images}
          initialIndex={selectedImageIndex ?? 0}
          isOpen={isImageModalOpen}
          onClose={() => {
            setIsImageModalOpen(false);
            setSelectedImageIndex(null);
          }}
        />
      )}
    </MainLayout>
  );
}

