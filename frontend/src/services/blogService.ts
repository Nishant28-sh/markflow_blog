import api from "./api";
import type { ApiResponse, Blog, BlogStats, BlogStatusFilter, PaginationMeta } from "@/types";

export const blogService = {
  async list(params: { status?: BlogStatusFilter; page?: number; search?: string }) {
    const { data } = await api.get<ApiResponse<Blog[]>>("/blogs", {
      params: { ...params, status: params.status === "all" ? undefined : params.status },
    });
    return { blogs: data.data, meta: data.meta as PaginationMeta };
  },

  async stats() {
    const { data } = await api.get<ApiResponse<BlogStats>>("/blogs/stats");
    return data.data;
  },

  async getById(id: string) {
    const { data } = await api.get<ApiResponse<Blog>>(`/blogs/${id}`);
    return data.data;
  },

  async create(payload: Partial<Blog>) {
    const { data } = await api.post<ApiResponse<Blog>>("/blogs", payload);
    return data.data;
  },

  async update(id: string, payload: Partial<Blog>) {
    const { data } = await api.put<ApiResponse<Blog>>(`/blogs/${id}`, payload);
    return data.data;
  },

  async remove(id: string) {
    await api.delete(`/blogs/${id}`);
  },

  async duplicate(id: string) {
    const { data } = await api.post<ApiResponse<Blog>>(`/blogs/${id}/duplicate`);
    return data.data;
  },

  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append("image", file);
    const { data } = await api.post<ApiResponse<{ url: string }>>("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data.url;
  },
};
