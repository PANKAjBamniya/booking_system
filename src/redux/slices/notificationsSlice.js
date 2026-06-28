import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/api';

// 1. Async Thunks
export const fetchNotifications = createAsyncThunk('notifications/fetchNotifications', async (_, { rejectWithValue }) => {
  try {
    const data = await apiClient.get('/auth/notifications');
    return data.data; // List of notifications
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const markRead = createAsyncThunk('notifications/markRead', async (id, { rejectWithValue }) => {
  try {
    const data = await apiClient.put(`/auth/notifications/${id}/read`);
    return data.data; // Updated notification
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// 2. Initial State
const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

// 3. Slice Definition
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addLocalNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
    clearNotificationsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Mark Read
      .addCase(markRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex((n) => n._id === action.payload._id);
        if (index !== -1) {
          state.notifications[index] = action.payload;
        }
      });
  },
});

export const { addLocalNotification, clearNotificationsError } = notificationsSlice.actions;
export default notificationsSlice.reducer;
