export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
}

export interface Blog {
  _id: string;
  title: string;
  content: string;
  coverImage: string;
  tags: string[];
  author: string;
  isDraft: boolean;
  published: boolean;
  archived: boolean;
  readingTime: number;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogStats {
  total: number;
  drafts: number;
  published: number;
  archived: number;
  totalWords: number;
}

export type BlogStatusFilter = "all" | "draft" | "published" | "archived";

export interface PaginationMeta {
  total: number;
  page: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

export type SaveStatus = "idle" | "saving" | "saved" | "error";
