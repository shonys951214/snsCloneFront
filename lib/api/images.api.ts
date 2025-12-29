// 이미지 API

import apiClient from './client';
import { Image, UploadImageResponse } from '../types/image.types';
import { API_ENDPOINTS } from '../../utils/constants';

export const imagesApi = {
  // 이미지 업로드
  uploadImage: async (file: File): Promise<UploadImageResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<any>(
      API_ENDPOINTS.IMAGES.UPLOAD,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    // TransformInterceptor로 감싸진 응답 처리
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    
    // 직접 UploadImageResponse 형식인 경우
    if (response.data && response.data.id) {
      return response.data;
    }
    
    throw new Error('이미지 업로드 응답 형식이 올바르지 않습니다.');
  },

  // 내 이미지 목록 조회
  getMyImages: async (): Promise<Image[]> => {
    const response = await apiClient.get<Image[]>(API_ENDPOINTS.IMAGES.MY);
    return response.data;
  },

  // 이미지 삭제
  deleteImage: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(
      API_ENDPOINTS.IMAGES.DELETE(id)
    );
    return response.data;
  },
};

