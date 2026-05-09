import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../utils/config';

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/bookings`, bookingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Booking failed');
    }
  }
);

export const fetchBookingsByEmail = createAsyncThunk(
  'bookings/fetchBookingsByEmail',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/bookings?email=${email}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to fetch bookings');
    }
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    list: [],
    loading: false,
    bookingInProgress: false,
    error: null,
    success: false,
  },
  reducers: {
    resetBookingState: (state) => {
      state.success = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.bookingInProgress = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createBooking.fulfilled, (state) => {
        state.bookingInProgress = false;
        state.success = true;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.bookingInProgress = false;
        state.error = action.payload;
      })
      .addCase(fetchBookingsByEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingsByEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
      })
      .addCase(fetchBookingsByEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetBookingState } = bookingSlice.actions;
export default bookingSlice.reducer;
