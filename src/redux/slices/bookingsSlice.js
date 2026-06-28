import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/api';

// 1. Async Thunks
export const fetchBookings = createAsyncThunk('bookings/fetchBookings', async (filters = {}, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams();
    if (filters.date) params.append('date', filters.date);
    if (filters.status) params.append('status', filters.status);
    if (filters.phone) params.append('phone', filters.phone);

    const data = await apiClient.get(`/bookings?${params.toString()}`);
    return data.data; // List of bookings
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createBooking = createAsyncThunk('bookings/createBooking', async (bookingData, { rejectWithValue }) => {
  try {
    const data = await apiClient.post('/bookings', bookingData);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const updateBookingStatus = createAsyncThunk(
  'bookings/updateBookingStatus',
  async ({ id, status, notes }, { rejectWithValue }) => {
    try {
      const data = await apiClient.put(`/bookings/${id}/status`, { status, notes });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const rescheduleBooking = createAsyncThunk(
  'bookings/rescheduleBooking',
  async ({ id, date, time }, { rejectWithValue }) => {
    try {
      const data = await apiClient.put(`/bookings/${id}/reschedule`, { date, time });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 2. Initial State
const initialState = {
  bookings: [],
  loading: false,
  error: null,
  // Draft details for active booking flow
  bookingWizard: {
    selectedService: null,
    selectedDate: '',
    selectedTime: '',
    customerName: '',
    address: '',
    notes: '',
  },
};

// 3. Slice Definition
const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setWizardService: (state, action) => {
      state.bookingWizard.selectedService = action.payload;
    },
    setWizardDateTime: (state, action) => {
      state.bookingWizard.selectedDate = action.payload.date;
      state.bookingWizard.selectedTime = action.payload.time;
    },
    setWizardCustomerDetails: (state, action) => {
      state.bookingWizard.customerName = action.payload.name;
      state.bookingWizard.address = action.payload.address;
      state.bookingWizard.notes = action.payload.notes;
    },
    clearBookingWizard: (state) => {
      state.bookingWizard = {
        selectedService: null,
        selectedDate: '',
        selectedTime: '',
        customerName: '',
        address: '',
        notes: '',
      };
    },
    clearBookingError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.unshift(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update status
      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex((b) => b._id === action.payload._id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reschedule Booking
      .addCase(rescheduleBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rescheduleBooking.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex((b) => b._id === action.payload._id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      .addCase(rescheduleBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setWizardService,
  setWizardDateTime,
  setWizardCustomerDetails,
  clearBookingWizard,
  clearBookingError,
} = bookingsSlice.actions;

export default bookingsSlice.reducer;
