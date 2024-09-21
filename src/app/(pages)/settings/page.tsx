"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/store"; // Adjust the path if necessary
import { fetchUserSuccess, userLogout } from "@/redux/userSlice"; // Import the necessary actions
import { onAuthStateChanged } from "firebase/auth"; // Import Firebase auth
import { auth } from "@/firebase/init"; // Import your Firebase auth instance
import LoginWrapper from "@/app/components/LoginWrapper";

const Settings: React.FC = () => {
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(true); // Loading state

    // Access state from user slice
    const email = useAppSelector((state) => state.user.email);
    const subscriptionStatus = useAppSelector((state) => state.user.subscriptionStatus);
    const loading = useAppSelector((state) => state.user.loading);
    const error = useAppSelector((state) => state.user.error);
    const isAuthenticated = !!email; // Check if user is authenticated

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // Fetch user data or update state accordingly
                dispatch(fetchUserSuccess({
                    email: user.email || '', subscriptionStatus: 'premium-plus',
                    uid: ""
                }));
            } else {
                dispatch(userLogout());
            }
            setIsLoading(false); // Stop loading after the auth check
        });

        return () => unsubscribe(); // Cleanup the listener
    }, [dispatch]);

    if (isLoading || loading) {
        return (
            <div className="skeleton-wrapper settings-content">
                <h1 className="section__title page__title">Settings</h1>
                <div className="skeleton skeleton-title"></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-button"></div>
            </div>

        )
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!isAuthenticated) {
        return (
            <div className="container">
                <div className="row">
                    <LoginWrapper />

                </div>
            </div>
        )
    }

    return (
        <>
            <h1 className="section__title page__title">Settings</h1>

            <div className="setting__content">
                <h2 className="settings__sub--title">Your Subscription Plan</h2>
                <p className="settings__text">{subscriptionStatus}</p>
            </div>
            <div className="setting__content">
                <h2 className="settings__sub--title">Email</h2>
                <p className="settings__text">{email}</p>
            </div>
        </>
    );
};

export default Settings;