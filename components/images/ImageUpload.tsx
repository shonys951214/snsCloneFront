'use client';

// 이미지 업로드 컴포넌트

import React, { useState } from 'react';
import { imagesApi } from '../../lib/api/images.api';
import { ImagePreview } from './ImagePreview';

interface ImageUploadProps {
  onUploadComplete: (imageId: number) => void;
  maxImages?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onUploadComplete,
  maxImages = 5,
}) => {
  const [uploadedImages, setUploadedImages] = useState<number[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (uploadedImages.length >= maxImages) {
      alert(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`);
      return;
    }

    // 파일 유효성 검사
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('지원하지 않는 이미지 형식입니다. (JPEG, PNG, GIF, WebP만 가능)');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('파일 크기는 5MB를 초과할 수 없습니다.');
      return;
    }

    setIsUploading(true);
    try {
      const response = await imagesApi.uploadImage(file);
      setUploadedImages((prev) => [...prev, response.id]);
      onUploadComplete(response.id);
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
      // input 초기화
      e.target.value = '';
    }
  };

  const handleRemoveImage = (imageId: number) => {
    setUploadedImages((prev) => prev.filter((id) => id !== imageId));
  };

  return (
    <div className="space-y-2">
      <div>
        <input
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          disabled={isUploading || uploadedImages.length >= maxImages}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {isUploading && <p className="text-sm text-gray-500">업로드 중...</p>}
      </div>
      {uploadedImages.length > 0 && (
        <div className="text-sm text-gray-600">
          업로드된 이미지: {uploadedImages.length} / {maxImages}
        </div>
      )}
    </div>
  );
};

