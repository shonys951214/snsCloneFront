// 인증 API

import apiClient from './client';
import {
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  AuthResponse,
} from '../types/auth.types';
import { API_ENDPOINTS } from '../../utils/constants';

export const authApi = {
  // 로그인
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<any>(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    );
    
    // TransformInterceptor로 감싸진 응답 처리
    // { success: true, data: AuthResponse } 형식
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    
    // 직접 AuthResponse 형식인 경우
    if (response.data && response.data.accessToken && response.data.user) {
      return response.data;
    }
    
    throw new Error('로그인 응답 형식이 올바르지 않습니다.');
  },

  // 회원가입
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<any>(
        API_ENDPOINTS.AUTH.REGISTER,
        data
      );
      
      // 응답이 HTML인지 확인 (API 호출 실패 시)
      if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE')) {
        throw new Error('API 서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인하세요.');
      }
      
      // TransformInterceptor로 감싸진 응답 처리
      // { success: true, data: AuthResponse } 형식
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      
      // 직접 AuthResponse 형식인 경우
      if (response.data && response.data.accessToken && response.data.user) {
        return response.data;
      }
      
      throw new Error('회원가입 응답 형식이 올바르지 않습니다.');
    } catch (error: any) {
      // 네트워크 에러 또는 HTML 응답인 경우
      if (error.response?.data && typeof error.response.data === 'string' && error.response.data.includes('<!DOCTYPE')) {
        throw new Error('API 서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인하세요.');
      }
      throw error;
    }
  },

  // 토큰 갱신
  refreshToken: async (data: RefreshTokenRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      data
    );
    return response.data;
  },

  // 로그아웃
  logout: async (data: RefreshTokenRequest): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      API_ENDPOINTS.AUTH.LOGOUT,
      data
    );
    return response.data;
  },
};

