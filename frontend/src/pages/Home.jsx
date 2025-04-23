import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const API_URL = 'http://localhost:8800'; 

// THIS IS HOME SCREEN WITH SIDEBAR
const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Flight Tracking Dashboard</h1>
            </header>
            <main className="home-main">
                <section className="card">
                <h2>Procedures</h2>
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
                    <button onClick={() => navigate('/grant-revoke-license')} className="dashboard-button">
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
                </section>
                
                <section className="card">
                <h2>Views</h2>
                <div className="button-container">
                    <button onClick={() => navigate('/view/flights-in-air')} className="dashboard-button">
                    Flights in Air
                    </button>
                    <button onClick={() => navigate('/view/flights-on-ground')} className="dashboard-button">
                    Flights on Ground
                    </button>
                    <button onClick={() => navigate('/view/people-in-air')} className="dashboard-button">
                    People in Air
                    </button>
                    <button onClick={() => navigate('/view/people-on-ground')} className="dashboard-button">
                    People on Ground
                    </button>
                    <button onClick={() => navigate('/view/route-summary')} className="dashboard-button">
                    Route Summary
                    </button>
                    <button onClick={() => navigate('/view/alternate-airports')} className="dashboard-button">
                    Alternate Airports
                    </button>
                </div>
                </section>
            </main>
        </div>
    );
};

export default Home;
