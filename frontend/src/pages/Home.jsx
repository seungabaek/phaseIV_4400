// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './HomeLanding.css'; // Create a new CSS file for landing page specific styles

const Home = () => {

    // Define navigation links dynamically (easier to manage)
    const procedures = [
        { path: '/proc/add-airport', label: 'Add Airport' },
        // Add other procedures as you create routes/components
        // { path: '/proc/add-airplane', label: 'Add Airplane' },
        // { path: '/proc/add-person', label: 'Add Person' },
    ];

    const views = [
        { path: '/view/flights-in-air', label: 'View Flights in Air' },
        // Add other views here
        // { path: '/view/flights-on-ground', label: 'View Flights on Ground' },
    ];


    return (
        <div className="landing-page-container">
            <header className="landing-header">
                <h1>Welcome to the Flight Management System</h1>
                <p className="landing-intro">
                    Manage and view airlines, airports, flights, personnel, and simulation data.
                    Use the navigation below or the sidebar to access different features.
                </p>
            </header>

            <section className="navigation-section">
                <h2>Manage Data (Procedures)</h2>
                <div className="nav-buttons">
                    {procedures.map(proc => (
                        <Link key={proc.path} to={proc.path} className="nav-button procedure-button">
                            {proc.label}
                        </Link>
                    ))}
                     {procedures.length === 0 && <p>No management actions available yet.</p>}
                </div>
            </section>

            <section className="navigation-section">
                <h2>View Data & Reports</h2>
                 <div className="nav-buttons">
                    {views.map(view => (
                        <Link key={view.path} to={view.path} className="nav-button view-button">
                            {view.label}
                        </Link>
                    ))}
                    {views.length === 0 && <p>No views available yet.</p>}
                 </div>
            </section>

            {/* You could add more sections or information here */}

        </div>
    );
};

export default Home;