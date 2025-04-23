import React, { useState } from 'react';
import axios from 'axios';
import './FormStyles.css';

const API_URL = 'http://localhost:8800';

const PassengersDisembark = () => {
    const [flightID, setFlightID] = useState(''); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);


    const handleInputChange = (event) => {
        setFlightID(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        if (!flightID) {
            setError("Flight ID is required.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/passengers_disembark`, { flightID });
            setSuccess(response.data.message || "Passengers disembarked successfully!");
        } catch (err) {
            console.error("Error disembarking passengers:", err);
            setError(err.response?.data?.message || "Failed to disembark passengers.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Passengers Disembark</h1>
            </header>

            <main className="home-main">

                <section className="card add-airplane-section">
                    <h2>Disembark Passengers</h2>
                    <form onSubmit={handleSubmit} className="add-airplane-form">
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

                        {error && <p className="error-message">{error}</p>}
                        {success && <p className="success-message">{success}</p>}
                        {loading && <p>Processing...</p>}

                        <button type="submit" className="submit-button" disabled={loading}>
                            Disembark Passengers
                        </button>
                    </form>
                </section>
            </main>
        </div>
    );
};

export default PassengersDisembark;