import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import servicesReducer from './slices/servicesSlice';
import slotsReducer from './slices/slotsSlice';
import bookingsReducer from './slices/bookingsSlice';
import notificationsReducer from './slices/notificationsSlice';
import adminReducer from './slices/adminSlice';

// Combine all slice reducers normally
const appReducer = combineReducers({
  auth: authReducer,
  services: servicesReducer,
  slots: slotsReducer,
  bookings: bookingsReducer,
  notifications: notificationsReducer,
  admin: adminReducer,
});

// Root reducer: wipe ALL slices back to their initial state on logout (fulfilled or rejected)
const rootReducer = (state, action) => {
  if (
    action.type === 'auth/logout/fulfilled' ||
    action.type === 'auth/logout/rejected'
  ) {
    // Passing undefined resets every slice to its own initialState
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

export default store;
