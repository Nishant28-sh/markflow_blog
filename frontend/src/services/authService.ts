import api from "./api";
import type { ApiResponse, User } from "@/types";

interface AuthPayload {
  user: User;
  token: string;
}

export const authService = {
  async register(name: string, email: string, password: string) {
    const { data } = await api.post<ApiResponse<AuthPayload>>("/auth/register", {
      name,
      email,
      password,
    });
    return data.data;
  },

  async login(email: string, password: string) {
    const { data } = await api.post<ApiResponse<AuthPayload>>("/auth/login", {
      email,
      password,
    });
    return data.data;
  },

  async getMe() {
    const { data } = await api.get<ApiResponse<{ user: User }>>("/auth/me");
    return data.data.user;
  },
};
