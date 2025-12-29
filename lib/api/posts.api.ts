// 게시글 API

import apiClient from './client';
import {
  Post,
  CreatePostRequest,
  UpdatePostRequest,
  PostsResponse,
} from '../types/post.types';
import { API_ENDPOINTS } from '../../utils/constants';

export const postsApi = {
  // 게시글 목록 조회
  getPosts: async (page: number = 1, limit: number = 10, userId?: number): Promise<PostsResponse> => {
    const params: any = { page, limit };
    if (userId) {
      params.userId = userId;
    }
    
    const response = await apiClient.get<any>(API_ENDPOINTS.POSTS.LIST, {
      params,
    });
    
    console.log('게시글 목록 응답:', response.data);
    
    // TransformInterceptor로 감싸진 응답 처리
    // { success: true, data: { posts: Post[], total, page, limit } } 형식
    let posts: Post[] = [];
    let total = 0;
    
    if (response.data && response.data.success && response.data.data) {
      const data = response.data.data;
      // 백엔드가 { posts: Post[], total, page, limit } 형식으로 반환
      if (data.posts && Array.isArray(data.posts)) {
        posts = data.posts;
        total = data.total || posts.length;
      } else if (Array.isArray(data)) {
        // 직접 배열인 경우
        posts = data;
        total = data.length;
      }
    } else if (Array.isArray(response.data)) {
      // 직접 배열인 경우
      posts = response.data;
      total = response.data.length;
    } else if (response.data && response.data.posts && Array.isArray(response.data.posts)) {
      // TransformInterceptor 없이 { posts: Post[], total, page, limit } 형식
      posts = response.data.posts;
      total = response.data.total || posts.length;
    } else {
      console.error('게시글 목록 응답 형식 오류:', response.data);
      posts = [];
      total = 0;
    }
    
    return {
      data: posts,
      total,
      page,
      limit,
    };
  },

  // 게시글 상세 조회
  getPostById: async (id: number): Promise<Post> => {
    const response = await apiClient.get<any>(API_ENDPOINTS.POSTS.BY_ID(id));
    
    // TransformInterceptor로 감싸진 응답 처리
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    
    // 직접 Post 형식인 경우
    if (response.data && response.data.id) {
      return response.data;
    }
    
    throw new Error('게시글 상세 응답 형식이 올바르지 않습니다.');
  },

  // 게시글 작성
  createPost: async (data: CreatePostRequest): Promise<Post> => {
    const response = await apiClient.post<any>(
      API_ENDPOINTS.POSTS.CREATE,
      data
    );
    
    // TransformInterceptor로 감싸진 응답 처리
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    
    // 직접 Post 형식인 경우
    if (response.data && response.data.id) {
      return response.data;
    }
    
    throw new Error('게시글 작성 응답 형식이 올바르지 않습니다.');
  },

  // 게시글 수정
  updatePost: async (id: number, data: UpdatePostRequest): Promise<Post> => {
    const response = await apiClient.patch<any>(
      API_ENDPOINTS.POSTS.UPDATE(id),
      data
    );
    
    // TransformInterceptor로 감싸진 응답 처리
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    
    // 직접 Post 형식인 경우
    if (response.data && response.data.id) {
      return response.data;
    }
    
    throw new Error('게시글 수정 응답 형식이 올바르지 않습니다.');
  },

  // 게시글 삭제
  deletePost: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(
      API_ENDPOINTS.POSTS.DELETE(id)
    );
    return response.data;
  },
};

