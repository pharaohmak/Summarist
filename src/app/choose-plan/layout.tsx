"use client";

import React from 'react';

const ChoosePlanLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="wrapper">
            <div className="container">
                <div className="row">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ChoosePlanLayout;