import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import clientsReducer from '../slices/clientsSlice';
import leadsReducer from '../slices/leadsSlice';
import settingsReducer from '../slices/settingsSlice';
import reviewsReducer from '../slices/reviewsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clients: clientsReducer,
    leads: leadsReducer,
    settings: settingsReducer,
    reviews: reviewsReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
