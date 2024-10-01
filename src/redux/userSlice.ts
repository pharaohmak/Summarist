import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/init';

// Define User State Interface
interface UserState {
  uid: string | null;
  email: string;
  subscriptionStatus: string;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Initial State
const initialState: UserState = {
  uid: null,
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
    fetchUserSuccess: (
      state, 
      action: PayloadAction<{ uid: string; email: string; subscriptionStatus: string }>
    ) => {
      state.uid = action.payload.uid;
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
      state.uid = null;
      state.email = '';
      state.subscriptionStatus = '';
      state.loading = false;
      state.error = null;
      state.isAuthenticated = false;
    },
    updateSubscriptionStatus: (state, action: PayloadAction<string>) => {
      state.subscriptionStatus = action.payload;
    },
  },
});

// Async thunk to fetch user data from Firebase
export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { dispatch }) => {
    dispatch(fetchUserStart());
    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          const subscriptionStatus = user.email?.startsWith('guest') ? 'Free' : '';
          dispatch(fetchUserSuccess({
            uid: user.uid,
            email: user.email || '',
            subscriptionStatus
          }));
        } else {
          dispatch(userLogout());
        }
      });

      return unsubscribe; // Ensure cleanup
    } catch (error) {
      if (error instanceof Error) {
        dispatch(fetchUserFailure('Failed to load user data: ' + error.message));
      } else {
        dispatch(fetchUserFailure('An unknown error occurred.'));
      }
    }
  }
);

// Export Actions and Reducer
export const { fetchUserStart, fetchUserSuccess, fetchUserFailure, userLogout, updateSubscriptionStatus } = userSlice.actions;
export const selectUserState = (state: { user: UserState }) => state.user;
export default userSlice.reducer;