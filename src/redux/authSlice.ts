import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  User, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup, 
  sendPasswordResetEmail 
} from 'firebase/auth';
import { auth } from '@/firebase/init';
import { AppThunk } from './store';
import { fetchUser } from './userSlice';
import { FirebaseError } from 'firebase/app';

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
const handleUserAuth = async (
  dispatch: (action: any) => void, 
  user: User
): Promise<void> => {
  dispatch(setUser(user));
  dispatch(fetchUser());
  window.location.href = '/for-you';
};

// Thunk to register a new user
export const registerUser = (email: string, password: string): AppThunk => async (dispatch) => {
  try {
    const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
    dispatch(setUser(userCredentials.user));
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      const errorMessage = error.message;
      console.error("Error creating user:", errorMessage);
      dispatch(setError(errorMessage));
    }
  }
};

// Thunk for user login
export const userLogin = (email: string, password: string): AppThunk => async (dispatch) => {
  try {
    const userCredentials = await signInWithEmailAndPassword(auth, email, password);
    dispatch(setUser(userCredentials.user));
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      const errorMessage = error.message;
      console.error("Error signing in:", errorMessage);
      dispatch(setError(errorMessage));
    }
  }
};

// Guest login
export const guestLogin = (): AppThunk => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const guestCredentials = await signInWithEmailAndPassword(auth, 'guest@gmail.com', 'guest123');
    handleUserAuth(dispatch, guestCredentials.user);
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      dispatch(setError('Error signing in as guest: ' + error.message));
    }
  }
};

// Google login
export const googleLogin = (): AppThunk => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    handleUserAuth(dispatch, result.user);
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      dispatch(setError('Error signing in with Google: ' + error.message));
    }
  }
};

// Logout user
export const logoutUser = (): AppThunk => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    await signOut(auth);
    dispatch(logout());
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      dispatch(setError('Error logging out: ' + error.message));
    }
  }
};

// Reset password
export const resetPassword = (email: string): AppThunk => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      console.error("Error sending password reset email:", error.message);
      dispatch(setError("Error sending password reset email"));
    }
  } finally {
    dispatch(setLoading(false));
  }
};

// Export actions and selectors
export const { setUser, logout, toggleModal, setLoading, setError } = authSlice.actions;

export const selectAuthState = (state: { auth: AuthState }) => ({
  user: state.auth.user,
  loading: state.auth.loading,
  error: state.auth.error,
  modalOpen: state.auth.modalOpen,
});

export default authSlice.reducer;