"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { fetchUserSuccess, userLogout } from "@/redux/userSlice";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/init";
import LoginWrapper from "@/app/components/LoginWrapper";
import { NextPage } from "next";
import Selected from "@/app/components/books/Selected";
import RecommendedBooks from "@/app/components/books/Recommended";
import SuggestedBooks from "@/app/components/books/Suggested";

const ForYou: NextPage = () => {
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(true);

    // Access state from user slice
    const email = useAppSelector((state) => state.user.email);
    const loading = useAppSelector((state) => state.user.loading);
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
            <div className="container">
                <div className="row">
                    <div className="for-you__wrapper">
                        <div className="for-you__title">Selected just for you</div>
                        <div className="selected__book--skeleton"></div>
                        <div>
                            <div className="for-you__title">Recommended For You</div>
                            <div className="for-you__sub--title">We think you’ll like these</div>
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
                    </div>
                </div>
                <div>
                    <div className="for-you__title">Suggested Books</div>
                    <div className="for-you__sub--title">Browse those books</div>
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
            </div>
        )
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
        <div className="for-you__wrapper">
            <div className="container">
                <div className="row">

                    <Selected />
                    <RecommendedBooks books={[]} />
                    <SuggestedBooks />
                </div>
            </div>
        </div>
    );
};

export default ForYou;