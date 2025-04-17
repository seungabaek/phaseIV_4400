import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Layout.css'; 

const Layout = () => {
    return (
        <div className="layout-container">
            <Sidebar />
            <main className="content-area">
                <Outlet /> {}
            </main>
        </div>
    );
};

export default Layout;