// Axios 인스턴스 및 인터셉터 설정

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { tokenManager } from '../auth/token';
import { refreshAccessToken } from '../auth/refresh';
import { API_BASE_URL } from '../../utils/constants';

// Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => {
    // 2xx 상태 코드만 성공으로 처리
    return status >= 200 && status < 300;
  },
});

// 요청 인터셉터: AccessToken 자동 추가
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = tokenManager.getAccessToken();
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    // 디버깅: 요청 URL 로그
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('API 요청:', config.method?.toUpperCase(), config.baseURL + config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 401 에러 시 토큰 갱신 후 재시도
apiClient.interceptors.response.use(
  (response) => {
    // 응답이 HTML인지 확인 (API 호출 실패 시)
    if (
      response.data &&
      typeof response.data === 'string' &&
      response.data.includes('<!DOCTYPE')
    ) {
      throw new Error(
        'API 서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인하세요.',
      );
    }
    return response;
  },
  async (error: AxiosError) => {
    // 네트워크 에러 또는 HTML 응답인 경우
    if (
      !error.response &&
      error.message &&
      (error.message.includes('Network Error') ||
        error.message.includes('ERR_CONNECTION_REFUSED'))
    ) {
      console.error('API 서버 연결 실패:', error.message);
      throw new Error(
        '백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요.',
      );
    }

    // HTML 응답인 경우
    if (
      error.response?.data &&
      typeof error.response.data === 'string' &&
      error.response.data.includes('<!DOCTYPE')
    ) {
      console.error('HTML 응답 받음 - API 서버 연결 실패');
      throw new Error(
        'API 서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인하세요.',
      );
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401 에러이고 아직 재시도하지 않은 경우
    // 단, 로그인/회원가입 API는 Public이므로 토큰 갱신 시도하지 않음
    const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || 
                          originalRequest.url?.includes('/auth/register') ||
                          originalRequest.url?.includes('/auth/refresh');
    
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();

        if (newAccessToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그인 페이지로 리다이렉트
        // 단, 이미 로그인 페이지에 있으면 리다이렉트하지 않음
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          tokenManager.clearTokens();
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

