'use client';

// 피드 페이지 (인스타그램 스타일)

import React, { useEffect, useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { PostList } from '../../components/posts/PostList';
import { postsApi } from '../../lib/api/posts.api';
import { Post } from '../../lib/types/post.types';
import { useAuth } from '../../context/AuthContext';

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await postsApi.getPosts(1, 20);
        
        // response.data가 배열인지 확인
        if (!Array.isArray(response.data)) {
          console.error('게시글 목록이 배열이 아닙니다:', response.data);
          setError('게시글 데이터 형식 오류가 발생했습니다.');
          setPosts([]);
          return;
        }
        
        setPosts(response.data);
      } catch (err: any) {
        console.error('피드 로드 실패:', err);
        console.error('에러 상세:', err.response?.data);
        
        const errorMessage = err.response?.data?.message || 
                           err.message || 
                           '피드를 불러오는데 실패했습니다.';
        setError(errorMessage);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    try {
      await postsApi.deletePost(id);
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (err) {
      console.error('게시글 삭제 실패:', err);
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-4">
        {isLoading ? (
          <div className="text-center py-12">로딩 중...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (
          <PostList
            posts={posts}
            onDelete={handleDelete}
            showDeleteButton={true}
            currentUserId={user?.id}
          />
        )}
      </div>
    </MainLayout>
  );
}

