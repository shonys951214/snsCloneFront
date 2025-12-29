'use client';

// 내 페이지 (내가 쓴 글만) - 인스타그램 스타일

import React, { useEffect, useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { PostGrid } from '../../components/posts/PostGrid';
import { postsApi } from '../../lib/api/posts.api';
import { Post } from '../../lib/types/post.types';
import { useAuth } from '../../context/AuthContext';
import { usersApi } from '../../lib/api/users.api';
import { User } from '../../lib/types/user.types';
import { ProfileHeader } from '../../components/profile/ProfileHeader';

export default function ProfilePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        setError(null);
        
        // 프로필 정보와 게시글을 동시에 가져오기
        const [profileData, postsResponse] = await Promise.all([
          usersApi.getProfile(),
          postsApi.getPosts(1, 100, user.id),
        ]);
        
        setUserProfile(profileData);
        
        // response.data가 배열인지 확인
        if (!Array.isArray(postsResponse.data)) {
          console.error('게시글 목록이 배열이 아닙니다:', postsResponse.data);
          setError('게시글 데이터 형식 오류가 발생했습니다.');
          setPosts([]);
          return;
        }
        
        // 백엔드에서 이미 필터링된 게시글 사용
        setPosts(postsResponse.data);
        
        // 게시글이 없는 것은 에러가 아님
        if (postsResponse.data.length === 0) {
          setError(null); // 에러 상태 초기화
        }
      } catch (err: any) {
        console.error('데이터 로드 실패:', err);
        console.error('에러 상세:', err.response?.data);
        
        // 네트워크 에러나 실제 API 에러인 경우에만 에러 메시지 표시
        const errorMessage = err.response?.data?.message || 
                           err.message || 
                           '데이터를 불러오는데 실패했습니다.';
        setError(errorMessage);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleProfileUpdate = async () => {
    // 프로필 업데이트 후 데이터 새로고침
    try {
      const profileData = await usersApi.getProfile();
      setUserProfile(profileData);
    } catch (err) {
      console.error('프로필 정보 새로고침 실패:', err);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4">
        {/* 프로필 헤더 */}
        {userProfile && (
          <ProfileHeader
            user={userProfile}
            postCount={posts.length}
            onProfileUpdate={handleProfileUpdate}
          />
        )}

        {/* 탭 메뉴 */}
        <div className="border-t border-gray-300 mb-4">
          <div className="flex justify-center gap-8">
            <button className="py-4 border-t-2 border-black font-semibold text-sm uppercase tracking-wide">
              게시물
            </button>
            <button className="py-4 text-gray-500 text-sm uppercase tracking-wide">
              저장됨
            </button>
          </div>
        </div>

        {/* 게시물 그리드 */}
        {isLoading ? (
          <div className="text-center py-12">로딩 중...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (
          <PostGrid posts={posts} />
        )}
      </div>
    </MainLayout>
  );
}

