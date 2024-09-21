"use client"

import { auth } from "@/firebase/init";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import login from "@/app/assets/login.png"; // Make sure your build setup supports this
import Image from "next/image";
import { useDispatch } from "react-redux";
import { toggleModal } from "@/redux/authSlice";

const LoginWrapper: React.FC = () => {
    const [, setUserSignedIn] = useState<boolean>(false);
    const dispatch = useDispatch();


    useEffect(() => {
        // Track authentication state
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUserSignedIn(!!user); // Set userSignedIn to true if user exists
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return (
        <div className="settings__login--wrapper">
            <Image
                alt="login"
                src={login.src} // For TypeScript compatibility, ensure this format works in your setup
                width="1033"
                height="712"
                decoding="async"
                loading="lazy"
                style={{ color: 'transparent' }}
            />
            <div className="settings__login--text">Log in to your account to see your details.</div>
            <button className="btn settings__login--btn" onClick={() => dispatch(toggleModal())}>Login</button>
        </div>
    );
}

export default LoginWrapper;