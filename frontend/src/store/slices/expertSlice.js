import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../utils/config';

export const fetchExperts = createAsyncThunk(
  'experts/fetchExperts',
  async ({ page = 1, search = '', category = 'All' }, { rejectWithValue }) => {
    try {
      const catParam = category === 'All' ? '' : `&category=${category}`;
      const response = await axios.get(`${API_BASE_URL}/api/experts?page=${page}&search=${search}${catParam}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to fetch experts');
    }
  }
);

export const fetchExpertById = createAsyncThunk(
  'experts/fetchExpertById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/experts/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to fetch expert details');
    }
  }
);

const expertSlice = createSlice({
  name: 'experts',
  initialState: {
    list: [],
    pagination: {},
    selectedExpert: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedExpert: (state) => {
      state.selectedExpert = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExperts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExperts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchExperts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchExpertById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpertById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedExpert = action.payload.data;
      })
      .addCase(fetchExpertById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedExpert } = expertSlice.actions;
export default expertSlice.reducer;
