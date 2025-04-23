import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './FormStyles.css';

const API_URL = 'http://localhost:8800';

const PeopleOnGround = () => {
    const [airports, setAirports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPeopleOnGround = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/people_on_the_ground`);
            setAirports(response.data);
        } catch (err) {
            console.error("Error fetching people on the ground:", err);
            setError(err.response?.data?.message || "Failed to fetch people on the ground. Is the backend running and CORS enabled?");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPeopleOnGround();
    }, [fetchPeopleOnGround]);

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>People Currently on the Ground</h1>
            </header>

            <main className="home-main">
                <section className="card people-on-ground-section">
                    <h2>People on the Ground</h2>
                    {loading && <p>Loading data...</p>}
                    {error && <p className="error-message">{error}</p>}
                    {!loading && !error && (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Departing From</th>
                                        <th>Airport</th>
                                        <th>Airport Name</th>
                                        <th>City</th>
                                        <th>State</th>
                                        <th>Country</th>
                                        <th>Number of Pilots</th>
                                        <th>Number of Passengers</th>
                                        <th>Total People</th>
                                        <th>Person List</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {airports.length > 0 ? (
                                        airports.map((airport, index) => (
                                            <tr key={index}>
                                                <td>{airport.departing_from}</td>
                                                <td>{airport.airport}</td>
                                                <td>{airport.airport_name}</td>
                                                <td>{airport.city}</td>
                                                <td>{airport.state}</td>
                                                <td>{airport.country}</td>
                                                <td>{airport.num_pilots}</td>
                                                <td>{airport.num_passengers}</td>
                                                <td>{airport.joint_pilots_passengers}</td>
                                                <td>{airport.person_list || 'N/A'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="10">No data available for people on the ground.</td>
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

export default PeopleOnGround;