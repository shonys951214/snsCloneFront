'use client';

// 게시글 작성/수정 폼 컴포넌트

import React, { useState, useEffect } from 'react';
import { CreatePostRequest, UpdatePostRequest, Post } from '../../lib/types/post.types';
import { ImageUpload } from '../images/ImageUpload';
import Image from 'next/image';

interface PostFormProps {
  onSubmit: (data: CreatePostRequest | UpdatePostRequest) => Promise<void>;
  onCancel?: () => void;
  initialData?: Post; // 수정 모드일 때 초기 데이터
  isEditMode?: boolean; // 수정 모드 여부
}

export const PostForm: React.FC<PostFormProps> = ({ 
  onSubmit, 
  onCancel,
  initialData,
  isEditMode = false,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageIds, setImageIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 수정 모드일 때 초기 데이터 설정
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setImageIds(initialData.images?.map(img => img.id) || []);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      // imageIds를 명시적으로 숫자 배열로 변환
      const numericImageIds = imageIds.length > 0 
        ? imageIds.map(id => typeof id === 'string' ? parseInt(id, 10) : id)
        : undefined;
      
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        imageIds: numericImageIds,
      });
      // 성공 시 폼 초기화
      setTitle('');
      setContent('');
      setImageIds([]);
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      alert('게시글 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          제목
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          placeholder="제목을 입력하세요"
          required
        />
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-2">
          내용
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          rows={6}
          placeholder="내용을 입력하세요"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">이미지</label>
        
        {/* 기존 이미지 표시 (수정 모드일 때) */}
        {isEditMode && initialData && initialData.images && initialData.images.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">현재 이미지:</p>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {initialData.images.map((image) => {
                const isSelected = imageIds.includes(image.id);
                return (
                  <div
                    key={image.id}
                    className={`relative aspect-square border-2 rounded overflow-hidden cursor-pointer ${
                      isSelected ? 'border-blue-500' : 'border-gray-300'
                    }`}
                    onClick={() => {
                      if (isSelected) {
                        setImageIds((prev) => prev.filter((id) => id !== image.id));
                      } else {
                        setImageIds((prev) => [...prev, image.id]);
                      }
                    }}
                  >
                    <Image
                      src={image.url}
                      alt={image.originalName || '이미지'}
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-blue-500 bg-opacity-50 flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mb-2">
              이미지를 클릭하여 유지/제거할 수 있습니다. 새 이미지를 추가하려면 아래에서 업로드하세요.
            </p>
          </div>
        )}
        
        <ImageUpload
          onUploadComplete={(imageId) => {
            setImageIds((prev) => [...prev, imageId]);
          }}
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? (isEditMode ? '수정 중...' : '작성 중...') : (isEditMode ? '수정' : '작성')}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            취소
          </button>
        )}
      </div>
    </form>
  );
};

