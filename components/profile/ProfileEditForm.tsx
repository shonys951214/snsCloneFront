'use client';

// 프로필 수정 폼 컴포넌트

import React, { useState, useRef } from 'react';
import { User, UpdateUserRequest } from '../../lib/types/user.types';
import { imagesApi } from '../../lib/api/images.api';
import Image from 'next/image';

interface ProfileEditFormProps {
  user: User;
  onSubmit: (data: UpdateUserRequest) => Promise<void>;
  onCancel: () => void;
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  user,
  onSubmit,
  onCancel,
}) => {
  const [nickname, setNickname] = useState(user.nickname || '');
  const [bio, setBio] = useState(user.bio || '');
  const [profileImage, setProfileImage] = useState<string>(user.profileImage || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
    setError(null);

    try {
      const response = await imagesApi.uploadImage(file);
      setProfileImage(response.url);
    } catch (err: any) {
      console.error('프로필 이미지 업로드 실패:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        '프로필 이미지 업로드에 실패했습니다.';
      setError(errorMessage);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요.');
      return;
    }

    if (nickname.trim().length < 2) {
      setError('닉네임은 최소 2자 이상이어야 합니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      const updateData: UpdateUserRequest = {
        nickname: nickname.trim(),
        bio: bio.trim() || undefined,
        profileImage: profileImage || undefined,
      };

      await onSubmit(updateData);
    } catch (err: any) {
      console.error('프로필 수정 실패:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        '프로필 수정에 실패했습니다.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* 프로필 사진 */}
      <div>
        <label className="block text-sm font-medium mb-2">프로필 사진</label>
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            {profileImage ? (
              <Image
                src={profileImage}
                alt="프로필 사진"
                width={100}
                height={100}
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                <span className="text-3xl text-gray-400">
                  {nickname.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            )}
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
            />
            {isUploading && (
              <p className="text-sm text-gray-500 mt-1">업로드 중...</p>
            )}
          </div>
        </div>
      </div>

      {/* 닉네임 */}
      <div>
        <label htmlFor="nickname" className="block text-sm font-medium mb-2">
          닉네임
        </label>
        <input
          id="nickname"
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          placeholder="닉네임을 입력하세요 (2-50자)"
          minLength={2}
          maxLength={50}
          required
        />
        <p className="text-xs text-gray-500 mt-1">2자 이상 50자 이하</p>
      </div>

      {/* 소개글 */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium mb-2">
          소개글
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          rows={4}
          placeholder="자신을 소개해주세요 (선택사항)"
          maxLength={500}
        />
        <p className="text-xs text-gray-500 mt-1">
          {bio.length} / 500자
        </p>
      </div>

      {/* 버튼 */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? '수정 중...' : '수정'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          취소
        </button>
      </div>
    </form>
  );
};

