import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './FormStyles.css';

const API_URL = 'http://localhost:8800';

const FlightsInAir = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchFlightsInAir = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/flights_in_air`);
            setFlights(response.data);
        } catch (err) {
            console.error("Error fetching flights in the air:", err);
            setError(err.response?.data?.message || "Failed to fetch flights in the air. Is the backend running and CORS enabled?");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFlightsInAir();
    }, [fetchFlightsInAir]);

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Flights Currently in the Air</h1>
            </header>

            <main className="home-main">
                <section className="card flights-in-air-section">
                    <h2>Flights in the Air</h2>
                    {loading && <p>Loading flights...</p>}
                    {error && <p className="error-message">{error}</p>}
                    {!loading && !error && (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Departing From</th>
                                        <th>Arriving At</th>
                                        <th>Number of Airplanes</th>
                                        <th>Airplane List</th>
                                        <th>Flight List</th>
                                        <th>Earliest Arrival</th>
                                        <th>Latest Arrival</th>
                                        <th>Number of Pilots</th>
                                        <th>Number of Passengers</th>
                                        <th>Total People</th>
                                        <th>Person List</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {flights.length > 0 ? (
                                        flights.map((flight, index) => (
                                            <tr key={index}>
                                                <td>{flight.departing_from}</td>
                                                <td>{flight.arriving_at}</td>
                                                <td>{flight.num_airplanes}</td>
                                                <td>{flight.airplane_list || 'N/A'}</td>
                                                <td>{flight.flight_list || 'N/A'}</td>
                                                <td>{flight.earliest_arrival || 'N/A'}</td>
                                                <td>{flight.latest_arrival || 'N/A'}</td>
                                                <td>{flight.num_pilots}</td>
                                                <td>{flight.num_passengers}</td>
                                                <td>{flight.joint_pilots_passengers}</td>
                                                <td>{flight.person_list || 'N/A'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="11">No flights currently in the air.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default FlightsInAir;