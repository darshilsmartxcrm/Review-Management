import { apiClient } from './client';
import { Client } from '../lib/types';

export interface ClientsResponse {
  success: boolean;
  count?: number;
  clients?: Client[];
  client?: Client;
  message?: string;
  error?: string;
}

export const clientsApi = {
  fetchClients: async (params?: { category?: string; status?: string; search?: string }): Promise<Client[]> => {
    const res = await apiClient<ClientsResponse>('/api/clients', {
      method: 'GET',
      params,
    });
    return res.clients || [];
  },

  fetchClientById: async (id: string): Promise<Client | null> => {
    try {
      const res = await apiClient<ClientsResponse>(`/api/clients/${encodeURIComponent(id)}`, {
        method: 'GET',
      });
      return res.client || null;
    } catch {
      return null;
    }
  },

  saveClient: async (client: Client): Promise<Client> => {
    const res = await apiClient<ClientsResponse>('/api/clients', {
      method: 'POST',
      body: JSON.stringify(client),
    });
    return res.client || client;
  },

  updateClient: async (id: string, updates: Partial<Client>): Promise<Client | null> => {
    const res = await apiClient<ClientsResponse>(`/api/clients/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return res.client || null;
  },

  deleteClient: async (id: string): Promise<boolean> => {
    const res = await apiClient<ClientsResponse>(`/api/clients/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return res.success;
  },

  syncAllClients: async (clients: Client[]): Promise<boolean> => {
    const res = await apiClient<ClientsResponse>('/api/clients', {
      method: 'POST',
      body: JSON.stringify(clients),
    });
    return res.success;
  },
};
