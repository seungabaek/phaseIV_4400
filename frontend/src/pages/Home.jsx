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
                    <button onClick={() => navigate('/add-person')} className="dashboard-button">
                        Add Person
                    </button>
                    <button onClick={() => navigate('/assign-pilot')} className="dashboard-button">
                        Assign Pilot
                    </button>
                    <button onClick={() => navigate('/flight-landing')} className="dashboard-button">
                        Flight Landing
                    </button>
                    <button onClick={() => navigate('/flight-takeoff')} className="dashboard-button">
                        Flight Takeoff
                    </button>
                    <button onClick={() => navigate('/grant-or-revoke')} className="dashboard-button">
                        Grant or Revoke Pilot License 
                    </button>
                    <button onClick={() => navigate('/offer-flight')} className="dashboard-button">
                        Offer Flight
                    </button>
                    <button onClick={() => navigate('/passengers-board')} className="dashboard-button">
                        Passengers Board
                    </button>
                    <button onClick={() => navigate('/passengers-dissembark')} className="dashboard-button">
                        Passengers Disembark
                    </button>
                    <button onClick={() => navigate('/recycle-crew')} className="dashboard-button">
                        Recycle Crew
                    </button>
                    <button onClick={() => navigate('/retire-flight')} className="dashboard-button">
                        Retire Flight
                    </button>
                    <button onClick={() => navigate('/simulation-cycle')} className="dashboard-button">
                        Simulation Cycle
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Home;
