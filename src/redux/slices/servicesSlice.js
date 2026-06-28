import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/api';

// 1. Async Thunks
export const fetchServices = createAsyncThunk('services/fetchServices', async (_, { rejectWithValue }) => {
  try {
    const data = await apiClient.get('/services');
    return data.data; // Array of services
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createService = createAsyncThunk('services/createService', async (formData, { rejectWithValue }) => {
  try {
    const data = await apiClient.post('/services', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const updateService = createAsyncThunk('services/updateService', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const data = await apiClient.put(`/services/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const deleteService = createAsyncThunk('services/deleteService', async (id, { rejectWithValue }) => {
  try {
    await apiClient.delete(`/services/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// 2. Initial State
const initialState = {
  services: [],
  loading: false,
  error: null,
};

// 3. Slice Definition
const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    clearServiceError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false;
        state.services.push(action.payload);
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.services.findIndex((s) => s._id === action.payload._id);
        if (index !== -1) {
          state.services[index] = action.payload;
        }
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false;
        state.services = state.services.filter((s) => s._id !== action.payload);
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearServiceError } = servicesSlice.actions;
export default servicesSlice.reducer;
