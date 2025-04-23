import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './FormStyles.css'; 

const API_URL = 'http://localhost:8800';

const AddAirport = () => {
    const [airports, setAirports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); 
    const [newAirport, setNewAirport] = useState({
        airportID: '',
        airport_name: '',
        city: '',
        state: '',
        country: '',
        locationID: '' 
    });
    const [addError, setAddError] = useState(null); 
    const [addSuccess, setAddSuccess] = useState(null);

    const fetchAirports = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/airport`);
            setAirports(response.data);
        } catch (err) {
            console.error("Error fetching airports:", err);
            setError(err.response?.data?.message || "Failed to fetch airports. Is the backend running?");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAirports();
    }, [fetchAirports]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        let processedValue = value;

        if (name === 'airportID' || name === 'country') {
            processedValue = value.toUpperCase();
        }

        setNewAirport(prev => ({
            ...prev,
            [name]: (name === 'airportID' || name === 'country')
                     ? processedValue.slice(0, 3)
                     : processedValue
        }));
        if (addError || addSuccess) {
            setAddError(null);
            setAddSuccess(null);
        }
    };

    const handleAddAirport = async (event) => {
        event.preventDefault();
        setAddError(null);
        setAddSuccess(null);

        const trimmedAirport = {
            airportID: newAirport.airportID.trim(),
            airport_name: newAirport.airport_name.trim(),
            city: newAirport.city.trim(),
            state: newAirport.state.trim(),
            country: newAirport.country.trim(),
            locationID: newAirport.locationID.trim() || null 
        };

        if (!trimmedAirport.airportID || !trimmedAirport.airport_name || !trimmedAirport.city || !trimmedAirport.state || !trimmedAirport.country) {
             setAddError('Please fill in all required fields (Airport ID, Name, City, State, Country).');
             return;
         }
         if (trimmedAirport.airportID.length !== 3) {
              setAddError('Airport ID must be exactly 3 characters.');
              return;
         }
         if (trimmedAirport.country.length !== 3) {
              setAddError('Country code must be exactly 3 characters.');
              return;
         }
 

        try {
            const response = await axios.post(`${API_URL}/airport`, trimmedAirport);
            setAddSuccess(response.data.message || "Airport added successfully!");
            setNewAirport({ 
                airportID: '', airport_name: '', city: '', state: '', country: '', locationID: ''
            });
            fetchAirports(); 
        } catch (err) {
            console.error("Error adding airport:", err);
            setAddError(err.response?.data?.message || "Failed to add airport. Please check inputs and backend connection.");
        }
    };


    return (
        <div className="home-container"> {}
            <header className="home-header"> {}
                <h1>Flight Tracking Dashboard - Airports</h1>
            </header>

            <main className="home-main"> {}
                {}
                <section className="card add-airport-section">
                    <h2>Add New Airport</h2>
                    <form onSubmit={handleAddAirport} className="procedure-form"> {}
                        {}
                        <div className="form-group">
                             {}
                            <label htmlFor="airportID">Airport ID * (3 Chars)</label>
                            <input
                                type="text"
                                id="airportID"
                                name="airportID"
                                value={newAirport.airportID}
                                onChange={handleInputChange}
                                maxLength="3"
                                required
                                placeholder="e.g., ATL"
                                style={{textTransform: 'uppercase'}} 
                             />
                        </div>
                        <div className="form-group">
                             {}
                            <label htmlFor="airport_name">Airport Name *</label>
                            <input
                                type="text"
                                id="airport_name"
                                name="airport_name"
                                value={newAirport.airport_name}
                                onChange={handleInputChange}
                                maxLength="200"
                                required
                                placeholder="e.g., Hartsfield-Jackson Atlanta Intl"
                            />
                        </div>
                         <div className="form-group">
                            {}
                            <label htmlFor="city">City *</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={newAirport.city}
                                onChange={handleInputChange}
                                maxLength="100"
                                required
                                placeholder="e.g., Atlanta"
                            />
                        </div>
                         <div className="form-group">
                             {}
                            <label htmlFor="state">State *</label>
                            <input
                                type="text"
                                id="state"
                                name="state"
                                value={newAirport.state}
                                onChange={handleInputChange}
                                maxLength="100"
                                required
                                placeholder="e.g., Georgia"
                            />
                        </div>
                         <div className="form-group">
                             {}
                            <label htmlFor="country">Country * (3 Chars)</label>
                            <input
                                type="text"
                                id="country"
                                name="country"
                                value={newAirport.country}
                                onChange={handleInputChange}
                                maxLength="3"
                                required
                                placeholder="e.g., USA"
                                style={{textTransform: 'uppercase'}} 
                            />
                        </div>
                         {}
                         <div className="form-group">
                             {}
                            <label htmlFor="locationID">Location ID</label>
                            <input
                                type="text"
                                id="locationID"
                                name="locationID"
                                value={newAirport.locationID}
                                onChange={handleInputChange}
                                maxLength="50" 
                                placeholder="e.g., port_1 (Optional)"
                             />
                        </div>

                        {}
                        {addError && <p className="error-message">{addError}</p>}
                        {addSuccess && <p className="success-message">{addSuccess}</p>}

                        {}
                        <div className="form-actions">
                            <button type="submit" className="submit-button">Add Airport</button>
                        </div>
                    </form>
                </section>

                {}
                <section className="card airport-list-section">
                    <h2>Existing Airports</h2>
                    {loading && <p>Loading airports...</p>}
                    {error && <p className="error-message">{error}</p>}
                    {!loading && !error && (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        {}
                                        <th>Airport ID</th>
                                        <th>Name</th>
                                        <th>City</th>
                                        <th>State</th>
                                        <th>Country</th>
                                        <th>Location ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {airports.length > 0 ? (
                                        airports.map((airport) => (
                                            <tr key={airport.airportID}>
                                                <td>{airport.airportID}</td>
                                                <td>{airport.airport_name}</td>
                                                <td>{airport.city}</td>
                                                <td>{airport.state}</td>
                                                <td>{airport.country}</td>
                                                {}
                                                <td>{airport.locationID || 'N/A'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            {}
                                            <td colSpan="6">No airports found in the database.</td>
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

export default AddAirport;