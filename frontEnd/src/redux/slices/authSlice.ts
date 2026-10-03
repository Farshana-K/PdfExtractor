import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types';
import type { RootState } from '../store';
import { api } from '../../lib/api';

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  initialized: false,
  error: null
};

export const refreshSession = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>(
  'auth/refreshSession',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/refresh');

      return data.user;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Session expired'
      );
    }
  }
);

export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', credentials);

      return data.user;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout');
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Logout failed'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setInitialized(state, action: PayloadAction<boolean>) {
      state.initialized = action.payload;
    },

    clearAuthError(state) {
      state.error = null;
    }
  },

  extraReducers: (builder) => {
    builder

      // Refresh session
      .addCase(refreshSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(refreshSession.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = action.payload;
      })

      .addCase(refreshSession.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.user = null;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })

      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload || 'Logout failed';
      });
  }
});

export const {
  setUser,
  setLoading,
  setInitialized,
  clearAuthError
} = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;

export const selectAuthInitialized = (state: RootState) =>
  state.auth.initialized;

export const selectAuthLoading = (state: RootState) =>
  state.auth.loading;

export const selectAuthError = (state: RootState) =>
  state.auth.error;

export default authSlice.reducer;