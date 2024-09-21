"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/app/assets/logo.png';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, toggleModal } from '@/redux/authSlice';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/firebase/init';
import Modal from './Modal';
import { fetchUserSuccess, userLogout } from '@/redux/userSlice';
import { RootState, AppDispatch } from '@/redux/store';

import SupportIcon from '../assets/icons/Support';
import SettingsIcon from '../assets/icons/Settings';
import Login from '../assets/icons/Login';
import Search from '../assets/icons/Search';
import Highlights from '../assets/icons/Highlights';
import Library from '../assets/icons/Library';
import Home from '../assets/icons/Home';

// Define the prop types for SidebarLink
interface SidebarLinkProps {
    href: string;
    icon: React.ReactNode;
    text: string;
    disabled?: boolean;
    onClick?: () => void;
}

// Functional component for SidebarLink using React.FC and the defined props
const SidebarLink: React.FC<SidebarLinkProps> = ({ href, icon, text, disabled = false, onClick }) => (
    <Link
        href={disabled ? '#' : href}
        onClick={disabled ? undefined : onClick}
        className={`sidebar__link--wrapper ${disabled ? 'sidebar__link--not-allowed' : ''}`}
    >
        <div className="sidebar__link--line"></div>
        {icon}
        <div className="sidebar__link--text">{text}</div>
    </Link>
);

const SideBar: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const modalOpen = useSelector((state: RootState) => state.auth.modalOpen);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
            if (user) {
                const { uid, email } = user;
                // Manually set a subscription status, or fetch from another source
                dispatch(fetchUserSuccess({
                    uid, 
                    email: email ?? 'No email provided',
                    subscriptionStatus: 'premium-plus', // Example static subscriptionStatus
                }));
                setIsUserLoggedIn(true);
            } else {
                dispatch(userLogout());
                setIsUserLoggedIn(false);
            }
        });

        return () => unsubscribe(); // Cleanup on unmount
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logoutUser());
        setIsUserLoggedIn(false);
    };

    return (
        <>
            {modalOpen && !isUserLoggedIn && <Modal />}
            <div className="sidebar__overlay sidebar__overlay--hidden"></div>
            <div className="sidebar sidebar--closed">
                <div className="sidebar__logo">
                    <Image
                        alt="App Logo"
                        src={logo}
                        width={495}
                        height={114}
                        priority
                    />
                </div>
                <div className="sidebar__wrapper">
                    <div className="sidebar__top">
                        <SidebarLink href="/for-you" icon={<Home />} text="For you" />
                        <SidebarLink href="/library" icon={<Library />} text="My Library" />
                        <SidebarLink href="#" icon={<Highlights />} text="Highlights" disabled />
                        <SidebarLink href="#" icon={<Search />} text="Search" disabled />
                    </div>
                    <div className="sidebar__bottom">
                        <SidebarLink href="/settings" icon={<SettingsIcon />} text="Settings" />
                        <SidebarLink href="#" icon={<SupportIcon />} text="Help & Support" disabled />
                        <div className="sidebar__link--wrapper">
                            <div className="sidebar__link--line "></div>
                            <Login />
                            <div className="sidebar__link--text">
                                <button
                                    id="sideBar__login"
                                    onClick={isUserLoggedIn ? handleLogout : () => dispatch(toggleModal())}
                                >
                                    {isUserLoggedIn ? 'Logout' : 'Login'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SideBar;