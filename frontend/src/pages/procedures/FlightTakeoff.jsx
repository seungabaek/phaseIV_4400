import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './FormStyles.css'; 

const API_URL = 'http://localhost:8800';

const FlightTakeoff = () => {
    const [flightID, setFlightID] = useState('');
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchFlights = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/flight`);
            setFlights(response.data);
        } catch (err) {
            console.error("Error fetching flights:", err);
            setError("Failed to fetch flights.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFlights();
    }, [fetchFlights]);

    const handleTakeoff = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        if (!flightID) {
            setError("Flight ID is required.");
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/flight_takeoff`, { flightID });
            setSuccess(`Flight ${flightID} took off successfully!`);
            setFlightID('');
            fetchFlights();
        } catch (err) {
            console.error("Takeoff error:", err);
            setError(err.response?.data?.message || "Takeoff failed.");
        }
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Flight Tracking Dashboard - Flight Takeoff</h1>
            </header>

            <main className="home-main">
                <section className="card add-airplane-section">
                    <h2>Initiate Flight Takeoff</h2>
                    <form onSubmit={handleTakeoff} className="add-airplane-form">
                        <div className="form-group">
                            <label htmlFor="flightID">Flight ID</label>
                            <input
                                type="text"
                                id="flightID"
                                name="flightID"
                                value={flightID}
                                onChange={(e) => setFlightID(e.target.value)}
                                required
                            />
                        </div>

                        {error && <p className="error-message">{error}</p>}
                        {success && <p className="success-message">{success}</p>}

                        <button type="submit" className="submit-button">Initiate Takeoff</button>
                    </form>
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

export default FlightTakeoff;
