import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Client } from '../lib/types';
import { clientsApi } from '../api/clientsApi';
import { getStoredClients, saveStoredClients } from '../lib/storage';

interface ClientsState {
  items: Client[];
  loading: boolean;
  error: string | null;
  selectedCategory: string;
  selectedStatus: 'all' | 'active' | 'upcoming' | 'expired';
  searchQuery: string;
}

const initialState: ClientsState = {
  items: [],
  loading: false,
  error: null,
  selectedCategory: 'all',
  selectedStatus: 'all',
  searchQuery: '',
};

export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (_, { rejectWithValue }) => {
    try {
      const remote = await clientsApi.fetchClients();
      if (Array.isArray(remote)) {
        return remote;
      }
      return getStoredClients();
    } catch (err: any) {
      return getStoredClients();
    }
  }
);

export const saveClient = createAsyncThunk(
  'clients/saveClient',
  async (clientData: Client, { rejectWithValue }) => {
    try {
      const saved = await clientsApi.saveClient(clientData);
      return saved || clientData;
    } catch (err: any) {
      console.warn('API save notice:', err);
      return clientData;
    }
  }
);

export const deleteClient = createAsyncThunk(
  'clients/deleteClient',
  async (id: string, { rejectWithValue }) => {
    try {
      await clientsApi.deleteClient(id);
      return id;
    } catch (err: any) {
      console.warn('API delete notice:', err);
      return id;
    }
  }
);

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setCategoryFilter: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<'all' | 'active' | 'upcoming' | 'expired'>) => {
      state.selectedStatus = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setClientsDirect: (state, action: PayloadAction<Client[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchClients.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchClients.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchClients.rejected, (state, action) => {
      state.loading = false;
      state.error = 'Failed to load clients';
    });

    builder.addCase(saveClient.fulfilled, (state, action) => {
      const idx = state.items.findIndex((c) => c.id === action.payload.id);
      if (idx >= 0) {
        state.items[idx] = action.payload;
      } else {
        state.items = [action.payload, ...state.items];
      }
    });

    builder.addCase(deleteClient.fulfilled, (state, action) => {
      state.items = state.items.filter((c) => c.id !== action.payload);
    });
  },
});

export const { setCategoryFilter, setStatusFilter, setSearchQuery, setClientsDirect } = clientsSlice.actions;
export default clientsSlice.reducer;
