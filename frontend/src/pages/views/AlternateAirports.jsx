import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FormStyles.css';

const API_URL = 'http://localhost:8800';

const AlternateAirports = () => {
    const [airports, setAirports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAirports = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${API_URL}/alternate_airports`);
                setAirports(response.data);
            } catch (err) {
                console.error("Error fetching airports:", err);
                setError("Failed to fetch airports.");
            } finally {
                setLoading(false);
            }
        };

        fetchAirports();
    }, []);

    return (
        <div className="table-container">
            <h2>Alternate Airports</h2>
            {loading ? (
                <p>Loading airports...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>City</th>
                            <th>State</th>
                            <th>Country</th>
                            <th>Number of Airports</th>
                            <th>Airport Codes</th>
                            <th>Airport Names</th>
                        </tr>
                    </thead>
                    <tbody>
                        {airports.length > 0 ? (
                            airports.map((airport, index) => (
                                <tr key={index}>
                                    <td>{airport.city}</td>
                                    <td>{airport.state}</td>
                                    <td>{airport.country}</td>
                                    <td>{airport.num_airports}</td>
                                    <td>{airport.airport_code_list}</td>
                                    <td>{airport.airport_name_list}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No airports found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AlternateAirports;