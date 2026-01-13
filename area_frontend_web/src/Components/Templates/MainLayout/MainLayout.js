import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../Organisms/Navbar/Navbar';
import './MainLayout.css';

const MainLayout = () => {
    return (
        <div className="main-layout">
            <Navbar />

            <div className="main-layout__content">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;
