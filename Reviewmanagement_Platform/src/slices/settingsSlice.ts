import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { settingsApi } from '../api/settingsApi';
import { getAgencyContactNumber, saveAgencyContactNumber, DEFAULT_AGENCY_PHONE } from '../lib/storage';

interface SettingsState {
  agencyPhone: string;
  agencyName: string;
  loading: boolean;
}

const initialState: SettingsState = {
  agencyPhone: getAgencyContactNumber(),
  agencyName: 'SmartXCRM Review Hub',
  loading: false,
};

export const fetchSettings = createAsyncThunk('settings/fetchSettings', async () => {
  try {
    const remote = await settingsApi.fetchSettings();
    if (remote && remote.agencyPhone) {
      return {
        agencyPhone: remote.agencyPhone,
        agencyName: remote.agencyName || 'SmartXCRM Review Hub',
      };
    }
    return { agencyPhone: DEFAULT_AGENCY_PHONE, agencyName: 'SmartXCRM Review Hub' };
  } catch {
    return { agencyPhone: DEFAULT_AGENCY_PHONE, agencyName: 'SmartXCRM Review Hub' };
  }
});

export const updateAgencyPhone = createAsyncThunk(
  'settings/updateAgencyPhone',
  async (phone: string) => {
    try {
      await settingsApi.updateSettings({ agencyPhone: phone });
    } catch (err) {
      console.warn('API settings notice:', err);
    }
    return phone;
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setAgencyPhoneDirect: (state, action: PayloadAction<string>) => {
      state.agencyPhone = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSettings.fulfilled, (state, action) => {
      state.agencyPhone = action.payload.agencyPhone;
      state.agencyName = action.payload.agencyName;
    });

    builder.addCase(updateAgencyPhone.fulfilled, (state, action) => {
      state.agencyPhone = action.payload;
    });
  },
});

export const { setAgencyPhoneDirect } = settingsSlice.actions;
export default settingsSlice.reducer;
