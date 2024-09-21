import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, User, signOut, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/firebase/init';
import { AppThunk } from './store';
import { fetchUser, fetchUserFailure, fetchUserStart, fetchUserSuccess } from './userSlice';

interface AuthState {
  user: User | null;
  modalOpen: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  modalOpen: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.loading = false;
    },
    toggleModal: (state) => {
      state.modalOpen = !state.modalOpen;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

// Helper function to handle user authentication
const handleUserAuth = async (dispatch: any, user: User) => {
  dispatch(setUser(user));
  dispatch(fetchUser());
  window.location.href = '/for-you';
};

// Thunk to register a new user
export const registerUser = (email: string, password: string): AppThunk => async (dispatch) => {
  try {
    const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
    dispatch(setUser(userCredentials.user));
    // Optionally handle redirect after successful registration here
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error creating user:", errorMessage);
  }
};

// Thunk for user login
export const userLogin = (email: string, password: string): AppThunk => async (dispatch) => {
  try {
    const userCredentials = await signInWithEmailAndPassword(auth, email, password);
    dispatch(setUser(userCredentials.user));
    // Optionally handle redirect after successful login here
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error signing in:", errorMessage);

    // Optionally handle specific errors
    if (errorCode === 'auth/wrong-password') {
      console.error('Wrong password.');
    } else if (errorCode === 'auth/user-not-found') {
      console.error('User not found.');
    }
  }
};

export const guestLogin = (): AppThunk => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const guestCredentials = await signInWithEmailAndPassword(auth, 'guest@gmail.com', 'guest123');
    handleUserAuth(dispatch, guestCredentials.user);
  } catch (error: any) {
    dispatch(setError('Error signing in as guest: ' + error.message));
  }
};

export const googleLogin = (): AppThunk => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    handleUserAuth(dispatch, result.user);
  } catch (error: any) {
    dispatch(setError('Error signing in with Google: ' + error.message));
  }
};

export const logoutUser = (): AppThunk => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    await signOut(auth);
    dispatch(logout());
  } catch (error: any) {
    dispatch(setError('Error logging out: ' + error.message));
  }
};

export const resetPassword = (email: string): AppThunk => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    await sendPasswordResetEmail(auth, email);
    //  dispatch a success action to handle UI feedback
  } catch (error: any) {
    console.error("Error sending password reset email:", error.message);
    dispatch(setError("Error sending password reset email"));
  } finally {
    dispatch(setLoading(false)); // Always stop the loading state
  }
};

export const { setUser, logout, toggleModal, setLoading, setError } = authSlice.actions;

export const selectAuthState = (state: { auth: AuthState }) => ({
  user: state.auth.user,
  loading: state.auth.loading,
  error: state.auth.error,
  modalOpen: state.auth.modalOpen,
});

export default authSlice.reducer;
