// src/components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Layout.css'; // Create this CSS file

const Layout = () => {
    return (
        <div className="layout-container">
            <Sidebar />
            <main className="content-area">
                <Outlet /> {/* This is where the routed components will render */}
            </main>
        </div>
    );
};

export default Layout;