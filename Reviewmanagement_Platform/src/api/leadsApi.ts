import { apiClient } from './client';
import { Lead } from '../lib/types';

export interface LeadsResponse {
  success: boolean;
  count?: number;
  leads?: Lead[];
  lead?: Lead;
  message?: string;
  error?: string;
}

export const leadsApi = {
  fetchLeads: async (params?: { status?: string; search?: string }): Promise<Lead[]> => {
    const res = await apiClient<LeadsResponse>('/api/leads', {
      method: 'GET',
      params,
    });
    return res.leads || [];
  },

  submitLead: async (lead: Lead): Promise<Lead> => {
    const res = await apiClient<LeadsResponse>('/api/leads', {
      method: 'POST',
      body: JSON.stringify(lead),
    });
    return res.lead || lead;
  },

  deleteLead: async (id: string): Promise<boolean> => {
    const res = await apiClient<LeadsResponse>(`/api/leads/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return res.success;
  },
};
