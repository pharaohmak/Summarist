// pages/layout.tsx
"use client";

import React from 'react';
import SideBar from "@/app/components/SideBar";
import SearchBar from "@/app/components/SearchBar";

const pagesLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="wrapper">
            <SideBar />
            <SearchBar />
            <div className="container">
                <div className="row">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default pagesLayout;