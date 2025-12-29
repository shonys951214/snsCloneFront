'use client';

// 인증 Context API

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserInfo } from '../lib/types/auth.types';
import { tokenManager } from '../lib/auth/token';
import { authApi } from '../lib/api/auth.api';
import { usersApi } from '../lib/api/users.api';

interface AuthContextType {
  user: UserInfo | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 로드 시 사용자 정보 확인
  useEffect(() => {
    const checkAuth = async () => {
      if (tokenManager.hasTokens()) {
        try {
          const userData = await usersApi.getProfile();
          setUser({
            id: userData.id,
            email: userData.email,
            nickname: userData.nickname,
            profileImage: userData.profileImage,
            bio: userData.bio,
          });
        } catch (error) {
          // 토큰이 유효하지 않은 경우
          tokenManager.clearTokens();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // 로그인
  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      
      // 토큰 저장
      tokenManager.setAccessToken(response.accessToken);
      tokenManager.setRefreshToken(response.refreshToken);
      
      // 사용자 정보 저장
      setUser(response.user);
    } catch (error) {
      // 에러를 그대로 throw하여 LoginForm에서 처리할 수 있도록 함
      console.error('AuthContext login error:', error);
      throw error;
    }
  };

  // 로그아웃
  const logout = async () => {
    const refreshToken = tokenManager.getRefreshToken();
    
    if (refreshToken) {
      try {
        await authApi.logout({ refreshToken });
      } catch (error) {
        // 로그아웃 API 실패해도 클라이언트에서 토큰 삭제
        console.error('Logout error:', error);
      }
    }
    
    // 토큰 및 사용자 정보 삭제
    tokenManager.clearTokens();
    setUser(null);
  };

  // 사용자 정보 갱신
  const refreshUser = async () => {
    try {
      const userData = await usersApi.getProfile();
      setUser({
        id: userData.id,
        email: userData.email,
        nickname: userData.nickname,
        profileImage: userData.profileImage,
        bio: userData.bio,
      });
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

