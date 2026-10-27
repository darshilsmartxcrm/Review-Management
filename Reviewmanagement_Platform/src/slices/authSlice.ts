import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';
import { getAuthToken, clearAuthToken } from '../api/client';
import { AdminCredentials } from '../lib/types';
import { getAdminCredentials, isUserAuthenticated, setSessionAuthenticated, clearSessionAuth } from '../lib/storage';

export interface UserProfile {
  id: string;
  username: string;
  name?: string;
  role?: string;
  phone?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async ({ creds, remember }: { creds: AdminCredentials; remember: boolean }, { rejectWithValue }) => {
    try {
      // 1. Attempt API login
      const response = await authApi.login(creds, remember);
      if (response.success && response.token) {
        setSessionAuthenticated(remember);
        return {
          user: response.user || { id: 'admin', username: creds.username, role: 'admin' },
          token: response.token,
        };
      }
      return rejectWithValue(response.error || 'Invalid credentials');
    } catch (err: any) {
      // 2. Offline / Local fallback if backend is unreachable
      const localCreds = getAdminCredentials();
      if (creds.username.trim() === localCreds.username && creds.password === localCreds.password) {
        setSessionAuthenticated(remember);
        return {
          user: { id: 'local_admin', username: creds.username, role: 'admin' },
          token: 'offline_local_session_token',
        };
      }
      return rejectWithValue(err.message || 'Invalid Login ID or Password');
    }
  }
);

export const checkAuthSession = createAsyncThunk(
  'auth/checkAuthSession',
  async (_, { rejectWithValue }) => {
    const isLocalAuthed = isUserAuthenticated();
    const token = getAuthToken();

    if (!token && !isLocalAuthed) {
      return rejectWithValue('Not authenticated');
    }

    try {
      if (token && token !== 'offline_local_session_token') {
        const res = await authApi.getMe();
        if (res.success && res.user) {
          return { user: res.user, token };
        }
      }
      if (isLocalAuthed) {
        const creds = getAdminCredentials();
        return {
          user: { id: 'local_admin', username: creds.username, role: 'admin' },
          token: token || 'offline_local_session_token',
        };
      }
      return rejectWithValue('Session expired');
    } catch {
      if (isLocalAuthed) {
        const creds = getAdminCredentials();
        return {
          user: { id: 'local_admin', username: creds.username, role: 'admin' },
          token: token || 'offline_local_session_token',
        };
      }
      return rejectWithValue('Session check failed');
    }
  }
);

export const logoutAdmin = createAsyncThunk('auth/logoutAdmin', async () => {
  await authApi.logout();
  clearAuthToken();
  clearSessionAuth();
  return null;
});

export const changeAdminPassword = createAsyncThunk(
  'auth/changeAdminPassword',
  async ({ newPassword, currentPassword }: { newPassword: string; currentPassword?: string }, { rejectWithValue }) => {
    try {
      const res = await authApi.changePassword(newPassword, currentPassword);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to change password');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    setAuthenticatedDirect: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginAdmin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginAdmin.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    });
    builder.addCase(loginAdmin.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = (action.payload as string) || 'Authentication failed';
    });

    // Check Session
    builder.addCase(checkAuthSession.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(checkAuthSession.rejected, (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    });

    // Logout
    builder.addCase(logoutAdmin.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    });
  },
});

export const { clearAuthError, setAuthenticatedDirect } = authSlice.actions;
export default authSlice.reducer;
