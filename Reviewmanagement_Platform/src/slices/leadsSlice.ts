import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Lead } from '../lib/types';
import { leadsApi } from '../api/leadsApi';
import { getStoredLeads, saveStoredLeads } from '../lib/storage';

interface LeadsState {
  items: Lead[];
  loading: boolean;
  error: string | null;
}

const initialState: LeadsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchLeads = createAsyncThunk('leads/fetchLeads', async () => {
  try {
    const remote = await leadsApi.fetchLeads();
    if (Array.isArray(remote)) {
      return remote;
    }
    return [];
  } catch {
    return [];
  }
});

export const addLead = createAsyncThunk('leads/addLead', async (newLead: Lead) => {
  try {
    const saved = await leadsApi.submitLead(newLead);
    return saved || newLead;
  } catch (err) {
    console.warn('API lead submission notice:', err);
    return newLead;
  }
});

export const removeLead = createAsyncThunk('leads/removeLead', async (id: string) => {
  try {
    await leadsApi.deleteLead(id);
    return id;
  } catch (err) {
    console.warn('API lead deletion notice:', err);
    return id;
  }
});

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLeads.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchLeads.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchLeads.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(addLead.fulfilled, (state, action) => {
      state.items = [action.payload, ...state.items];
    });

    builder.addCase(removeLead.fulfilled, (state, action) => {
      state.items = state.items.filter((l) => l.id !== action.payload);
    });
  },
});

export default leadsSlice.reducer;
