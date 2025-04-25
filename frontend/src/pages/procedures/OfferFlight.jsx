import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './FormStyles.css';

const API_URL = 'http://localhost:8800';

const AddAirplane = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [newFlight, setNewFlight] = useState({
        flightID: '',
        routeID: '',
        progress: '',
        nextTime: '',
        cost: '',
        supportAirline: '',
        supportTail: ''
    });

    const [addError, setAddError] = useState(null);
    const [addSuccess, setAddSuccess] = useState(null);

    const fetchFlights = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/flight`);
            setFlights(response.data);
        } catch (err) {
            console.error("Error fetching flights:", err);
            setError(err.response?.data?.message || "Failed to fetch flights. Is the backend running and CORS enabled?");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFlights();
    }, [fetchFlights]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewFlight((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddAirplane = async (event) => {
        event.preventDefault();
        setAddError(null);
        setAddSuccess(null);

        if (!newFlight.flightID || !newFlight.routeID || !newFlight.progress || !newFlight.nextTime || !newFlight.cost) {
            setAddError("Please fill in all required fields.");
            return;
        }

        const flightData = {
            flightID: newFlight.flightID,
            routeID: newFlight.routeID,
            progress: parseInt(newFlight.progress, 10),
            nextTime: newFlight.nextTime,
            cost: parseInt(newFlight.cost, 10),
            supportAirline: newFlight.supportAirline || null,
            supportTail: newFlight.supportTail || null
        };

        try {
            const response = await axios.post("http://localhost:8800/offer_flight", flightData);
            setAddSuccess("Flight offered successfully!");
            setNewFlight({
                flightID: '',
                routeID: '',
                progress: '',
                nextTime: '',
                cost: '',
                supportAirline: '',
                supportTail: ''
            });
            fetchFlights();
        } catch (err) {
            console.error("Error offering flight:", err);
            setAddError(err.response?.data?.message || "Failed to offer flight.");
        }
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Flight Tracking Dashboard</h1>
            </header>

            <main className="home-main">
                <section className="card add-airplane-section">
                    <h2>Offer Flight</h2>
                    <form onSubmit={handleAddAirplane} className="add-airplane-form">

                        <div className="form-group">
                            <label htmlFor="flightID">Flight ID *</label>
                            <input type="text" id="flightID" name="flightID" value={newFlight.flightID} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="routeID">Route ID *</label>
                            <input type="text" id="routeID" name="routeID" value={newFlight.routeID} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="progress">Progress *</label>
                            <input type="number" id="progress" name="progress" value={newFlight.progress} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="nextTime">Next Time *</label>
                            <input type="time" id="nextTime" name="nextTime" value={newFlight.nextTime} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="cost">Cost *</label>
                            <input type="number" id="cost" name="cost" value={newFlight.cost} onChange={handleInputChange} required />
                        </div>


                        <div className="form-group">
                            <label htmlFor="supportAirline">Support Airline</label>
                            <input type="text" id="supportAirline" name="supportAirline" value={newFlight.supportAirline} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="supportTail">Support Tail</label>
                            <input type="text" id="supportTail" name="supportTail" value={newFlight.supportTail} onChange={handleInputChange} />
                        </div>

                        {addError && <p className="error-message">{addError}</p>}
                        {addSuccess && <p className="success-message">{addSuccess}</p>}

                        <button type="submit" className="submit-button">Offer Flight</button>
                    </form>
                </section>

                {/* Section to Display Flights */}
                <section className="card airplane-list-section">
                    <h2>Flight List</h2>
                    {loading && <p>Loading flights...</p>}
                    {error && <p className="error-message">{error}</p>}
                    {!loading && !error && (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Flight ID</th>
                                        <th>Route ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {flights.length > 0 ? (
                                        flights.map((flight) => (
                                            <tr key={flight.flightID}>
                                                <td>{flight.flightID}</td>
                                                <td>{flight.routeID}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7">No flights found.</td>
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

export default AddAirplane;