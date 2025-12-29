'use client';

// 게시글 카드 컴포넌트 (인스타그램 스타일)

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Post } from '../../lib/types/post.types';
import Image from 'next/image';
import { formatRelativeTime } from '../../lib/utils/date.utils';
import { PostActions } from './PostActions';

interface PostCardProps {
  post: Post;
  onDelete?: (id: number) => void;
  showDeleteButton?: boolean;
  currentUserId?: number;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onDelete,
  showDeleteButton = false,
  currentUserId,
}) => {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // 외부 클릭 시 더보기 메뉴 닫기
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showMoreMenu && !target.closest('[data-more-menu]')) {
        setShowMoreMenu(false);
      }
    };

    if (showMoreMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMoreMenu]);

  const handleCardClick = (e: React.MouseEvent) => {
    // 삭제 버튼이나 슬라이더 컨트롤, 더보기 메뉴 클릭 시에는 상세 페이지로 이동하지 않음
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('[data-slider-control]') ||
      target.closest('[data-more-menu]')
    ) {
      return;
    }
    router.push(`/posts/${post.id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMoreMenu(false);
    if (confirm('정말 삭제하시겠습니까?')) {
      if (onDelete) {
        onDelete(post.id);
      }
    }
  };

  const handlePreviousImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (post.images && post.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? post.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (post.images && post.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === post.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleIndicatorClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  // 마우스 드래그 시작
  const handleMouseDown = (e: React.MouseEvent) => {
    if (post.images && post.images.length > 1) {
      e.stopPropagation();
      setIsDragging(true);
      setStartX(e.clientX);
      setCurrentX(e.clientX);
    }
  };

  // 마우스 드래그 중
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && post.images && post.images.length > 1) {
      e.stopPropagation();
      setCurrentX(e.clientX);
    }
  };

  // 마우스 드래그 종료
  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDragging && post.images && post.images.length > 1) {
      e.stopPropagation();
      const diff = startX - currentX;
      const threshold = 50; // 드래그 최소 거리

      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          // 왼쪽으로 드래그 (다음 이미지)
          setCurrentImageIndex((prev) =>
            prev === post.images.length - 1 ? 0 : prev + 1
          );
        } else {
          // 오른쪽으로 드래그 (이전 이미지)
          setCurrentImageIndex((prev) =>
            prev === 0 ? post.images.length - 1 : prev - 1
          );
        }
      }

      setIsDragging(false);
      setStartX(0);
      setCurrentX(0);
    }
  };

  // 터치 이벤트 (모바일 지원)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (post.images && post.images.length > 1) {
      e.stopPropagation();
      setIsDragging(true);
      setStartX(e.touches[0].clientX);
      setCurrentX(e.touches[0].clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && post.images && post.images.length > 1) {
      e.stopPropagation();
      setCurrentX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isDragging && post.images && post.images.length > 1) {
      e.stopPropagation();
      const diff = startX - currentX;
      const threshold = 50;

      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          setCurrentImageIndex((prev) =>
            prev === post.images.length - 1 ? 0 : prev + 1
          );
        } else {
          setCurrentImageIndex((prev) =>
            prev === 0 ? post.images.length - 1 : prev - 1
          );
        }
      }

      setIsDragging(false);
      setStartX(0);
      setCurrentX(0);
    }
  };

  const canDelete = showDeleteButton && onDelete && currentUserId === post.userId;

  return (
    <article className="bg-white border border-gray-200 rounded-lg mb-8 overflow-hidden">
      {/* 헤더: 프로필 이미지, 사용자명, 더보기 메뉴 */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-3">
          {post.user.profileImage ? (
            <Image
              src={post.user.profileImage}
              alt={post.user.nickname}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm text-gray-500">
                {post.user.nickname?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-sm">{post.user.nickname}</h3>
          </div>
        </div>
        {canDelete && (
          <div className="relative" data-more-menu>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMoreMenu(!showMoreMenu);
              }}
              className="p-1 hover:opacity-70"
              aria-label="더보기"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="6" cy="12" r="1.5" />
                <circle cx="18" cy="12" r="1.5" />
              </svg>
            </button>
            {showMoreMenu && (
              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-[120px]">
                <button
                  onClick={handleDeleteClick}
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-50 text-sm"
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 이미지 영역 */}
      {post.images && post.images.length > 0 && (
        <div className="relative bg-black" data-slider-control>
          {/* 이미지 슬라이더 */}
          <div
            className="relative aspect-square select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            {post.images.map((image, index) => (
              <div
                key={image.id}
                className={`absolute inset-0 transition-opacity duration-300 ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Image
                  src={image.url}
                  alt={image.originalName || `이미지 ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover"
                />
              </div>
            ))}

            {/* 이전 버튼 (이미지가 2개 이상일 때만 표시) */}
            {post.images.length > 1 && (
              <button
                onClick={handlePreviousImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all"
                aria-label="이전 이미지"
                data-slider-control
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
              </button>
            )}

            {/* 다음 버튼 (이미지가 2개 이상일 때만 표시) */}
            {post.images.length > 1 && (
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all"
                aria-label="다음 이미지"
                data-slider-control
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}

            {/* 인디케이터 (이미지가 2개 이상일 때만 표시) */}
            {post.images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1.5" data-slider-control>
                {post.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => handleIndicatorClick(index, e)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? 'bg-white w-6'
                        : 'bg-white bg-opacity-50 w-2 hover:bg-opacity-75'
                    }`}
                    aria-label={`이미지 ${index + 1}로 이동`}
                    data-slider-control
                  />
                ))}
              </div>
            )}

            {/* 이미지 카운터 (이미지가 2개 이상일 때만 표시) */}
            {post.images.length > 1 && (
              <div className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {currentImageIndex + 1} / {post.images.length}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 액션 버튼 (좋아요, 댓글, 공유, 저장) */}
      <PostActions postId={post.id} />

      {/* 좋아요 수 및 캡션 영역 */}
      <div className="px-4 py-2">
        <div className="mb-2">
          <span className="font-semibold text-sm">좋아요 0개</span>
        </div>
        
        {/* 제목과 내용을 캡션으로 표시 */}
        <div className="mb-1">
          <span className="font-semibold text-sm mr-2">{post.user.nickname}</span>
          <span className="text-sm">{post.title}</span>
        </div>
        {post.content && (
          <div className="mb-1">
            <span className="text-sm whitespace-pre-wrap">{post.content}</span>
          </div>
        )}
        
        {/* 댓글 보기 링크 */}
        <button
          onClick={() => router.push(`/posts/${post.id}`)}
          className="text-gray-500 text-sm mb-2 hover:text-gray-700"
        >
          댓글 모두 보기
        </button>
        
        {/* 게시 시간 */}
        <p className="text-xs text-gray-500 uppercase">
          {formatRelativeTime(post.createdAt)}
        </p>
      </div>
    </article>
  );
};

