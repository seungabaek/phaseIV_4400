import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './FormStyles.css';

const API_URL = 'http://localhost:8800';

const SimulationCycle = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [flights, setFlights] = useState([]); 

    const runSimulation = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await axios.post(`${API_URL}/simulation_cycle`);
            setSuccess(response.data.message || "Simulation cycle executed successfully.");
            fetchFlights(); 
        } catch (err) {
            console.error("Simulation cycle failed:", err);
            setError(err.response?.data?.message || "Simulation cycle failed.");
        } finally {
            setLoading(false);
        }
    };

    // Load flights
    const fetchFlights = useCallback(async () => {
        try {
            const res = await axios.get(`${API_URL}/flight`);
            setFlights(res.data);
        } catch (err) {
            console.error("Error fetching flights:", err);
        }
    }, []);

    useEffect(() => {
        fetchFlights();
    }, [fetchFlights]);

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Flight Tracking Dashboard - Simulation Cycle</h1>
            </header>

            <main className="home-main">
                <section className="card add-airplane-section">
                    <h2>Run Simulation Cycle</h2>
                    <button onClick={runSimulation} className="submit-button" disabled={loading}>
                        {loading ? 'Running...' : 'Run Simulation Cycle'}
                    </button>

                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                </section>

                <section className="card airplane-list-section">
                    <h2>Current Flights</h2>
                    {loading ? <p>Loading flights...</p> : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Flight ID</th>
                                        <th>Route ID</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {flights.map((f) => (
                                        <tr key={f.flightID}>
                                            <td>{f.flightID}</td>
                                            <td>{f.routeID}</td>
                                            <td>{f.airplane_status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default SimulationCycle;
