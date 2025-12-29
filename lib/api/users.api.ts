// 사용자 API

import apiClient from './client';
import { User, UpdateUserRequest } from '../types/user.types';
import { API_ENDPOINTS } from '../../utils/constants';

export const usersApi = {
  // 내 프로필 조회
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<any>(API_ENDPOINTS.USERS.PROFILE);
    
    // TransformInterceptor로 감싸진 응답 처리
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    
    // 직접 User 형식인 경우
    if (response.data && response.data.id) {
      return response.data;
    }
    
    throw new Error('프로필 응답 형식이 올바르지 않습니다.');
  },

  // 프로필 수정
  updateProfile: async (data: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.patch<any>(
      API_ENDPOINTS.USERS.PROFILE,
      data
    );
    
    // TransformInterceptor로 감싸진 응답 처리
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    
    // 직접 User 형식인 경우
    if (response.data && response.data.id) {
      return response.data;
    }
    
    throw new Error('프로필 수정 응답 형식이 올바르지 않습니다.');
  },

  // 특정 사용자 조회
  getUserById: async (id: number): Promise<User> => {
    const response = await apiClient.get<User>(API_ENDPOINTS.USERS.BY_ID(id));
    return response.data;
  },
};

