import React, { useState } from 'react';
import axios from 'axios';
import './FormStyles.css';

const API_URL = 'http://localhost:8800';

const PassengersBoard = () => {
    const [flightID, setFlightID] = useState('');
    const [boardError, setBoardError] = useState(null);
    const [boardSuccess, setBoardSuccess] = useState(null);
    const [boardedPassengers, setBoardedPassengers] = useState([]);

    const handleInputChange = (event) => {
        setFlightID(event.target.value);
    };

    const handleBoardPassengers = async (event) => {
        event.preventDefault(); 
        setBoardError(null);
        setBoardSuccess(null);

        if (!flightID.trim()) {
            setBoardError("Flight ID is required.");
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/passengers_board`, { flightID });
            setBoardSuccess(response.data.message);
            setFlightID('');
            fetchBoardedPassengers(flightID); 
        } catch (err) {
            console.error("Error boarding passengers:", err);
            setBoardError(err.response?.data?.message || "Failed to board passengers.");
        }
    };

    const fetchBoardedPassengers = async (flightID) => {
        try {
            const response = await axios.get(`${API_URL}/boarded_passengers/${flightID}`);
            setBoardedPassengers(response.data.passengers || []);
        } catch (err) {
            console.error("Error fetching boarded passengers:", err);
            setBoardError(err.response?.data?.message || "Failed to fetch boarded passengers.");
        }
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Passengers Boarding</h1>
            </header>

            <main className="home-main">
                <section className="card board-passengers-section">
                    <h2>Board Passengers</h2>
                    <form onSubmit={handleBoardPassengers} className="board-passengers-form">
                        <div className="form-group">
                            <label htmlFor="flightID">Flight ID *</label>
                            <input
                                type="text"
                                id="flightID"
                                name="flightID"
                                value={flightID}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {boardError && <p className="error-message">{boardError}</p>}
                        {boardSuccess && <p className="success-message">{boardSuccess}</p>}

                        <button type="submit" className="submit-button">Board Passengers</button>
                    </form>
                </section>

                
                <section className="card boarded-passengers-section">
                    <h2>Boarded Passengers</h2>
                    {boardedPassengers.length > 0 ? (
                        <ul className="passenger-list">
                            {boardedPassengers.map((passenger) => (
                                <li key={passenger.personID}>
                                    {passenger.first_name} {passenger.last_name} (ID: {passenger.personID})
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No passengers are currently boarded on this flight.</p>
                    )}
                </section>
            </main>
        </div>
    );
};

export default PassengersBoard;