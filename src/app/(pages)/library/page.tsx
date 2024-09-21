"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/store"; // Adjust the path if necessary
import { fetchUserSuccess, userLogout } from "@/redux/userSlice"; // Import the necessary actions
import { onAuthStateChanged } from "firebase/auth"; // Import Firebase auth
import { auth } from "@/firebase/init"; // Import your Firebase auth instance
import SearchBar from "@/app/components/SearchBar";
import SideBar from "@/app/components/SideBar";
import LoginWrapper from "@/app/components/LoginWrapper";
import { NextPage } from "next";


const Library: NextPage = () => {
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
                dispatch(fetchUserSuccess({ email: user.email || '', subscriptionStatus: 'premium-plus' }));
            } else {
                dispatch(userLogout());
            }
            setIsLoading(false); // Stop loading after the auth check
        });

        return () => unsubscribe(); // Cleanup the listener
    }, [dispatch]);

    if (isLoading || loading) {
        return (
            <div>
                <div className="for-you__title">My Library</div>
                <div className="recommended__books--skeleton-wrapper">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="recommended__books--skeleton">
                            <div className="skeleton" style={{ width: '100%', height: '240px', marginBottom: '8px' }}></div>
                            <div className="skeleton" style={{ width: '100%', height: '20px', marginBottom: '8px' }}></div>
                            <div className="skeleton" style={{ width: '90%', height: '16px', marginBottom: '8px' }}></div>
                            <div className="skeleton" style={{ width: '80%', height: '32px', marginBottom: '8px' }}></div>
                            <div className="skeleton" style={{ width: '90%', height: '16px' }}></div>
                        </div>
                    ))}
                </div>
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
        <div>
            “Display the books that users have finished listening to, or those that they have saved.”
        </div>
    );
};

export default Library;