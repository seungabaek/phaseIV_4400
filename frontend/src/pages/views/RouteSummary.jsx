import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './FormStyles.css';

const API_URL = 'http://localhost:8800';

const RouteSummary = () => {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRouteSummaries = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/route_summary`);
            setRoutes(response.data);
        } catch (err) {
            console.error("Error fetching route summaries:", err);
            setError(err.response?.data?.message || "Failed to fetch route summaries. Is the backend running and CORS enabled?");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRouteSummaries();
    }, [fetchRouteSummaries]);

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Route Summary</h1>
            </header>

            <main className="home-main">
                <section className="card route-summary-section">
                    <h2>Route Summaries</h2>
                    {loading && <p>Loading data...</p>}
                    {error && <p className="error-message">{error}</p>}
                    {!loading && !error && (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Route ID</th>
                                        <th>Number of Legs</th>
                                        <th>Leg Sequence</th>
                                        <th>Route Length (km)</th>
                                        <th>Number of Flights</th>
                                        <th>Flight List</th>
                                        <th>Airport Sequence</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {routes.length > 0 ? (
                                        routes.map((route, index) => (
                                            <tr key={index}>
                                                <td>{route.route}</td>
                                                <td>{route.num_legs}</td>
                                                <td>{route.leg_sequence || 'N/A'}</td>
                                                <td>{route.route_length || 'N/A'}</td>
                                                <td>{route.num_flights}</td>
                                                <td>{route.flight_list || 'N/A'}</td>
                                                <td>{route.airport_sequence || 'N/A'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7">No route summaries available.</td>
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

export default RouteSummary;