'use client';

// 프로필 헤더 컴포넌트

import React, { useState } from 'react';
import { User } from '../../lib/types/user.types';
import Image from 'next/image';
import { ProfileEditForm } from './ProfileEditForm';
import { usersApi } from '../../lib/api/users.api';
import { UpdateUserRequest } from '../../lib/types/user.types';
import { useAuth } from '../../context/AuthContext';

interface ProfileHeaderProps {
  user: User;
  postCount: number;
  onProfileUpdate?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  postCount,
  onProfileUpdate,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const { refreshUser } = useAuth();

  const handleUpdateProfile = async (data: UpdateUserRequest) => {
    try {
      await usersApi.updateProfile(data);
      await refreshUser();
      setIsEditMode(false);
      if (onProfileUpdate) {
        onProfileUpdate();
      }
    } catch (err: any) {
      console.error('프로필 수정 실패:', err);
      throw err;
    }
  };

  if (isEditMode) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">프로필 편집</h2>
        <ProfileEditForm
          user={user}
          onSubmit={handleUpdateProfile}
          onCancel={() => setIsEditMode(false)}
        />
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-start gap-8">
        {/* 프로필 이미지 */}
        <div className="flex-shrink-0">
          {user.profileImage ? (
            <Image
              src={user.profileImage}
              alt={user.nickname || '프로필'}
              width={150}
              height={150}
              className="rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
              <span className="text-5xl text-gray-400">
                {user.nickname?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          )}
        </div>

        {/* 프로필 정보 */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-2xl font-light">{user.nickname}</h1>
            <button
              onClick={() => setIsEditMode(true)}
              className="px-4 py-1.5 border border-gray-300 rounded font-semibold text-sm hover:bg-gray-50"
            >
              프로필 편집
            </button>
          </div>

          {/* 통계 */}
          <div className="flex gap-6 mb-4">
            <div>
              <span className="font-semibold">{postCount}</span>
              <span className="ml-1 text-gray-600">게시물</span>
            </div>
            <div>
              <span className="font-semibold">0</span>
              <span className="ml-1 text-gray-600">팔로워</span>
            </div>
            <div>
              <span className="font-semibold">0</span>
              <span className="ml-1 text-gray-600">팔로우</span>
            </div>
          </div>

          {/* 사용자명 및 소개글 */}
          <div>
            <p className="font-semibold mb-1">{user.nickname}</p>
            {user.bio && (
              <p className="text-sm whitespace-pre-wrap">{user.bio}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

