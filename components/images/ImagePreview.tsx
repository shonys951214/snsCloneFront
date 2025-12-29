'use client';

// 이미지 미리보기 컴포넌트

import React from 'react';
import Image from 'next/image';

interface ImagePreviewProps {
  url: string;
  alt?: string;
  onRemove?: () => void;
  size?: 'small' | 'medium' | 'large';
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  url,
  alt = '이미지',
  onRemove,
  size = 'medium',
}) => {
  const sizeClasses = {
    small: 'w-20 h-20',
    medium: 'w-32 h-32',
    large: 'w-48 h-48',
  };

  return (
    <div className="relative inline-block">
      <div className={`${sizeClasses[size]} relative rounded overflow-hidden border`}>
        <Image
          src={url}
          alt={alt}
          fill
          className="object-cover"
        />
      </div>
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
          aria-label="이미지 제거"
        >
          ×
        </button>
      )}
    </div>
  );
};

