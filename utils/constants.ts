// 상수 정의

// 환경 변수가 설정되어 있으면 사용, 없으면 환경에 따라 자동 선택
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://snscloneback.onrender.com'
    : 'http://localhost:3001');

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

