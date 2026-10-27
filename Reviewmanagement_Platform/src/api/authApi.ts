import { apiClient, setAuthToken, clearAuthToken } from './client';
import { AdminCredentials } from '../lib/types';

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    username: string;
    name?: string;
    role?: string;
    phone?: string;
  };
  error?: string;
}

export const authApi = {
  login: async (creds: AdminCredentials, remember = true): Promise<AuthResponse> => {
    const res = await apiClient<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(creds),
    });

    if (res.success && res.token) {
      setAuthToken(res.token, remember);
    }
    return res;
  },

  getMe: async (): Promise<AuthResponse> => {
    return apiClient<AuthResponse>('/api/auth/me', {
      method: 'GET',
    });
  },

  changePassword: async (newPassword: string, currentPassword?: string): Promise<{ success: boolean; message?: string }> => {
    return apiClient<{ success: boolean; message?: string }>('/api/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ newPassword, currentPassword }),
    });
  },

  logout: async (): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await apiClient<{ success: boolean; message?: string }>('/api/auth/logout', {
        method: 'POST',
      });
      return res;
    } catch {
      return { success: true };
    } finally {
      clearAuthToken();
    }
  },
};
