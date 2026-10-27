import { apiClient } from './client';

export interface SettingsPayload {
  agencyPhone?: string;
  agencyName?: string;
  supportEmail?: string;
  reviewLockHours?: number;
}

export interface SettingsResponse {
  success: boolean;
  settings?: SettingsPayload;
  message?: string;
  error?: string;
}

export const settingsApi = {
  fetchSettings: async (): Promise<SettingsPayload | null> => {
    try {
      const res = await apiClient<SettingsResponse>('/api/settings', {
        method: 'GET',
      });
      return res.settings || null;
    } catch {
      return null;
    }
  },

  updateSettings: async (settings: SettingsPayload): Promise<SettingsPayload | null> => {
    const res = await apiClient<SettingsResponse>('/api/settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
    return res.settings || null;
  },
};
