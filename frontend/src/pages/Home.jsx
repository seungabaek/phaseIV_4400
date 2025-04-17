import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // for http requests to external APIs
import { useNavigate } from 'react-router-dom';
import './Home.css'; // css file

// url for backend
const API_URL = 'http://localhost:8800'; // validate backend actually running on port 8800



const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Flight Tracking Dashboard</h1>
            </header>
            <main className="home-main">
                <div className="button-container">
                    <button onClick={() => navigate('/add-airplane')} className="dashboard-button">
                        Add Airplane
                    </button>
                    <button onClick={() => navigate('/add-airport')} className="dashboard-button">
                        Add Airport
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Home;
