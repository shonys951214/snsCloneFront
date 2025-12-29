'use client';

// 회원가입 폼 컴포넌트

import React, { useState } from 'react';
import { authApi } from '../../lib/api/auth.api';
import { useRouter } from 'next/navigation';
import { tokenManager } from '../../lib/auth/token';
import Link from 'next/link';

export const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // 클라이언트 측 유효성 검사
    if (!email.trim()) {
      setError('이메일을 입력해주세요.');
      return;
    }

    if (password.length < 8) {
      setError('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    if (nickname.length < 2 || nickname.length > 50) {
      setError('닉네임은 2자 이상 50자 이하여야 합니다.');
      return;
    }

    setIsLoading(true);

    try {
      console.log('회원가입 API 호출 시작 - BaseURL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');
      
      const response = await authApi.register({
        email: email.trim(),
        password,
        nickname: nickname.trim(),
      });
      
      console.log('회원가입 성공 응답:', response);
      
      // 응답이 HTML인지 확인 (API 호출 실패 시)
      if (typeof response === 'string' && response.includes('<!DOCTYPE')) {
        throw new Error('API 서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인하세요.');
      }
      
      // 회원가입 성공 시 응답 확인
      if (response && response.user && response.accessToken && response.refreshToken) {
        console.log('회원가입된 사용자:', response.user);
        console.log('회원가입 토큰 받음');
        
        // 회원가입 시 받은 토큰을 직접 저장
        tokenManager.setAccessToken(response.accessToken);
        tokenManager.setRefreshToken(response.refreshToken);
        
        setSuccess(true);
        
        // 페이지 새로고침하여 AuthContext가 토큰을 인식하도록 함
        // 또는 피드 페이지로 이동 (AuthContext가 자동으로 사용자 정보를 가져옴)
        setTimeout(() => {
          window.location.href = '/feed';
        }, 1000);
      } else {
        console.error('회원가입 응답 형식 오류:', response);
        throw new Error('회원가입 응답이 올바르지 않습니다.');
      }
    } catch (err: any) {
      console.error('회원가입 에러:', err);
      console.error('에러 응답:', err.response?.data);
      console.error('에러 상태:', err.response?.status);
      
      let errorMessage = '회원가입에 실패했습니다.';
      
      if (err.response?.data) {
        const errorData = err.response.data;
        
        // NestJS 에러 필터 형식 처리
        if (errorData.message) {
          if (Array.isArray(errorData.message)) {
            errorMessage = errorData.message.join(', ');
          } else if (typeof errorData.message === 'string') {
            errorMessage = errorData.message;
          }
        }
        // ValidationPipe 에러 형식 처리
        else if (Array.isArray(errorData)) {
          errorMessage = errorData
            .map((e: any) => Object.values(e.constraints || {}).join(', '))
            .join(', ');
        }
        // 기타 에러
        else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      // 409 Conflict 에러인 경우 (중복 이메일/닉네임)
      if (err.response?.status === 409) {
        // errorMessage는 이미 설정됨
      }
      
      setError(errorMessage);
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          회원가입이 완료되었습니다. 로그인 페이지로 이동합니다...
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          이메일
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          placeholder="이메일을 입력하세요"
          required
        />
      </div>
      <div>
        <label htmlFor="nickname" className="block text-sm font-medium mb-2">
          닉네임
        </label>
        <input
          id="nickname"
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          placeholder="닉네임을 입력하세요 (2-50자)"
          minLength={2}
          maxLength={50}
          required
        />
        <p className="text-xs text-gray-500 mt-1">2자 이상 50자 이하</p>
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2">
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          placeholder="비밀번호를 입력하세요 (최소 8자)"
          minLength={8}
          required
        />
        <p className="text-xs text-gray-500 mt-1">최소 8자 이상</p>
      </div>
      <button
        type="submit"
        disabled={isLoading || success}
        className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
      >
        {isLoading ? '회원가입 중...' : success ? '완료' : '회원가입'}
      </button>
      <div className="text-center">
        <Link href="/login" className="text-sm text-blue-500 hover:underline">
          이미 계정이 있으신가요? 로그인
        </Link>
      </div>
    </form>
  );
};

