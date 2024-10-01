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
      state.isAuthenticated = true; // User is authenticated after fetching success
    },
    fetchUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false; // Failure means no authenticated user
    },
    userLogout: (state) => {
      state.uid = null;
      state.email = '';
      state.subscriptionStatus = '';
      state.loading = false;
      state.error = null;
      state.isAuthenticated = false; // User is logged out
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
          // Set subscription status dynamically based on email or other criteria
          const subscriptionStatus = user.email?.startsWith('guest') ? 'Free' : 'Premium'; // Update this logic based on actual subscription data
          
          dispatch(fetchUserSuccess({
            uid: user.uid,
            email: user.email || '',
            subscriptionStatus
          }));
        } else {
          dispatch(userLogout()); // No user means logout
        }
      });

      return unsubscribe; // Cleanup listener when done
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