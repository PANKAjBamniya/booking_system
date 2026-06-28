import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/api';

// 1. Async Thunks
export const fetchDashboardStats = createAsyncThunk('admin/fetchDashboardStats', async (_, { rejectWithValue }) => {
  try {
    const data = await apiClient.get('/admin/dashboard');
    return data.data; // Dashboard stats and charts
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchCustomers = createAsyncThunk('admin/fetchCustomers', async (_, { rejectWithValue }) => {
  try {
    const data = await apiClient.get('/admin/customers');
    return data.data; // List of customers with detailed stats
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// 2. Initial State
const initialState = {
  kpi: {
    totalCustomers: 0,
    totalBookings: 0,
    todayAppointments: 0,
    upcomingAppointments: 0,
    todayRevenue: 0,
    monthlyRevenue: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
  },
  recentBookings: [],
  charts: {
    dailyBookings: [],
    monthlyRevenue: [],
  },
  customers: [],
  loading: false,
  error: null,
};

// 3. Slice Definition
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.kpi = action.payload.kpi;
        state.recentBookings = action.payload.recentBookings;
        state.charts = action.payload.charts;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Customers List
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
