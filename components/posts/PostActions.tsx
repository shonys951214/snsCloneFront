'use client';

// 게시물 액션 버튼 컴포넌트 (좋아요, 댓글, 공유, 저장)

import React, { useState } from 'react';

interface PostActionsProps {
  postId: number;
  isLiked?: boolean;
  likeCount?: number;
  commentCount?: number;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onSave?: () => void;
}

export const PostActions: React.FC<PostActionsProps> = ({
  postId,
  isLiked = false,
  likeCount = 0,
  commentCount = 0,
  onLike,
  onComment,
  onShare,
  onSave,
}) => {
  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState(likeCount);

  const handleLike = () => {
    if (onLike) {
      onLike();
    } else {
      // UI만 토글 (API 연동 전)
      setLiked(!liked);
      setLikes(liked ? likes - 1 : likes + 1);
    }
  };

  const handleComment = () => {
    if (onComment) {
      onComment();
    }
    // 댓글 기능은 추후 구현
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    }
    // 공유 기능은 추후 구현
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
    // 저장 기능은 추후 구현
  };

  return (
    <div className="flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-4">
        {/* 좋아요 버튼 */}
        <button
          onClick={handleLike}
          className="flex items-center gap-1 hover:opacity-70 transition-opacity"
          aria-label="좋아요"
        >
          {liked ? (
            <svg
              className="w-6 h-6 text-red-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          )}
        </button>

        {/* 댓글 버튼 */}
        <button
          onClick={handleComment}
          className="flex items-center gap-1 hover:opacity-70 transition-opacity"
          aria-label="댓글"
        >
          <svg
            className="w-6 h-6"
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
        </button>

        {/* 공유 버튼 */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1 hover:opacity-70 transition-opacity"
          aria-label="공유"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
        </button>
      </div>

      {/* 저장 버튼 */}
      <button
        onClick={handleSave}
        className="hover:opacity-70 transition-opacity"
        aria-label="저장"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      </button>
    </div>
  );
};

