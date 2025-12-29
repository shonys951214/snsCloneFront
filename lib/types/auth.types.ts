// 인증 관련 타입 정의

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    nickname: string;
    profileImage: string;
  };
}

export interface UserInfo {
  id: number;
  email: string;
  nickname: string;
  profileImage: string;
  bio?: string;
}

