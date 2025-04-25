import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FormStyles.css';

const API_URL = 'http://localhost:8800';

const FlightsInAir = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const response = await axios.get(`${API_URL}/flights_in_the_air`);
                setFlights(response.data);
            } catch (err) {
                console.error("Error fetching flights:", err);
                setError("Failed to fetch flights.");
            } finally {
                setLoading(false);
            }
        };

        fetchFlights();
    }, []);

    return (
        <div className="table-container">
            <h2>Flights In Air</h2>
            {loading ? (
                <p>Loading flights...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Departing From</th>
                            <th>Arriving At</th>
                            <th>Number of Flights</th>
                            <th>Flight List</th>
                            <th>Earliest Arrival</th>
                            <th>Latest Arrival</th>
                            <th>Airplane List</th>
                        </tr>
                    </thead>
                    <tbody>
                        {flights.length > 0 ? (
                            flights.map((flight, index) => (
                                <tr key={index}>
                                    <td>{flight.departing_from}</td>
                                    <td>{flight.arriving_at}</td>
                                    <td>{flight.num_flights}</td>
                                    <td>{flight.flight_list}</td>
                                    <td>{flight.earliest_arrival}</td>
                                    <td>{flight.latest_arrival}</td>
                                    <td>{flight.airplane_list}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">No flights found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default FlightsInAir;