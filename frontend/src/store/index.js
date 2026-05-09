import { configureStore } from '@reduxjs/toolkit';
import expertReducer from './slices/expertSlice';
import bookingReducer from './slices/bookingSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    experts: expertReducer,
    bookings: bookingReducer,
    auth: authReducer,
  },
});
