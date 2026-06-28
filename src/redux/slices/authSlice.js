import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/api';

// 1. Async Thunks
export const sendOtp = createAsyncThunk('auth/sendOtp', async ({ name, phone }, { rejectWithValue }) => {
  try {
    const data = await apiClient.post('/auth/send-otp', { name, phone });
    return { data, phone, name };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const verifyOtp = createAsyncThunk('auth/verifyOtp', async ({ phone, code }, { rejectWithValue }) => {
  try {
    const data = await apiClient.post('/auth/verify-otp', { phone, code });
    return data; // Contains token and user
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const data = await apiClient.get('/auth/profile');
    return data.user;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await apiClient.post('/auth/logout');
    return null;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// 2. Initial State
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  otpSent: false,
  phone: '',
  name: '',
  devOtp: '',       // OTP returned by backend for dev/testing display
  otpExpired: false, // True once the 10-second timer expires on the OTP screen
  isCheckingAuth: true,
};

// 3. Slice Definition
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.otpSent = false;
      state.phone = '';
      state.name = '';
      state.devOtp = '';
      state.otpExpired = false;
      state.error = null;
      state.loading = false;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    setOtpExpired: (state) => {
      state.otpExpired = true;
      state.devOtp = ''; // Hide OTP from UI once expired
    },
  },
  extraReducers: (builder) => {
    builder
      // Send OTP
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.otpExpired = false;
        state.devOtp = '';
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = true;
        state.phone = action.payload.phone;
        state.name = action.payload.name;
        // Store the backend-generated OTP for dev display on the OTP screen
        state.devOtp = action.payload.data?.otp || '';
        state.otpExpired = false;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.otpSent = false;
        state.phone = '';
        state.name = '';
        state.devOtp = '';
        state.otpExpired = false;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.isCheckingAuth = false;
        state.isAuthenticated = false;
        state.user = null;
      })

      // Logout - always clears state whether API call succeeds or fails
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        state.otpSent = false;
        state.phone = '';
        state.name = '';
        state.devOtp = '';
        state.otpExpired = false;
        localStorage.clear();
        sessionStorage.clear();
      })
      .addCase(logout.rejected, (state) => {
        // Even if the API call fails, always clear client-side state
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        state.otpSent = false;
        state.phone = '';
        state.name = '';
        state.devOtp = '';
        state.otpExpired = false;
        localStorage.clear();
        sessionStorage.clear();
      })
  },
});

export const { resetAuthState, clearAuthError, setOtpExpired } = authSlice.actions;
export default authSlice.reducer;
