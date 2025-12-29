// 토큰 갱신 로직

import { tokenManager } from './token';
import { RefreshTokenRequest } from '../types/auth.types';
import { API_BASE_URL, API_ENDPOINTS } from '../../utils/constants';

export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = tokenManager.getRefreshToken();

  if (!refreshToken) {
    console.error('Refresh token이 없습니다.');
    tokenManager.clearTokens();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken } as RefreshTokenRequest),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('토큰 갱신 실패:', errorData);
      throw new Error(errorData.message || '토큰 갱신 실패');
    }

    const responseData = await response.json();
    
    // TransformInterceptor로 감싸진 응답 처리
    // { success: true, data: { accessToken: string } } 형식
    let accessToken: string;
    
    if (responseData && responseData.success && responseData.data) {
      // TransformInterceptor 형식
      accessToken = responseData.data.accessToken;
    } else if (responseData && responseData.accessToken) {
      // 직접 { accessToken: string } 형식
      accessToken = responseData.accessToken;
    } else {
      console.error('토큰 갱신 응답 형식 오류:', responseData);
      throw new Error('토큰 갱신 응답 형식이 올바르지 않습니다.');
    }

    if (!accessToken) {
      throw new Error('액세스 토큰을 받지 못했습니다.');
    }

    // 새로운 액세스 토큰만 저장 (리프레시 토큰은 그대로 유지)
    tokenManager.setAccessToken(accessToken);
    
    console.log('토큰 갱신 성공');
    return accessToken;
  } catch (error) {
    console.error('Refresh token 갱신 실패:', error);
    // 갱신 실패 시 토큰 삭제 및 로그인 페이지로 리다이렉트
    tokenManager.clearTokens();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw error; // 갱신 실패 시 에러를 다시 던져서 로그인 페이지로 리다이렉트되도록 함
  }
};

