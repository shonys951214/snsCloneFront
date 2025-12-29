// 게시글 관련 타입 정의

export interface Post {
  id: number;
  userId: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  images: PostImage[];
  user: {
    id: number;
    nickname: string;
    profileImage: string;
  };
}

export interface PostImage {
  id: number;
  url: string;
  originalName: string | null;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  imageIds?: number[];
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  imageIds?: number[];
}

export interface PostsResponse {
  data: Post[];
  total: number;
  page: number;
  limit: number;
}

