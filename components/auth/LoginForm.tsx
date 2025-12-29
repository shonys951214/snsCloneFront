'use client';

// 로그인 폼 컴포넌트

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('test@test.com');
  const [password, setPassword] = useState('testtest');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation(); // 이벤트 전파 방지
    
    // 로딩 중이면 중복 제출 방지
    if (isLoading) {
      return;
    }
    
    setIsLoading(true);
    setError(null); // 새 로그인 시도 시 이전 에러 메시지 초기화

    try {
      console.log('로그인 시도 - 이메일:', email);
      await login(email, password);
      console.log('로그인 성공');
      // 성공 시에만 에러 메시지 초기화 및 리다이렉트
      setError(null);
      setIsLoading(false);
      router.push('/feed');
    } catch (err: any) {
      console.error('로그인 에러:', err);
      console.error('에러 응답:', err.response?.data);
      console.error('에러 객체 전체:', err);
      
      // 에러 메시지 파싱 개선
      let errorMessage = '로그인에 실패했습니다.';
      
      if (err.response?.data) {
        const errorData = err.response.data;
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.message) {
          if (typeof errorData.message === 'string') {
            errorMessage = errorData.message;
          } else if (Array.isArray(errorData.message)) {
            errorMessage = errorData.message.join(', ');
          }
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      // 에러 메시지 설정
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {error && (
        <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg relative">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <strong className="font-semibold">로그인 실패</strong>
              <p className="mt-1 text-sm">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-900 flex-shrink-0"
              aria-label="에러 메시지 닫기"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
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
        <label htmlFor="password" className="block text-sm font-medium mb-2">
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          placeholder="비밀번호를 입력하세요"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? '로그인 중...' : '로그인'}
      </button>
    </form>
  );
};

