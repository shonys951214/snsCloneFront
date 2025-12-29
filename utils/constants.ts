// 상수 정의

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  USERS: {
    PROFILE: '/users/profile',
    BY_ID: (id: number) => `/users/${id}`,
  },
  POSTS: {
    LIST: '/posts',
    BY_ID: (id: number) => `/posts/${id}`,
    CREATE: '/posts',
    UPDATE: (id: number) => `/posts/${id}`,
    DELETE: (id: number) => `/posts/${id}`,
  },
  IMAGES: {
    UPLOAD: '/images/upload',
    MY: '/images/my',
    DELETE: (id: number) => `/images/${id}`,
  },
} as const;

