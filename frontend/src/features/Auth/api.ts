import { api } from "@/lib/api";
import type { LoginCredentials, RegisterCredentials, User } from "@/features/Auth/types";

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post("/auth/token/", credentials); // Changed to JWT endpoint
    return response.data;
  },
  register: async (credentials: RegisterCredentials) => {
    const response = await api.post("/auth/register/", credentials);
    return response.data;
  },
  logout: async () => {
    // For JWT, we just clear client side, but we can hit logout endpoint if we implemented blacklisting.
    // The current backend logout view might be session-based.
    // Let's assume we won't error if we hit it.
    try {
        await api.post("/auth/logout/");
    } catch {} // Ignore backend logout error
    return;
  },
  getCurrentUser: async () => {
    const response = await api.get<User>("/auth/user/");
    return response.data;
  },
  updateProfile: async (data: Partial<User>) => {
    const response = await api.patch<User>("/auth/user/", data);
    return response.data;
  },
  updateEmail: async () => {
    const response = await api.put("/auth/update-email/");
    return response.data;
  },
  updatePhone: async () => {
    const response = await api.put("/auth/update-phone/");
    return response.data;
  },
};
