// 사용자 관련 타입 정의

export interface User {
  id: number;
  email: string;
  nickname: string;
  profileImage: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUserRequest {
  nickname?: string;
  profileImage?: string;
}

