export interface ApiPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface CreatePostPayload {
  title: string;
  body: string;
  userId: number;
}
