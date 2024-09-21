"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import logo from '@/app/assets/logo.png';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, toggleModal } from '@/redux/authSlice';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/init';
import Modal from './Modal';
import { fetchUserSuccess, userLogout } from '@/redux/userSlice';
import { RootState, AppDispatch } from '@/redux/store';
import SupportIcon from '../assets/icons/Support';
import SettingsIcon from '../assets/icons/Settings';
import Settings from '../assets/icons/Settings';
import Support from '../assets/icons/Support';
import Login from '../assets/icons/Login';
import Search from '../assets/icons/Search';
import Highlights from '../assets/icons/Highlights';
import Library from '../assets/icons/Library';
import Home from '../assets/icons/Home';
interface SidebarLinkProps {
    href: string;
    icon: React.ReactNode;
    text: string;
    disabled?: boolean;
    onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ href, icon, text, disabled, onClick }) => (
    <a
        className={`sidebar__link--wrapper ${disabled ? 'sidebar__link--not-allowed' : ''}`}
        href={disabled ? '#' : href}
        onClick={disabled ? undefined : onClick}
    >
        <div className="sidebar__link--line"></div>
        {icon}
        <div className="sidebar__link--text">{text}</div>
    </a>
);

const SideBar: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const modalOpen = useSelector((state: RootState) => state.auth.modalOpen);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const { uid, email, displayName } = user;
                dispatch(fetchUserSuccess({ uid, email, displayName }));
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