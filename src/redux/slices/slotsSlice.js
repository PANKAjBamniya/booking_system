import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/api';

// Helper to get formatted YYYY-MM-DD date
const getTodayString = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// 1. Async Thunks
export const fetchSlots = createAsyncThunk('slots/fetchSlots', async (date, { rejectWithValue }) => {
  try {
    const data = await apiClient.get(`/slots?date=${date}`);
    return data.data; // List of slots
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createBulkSlots = createAsyncThunk('slots/createBulkSlots', async (bulkData, { rejectWithValue }) => {
  try {
    const data = await apiClient.post('/slots/bulk', bulkData);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const updateSlot = createAsyncThunk('slots/updateSlot', async ({ id, slotData }, { rejectWithValue }) => {
  try {
    const data = await apiClient.put(`/slots/${id}`, slotData);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// 2. Initial State
const initialState = {
  slots: [],
  selectedDate: getTodayString(),
  loading: false,
  error: null,
};

// 3. Slice Definition
const slotsSlice = createSlice({
  name: 'slots',
  initialState,
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    clearSlotError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.slots = action.payload;
      })
      .addCase(fetchSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Bulk
      .addCase(createBulkSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBulkSlots.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createBulkSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateSlot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSlot.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.slots.findIndex((s) => s._id === action.payload._id);
        if (index !== -1) {
          state.slots[index] = action.payload;
        }
      })
      .addCase(updateSlot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedDate, clearSlotError } = slotsSlice.actions;
export default slotsSlice.reducer;
