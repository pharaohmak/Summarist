"use client";

import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/store"; // Adjust the path if necessary
import { fetchUser } from "@/redux/userSlice"; // Import the async thunk to fetch the user data
import LoginWrapper from "@/app/components/LoginWrapper";

const Settings: React.FC = () => {
  const dispatch = useAppDispatch();

  // Access state from user slice
  const email = useAppSelector((state) => state.user.email);
  const subscriptionStatus = useAppSelector((state) => state.user.subscriptionStatus);
  const loading = useAppSelector((state) => state.user.loading);
  const error = useAppSelector((state) => state.user.error);
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  // Dispatch fetchUser to get the authenticated user on component mount
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  // Log to check if authentication state changes correctly
  useEffect(() => {
    console.log("isAuthenticated:", isAuthenticated);
    console.log("loading:", loading);
    console.log("email:", email);
  }, [isAuthenticated, loading, email]);

  // Render loading skeleton while user data is being fetched
  if (loading) {
    return (
      <div className="skeleton-wrapper settings-content">
        <h1 className="section__title page__title">Settings</h1>
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-button"></div>
      </div>
    );
  }

  // Render error message if there was an error fetching user data
  if (error) {
    return <div>Error: {error}</div>;
  }

  // If not authenticated, show login wrapper
  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="row">
          <LoginWrapper />
        </div>
      </div>
    );
  }

  // Render settings page when the user is authenticated and data is ready
  return (
    <>
      <h1 className="section__title page__title">Settings</h1>

      <div className="setting__content">
        <h2 className="settings__sub--title">Your Subscription Plan</h2>
        <p className="settings__text">{subscriptionStatus || "None"}</p>

        {/* Conditionally show the "Upgrade Plan" button if the subscription is "Free" */}
        {!subscriptionStatus || subscriptionStatus === "Free" ? (
          <button className="btn btn--upgrade w-50 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:from-blue-500 hover:to-green-400 transition duration-300 transform hover:scale-105" onClick={() => (window.location.href = "/choose-plan")}>
            Upgrade Plan
          </button>
        ) : (
          <p>You are on the {subscriptionStatus} plan.</p>
        )}
      </div>

      <div className="setting__content">
        <h2 className="settings__sub--title">Email</h2>
        <p className="settings__text">{email}</p>
      </div>
    </>
  );
};

export default Settings;