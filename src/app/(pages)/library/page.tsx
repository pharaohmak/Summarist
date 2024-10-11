"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { fetchUserSuccess, userLogout } from "@/redux/userSlice";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/init";
import LoginWrapper from "@/app/components/LoginWrapper";
import { NextPage } from "next";

const Library: NextPage = () => {
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(true);

    // Access state from user slice
    const email = useAppSelector((state) => state.user.email);
    const loading = useAppSelector((state) => state.user.loading);
    const error = useAppSelector((state) => state.user.error);
    const isAuthenticated = !!email;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                dispatch(fetchUserSuccess({
                    email: user.email || '', subscriptionStatus: 'premium-plus',
                    uid: ""
                }));
            } else {
                dispatch(userLogout());
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
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