"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { guestLogin, registerUser, resetPassword, toggleModal, userLogin, } from '@/redux/authSlice';
import { AppDispatch } from '@/redux/store'; // Ensure type safety for dispatch and RootState

const Modal: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    useEffect(() => {
    }, [isSignUp, dispatch]);

    const handleFormSubmit = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            if (!email || !password) {
                alert('Please fill in all fields.');
                return;
            }

            if (isSignUp) {
                dispatch(registerUser(email, password));
            } else {
                dispatch(userLogin(email, password));
            }
        },
        [email, password, isSignUp, dispatch]
    );

    return (
        <div className="auth__wrapper">
            <div className="auth">
                <div className="auth__content">
                    <div className="auth__title">
                        {isSignUp ? 'Sign Up for Summarist' : 'Log in to Summarist'}
                    </div>

                    {!isSignUp && (
                        <>
                            <button
                                className="btn guest__btn--wrapper"
                                onClick={() => dispatch(guestLogin())}
                            >
                                <figure className="google__icon--mask guest__icon--mask">
                                    <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth="0"
                                        viewBox="0 0 448 512"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path>
                                    </svg>
                                </figure>
                                <div>Login as a Guest</div>
                            </button>
                            <div className="auth__separator">
                                <span className="auth__separator--text">or</span>
                            </div>
                        </>
                    )}

                    {/* <button
                        className="btn google__btn--wrapper"
                        onClick={() => dispatch(googleLogin())}
                    >
                        <figure className="google__icon--mask">
                            <Image
                                alt="google"
                                src={google}
                                width={100}
                                height={100}
                                decoding="async"
                                loading="lazy"
                                style={{ color: 'transparent' }}
                            />
                        </figure>
                        <div>{isSignUp ? 'Sign Up with Google' : 'Login with Google'}</div>
                    </button>

                    <div className="auth__separator">
                        <span className="auth__separator--text">or</span>
                    </div> */}

                    <form className="auth__main--form" onSubmit={handleFormSubmit}>
                        <input
                            className="auth__main--input"
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            className="auth__main--input"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button className="btn" type="submit">
                            <span>{isSignUp ? 'Sign Up' : 'Login'}</span>
                        </button>
                    </form>
                </div>

                {!isSignUp && (
                    <div
                        className="auth__forgot--password"
                        onClick={() => {
                            const email = prompt("Please enter your email for password reset:");
                            if (email) {
                                dispatch(resetPassword(email));
                            } else {
                                alert("Please enter a valid email address.");
                            }
                        }}
                    >
                        Forgot your password?
                    </div>
                )}

                <button
                    className="auth__switch--btn"
                    onClick={() => setIsSignUp((prev) => !prev)}
                >
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                </button>

                <button
                    className="auth__close--btn"
                    onClick={() => dispatch(toggleModal())}
                >
                    <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 24 24"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M12 10.293l4.707-4.707 1.414 1.414L13.414 12l4.707 4.707-1.414 1.414L12 13.414l-4.707 4.707-1.414-1.414L10.586 12 5.879 7.293 7.293 5.879 12 10.293z"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Modal;