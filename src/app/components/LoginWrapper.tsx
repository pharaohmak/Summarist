"use client"

import { auth } from "@/firebase/init";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import login from "@/app/assets/login.png";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { toggleModal } from "@/redux/authSlice";

const LoginWrapper: React.FC = () => {
    const [, setUserSignedIn] = useState<boolean>(false);
    const dispatch = useDispatch();


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUserSignedIn(!!user);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="settings__login--wrapper">
            <Image
                alt="login"
                src={login.src}
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