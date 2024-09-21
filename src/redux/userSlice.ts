import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/init';

interface UserState {
  email: string;
  subscriptionStatus: string;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  email: '',
  subscriptionStatus: '',
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Define the user slice
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      fetchUserStart: (state) => {
        state.loading = true;
        state.error = null;
      },
      fetchUserSuccess: (state, action: PayloadAction<{ email: string; subscriptionStatus: string }>) => {
        state.email = action.payload.email;
        state.subscriptionStatus = action.payload.subscriptionStatus;
        state.loading = false;
        state.isAuthenticated = true;
      },
      fetchUserFailure: (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      },
      userLogout: (state) => {
        state.email = '';
        state.subscriptionStatus = '';
        state.loading = false;
        state.error = null;
        state.isAuthenticated = false;
      },
    },
  });

// Async thunk to fetch user data from Firebase
export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { dispatch }) => {
    dispatch(fetchUserStart());
    try {
      return new Promise<void>((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(
          auth,
          (user) => {
            if (user) {
              dispatch(fetchUserSuccess({ email: user.email || '', subscriptionStatus: 'premium-plus' }));
            } else {
              dispatch(userLogout());
            }
            resolve();
          },
          (error) => {
            dispatch(fetchUserFailure('Failed to load user data.'));
            reject(error);
          }
        );
        return unsubscribe; // Ensure cleanup
      });
    } catch (error) {
      dispatch(fetchUserFailure('Failed to load user data.'));
    }

    
  }
);

export const { fetchUserStart, fetchUserSuccess, fetchUserFailure, userLogout } = userSlice.actions;
export const selectUserState = (state: { user: UserState }) => state.user;
export default userSlice.reducer;