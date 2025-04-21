// src/pages/procedures/AddAirport.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './FormStyles.css'; // Make sure this CSS file exists and is styled
// import '../Home.css'; // Uncomment if you use styles from Home.css like home-container

const API_URL = 'http://localhost:8800';

const AddAirport = () => {
    // State for displaying existing airports
    const [airports, setAirports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // Error fetching airports

    // State for the add airport form - matching schema columns
    const [newAirport, setNewAirport] = useState({
        airportID: '',
        airport_name: '',
        city: '',
        state: '',
        country: '',
        locationID: '' // Optional
    });
    const [addError, setAddError] = useState(null); // Error adding airport
    const [addSuccess, setAddSuccess] = useState(null);

    // Function to fetch airports
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

    // Fetch airports when the component mounts
    useEffect(() => {
        fetchAirports();
    }, [fetchAirports]);

    // Handle form input changes
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        let processedValue = value;

        // Convert to uppercase for ID and Country fields as user types for immediate feedback
        if (name === 'airportID' || name === 'country') {
            processedValue = value.toUpperCase();
        }

        setNewAirport(prev => ({
            ...prev,
            // Enforce maxLength directly here for better UX
            [name]: (name === 'airportID' || name === 'country')
                     ? processedValue.slice(0, 3)
                     : processedValue
        }));
        // Clear messages when user starts typing again
        if (addError || addSuccess) {
            setAddError(null);
            setAddSuccess(null);
        }
    };

    // Handle form submission to add a new airport
    const handleAddAirport = async (event) => {
        event.preventDefault();
        setAddError(null);
        setAddSuccess(null);

        // Trim values before validation and sending
        const trimmedAirport = {
            airportID: newAirport.airportID.trim(),
            airport_name: newAirport.airport_name.trim(), // Trim name too
            city: newAirport.city.trim(),
            state: newAirport.state.trim(),
            country: newAirport.country.trim(),
            locationID: newAirport.locationID.trim() || null // Send null if only whitespace or empty
        };

        // Client-side validation based on schema
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
         // Optional: Add validation for locationID format if needed (e.g., starts with 'port_' or 'plane_')
         // if (trimmedAirport.locationID && !/^(port_|plane_)/.test(trimmedAirport.locationID)) {
         //      setAddError('Location ID should follow a valid format (e.g., port_XXX or plane_XXX).');
         //      return;
         // }


        try {
            // Data is already trimmed and locationID handled
            const response = await axios.post(`${API_URL}/airport`, trimmedAirport);
            setAddSuccess(response.data.message || "Airport added successfully!");
            setNewAirport({ // Clear the form
                airportID: '', airport_name: '', city: '', state: '', country: '', locationID: ''
            });
            fetchAirports(); // Refresh the list of airports
        } catch (err) {
            console.error("Error adding airport:", err);
            // Display error message from backend response if available
            setAddError(err.response?.data?.message || "Failed to add airport. Please check inputs and backend connection.");
        }
    };


    return (
        <div className="home-container"> {/* Or your main container class */}
            <header className="home-header"> {/* Optional: Keep header consistent */}
                <h1>Flight Tracking Dashboard - Airports</h1>
            </header>

            <main className="home-main"> {/* Or your main content area class */}
                {/* Section to Add New Airport */}
                <section className="card add-airport-section">
                    <h2>Add New Airport</h2>
                    <form onSubmit={handleAddAirport} className="procedure-form"> {/* Adjust class if needed */}
                        {/* Required Fields */}
                        <div className="form-group">
                             {/* Use maxLength based on schema CHAR(3) */}
                            <label htmlFor="airportID">Airport ID * (3 Chars)</label>
                            <input
                                type="text"
                                id="airportID"
                                name="airportID"
                                value={newAirport.airportID}
                                onChange={handleInputChange}
                                maxLength="3" // Enforce max length in input
                                required
                                placeholder="e.g., ATL"
                                style={{textTransform: 'uppercase'}} // Suggest uppercase visually
                             />
                        </div>
                        <div className="form-group">
                             {/* Use maxLength based on schema VARCHAR(200) */}
                            <label htmlFor="airport_name">Airport Name *</label>
                            <input
                                type="text"
                                id="airport_name"
                                name="airport_name"
                                value={newAirport.airport_name}
                                onChange={handleInputChange}
                                maxLength="200" // Optional: Set max length
                                required
                                placeholder="e.g., Hartsfield-Jackson Atlanta Intl"
                            />
                        </div>
                         <div className="form-group">
                            {/* Use maxLength based on schema VARCHAR(100) */}
                            <label htmlFor="city">City *</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={newAirport.city}
                                onChange={handleInputChange}
                                maxLength="100" // Optional: Set max length
                                required
                                placeholder="e.g., Atlanta"
                            />
                        </div>
                         <div className="form-group">
                             {/* Use maxLength based on schema VARCHAR(100) */}
                            <label htmlFor="state">State *</label>
                            <input
                                type="text"
                                id="state"
                                name="state"
                                value={newAirport.state}
                                onChange={handleInputChange}
                                maxLength="100" // Optional: Set max length
                                required
                                placeholder="e.g., Georgia"
                            />
                        </div>
                         <div className="form-group">
                             {/* Use maxLength based on schema CHAR(3) */}
                            <label htmlFor="country">Country * (3 Chars)</label>
                            <input
                                type="text"
                                id="country"
                                name="country"
                                value={newAirport.country}
                                onChange={handleInputChange}
                                maxLength="3" // Enforce max length in input
                                required
                                placeholder="e.g., USA"
                                style={{textTransform: 'uppercase'}} // Suggest uppercase visually
                            />
                        </div>
                         {/* Optional Field */}
                         <div className="form-group">
                             {/* Use maxLength based on schema VARCHAR(50) */}
                            <label htmlFor="locationID">Location ID</label>
                            <input
                                type="text"
                                id="locationID"
                                name="locationID"
                                value={newAirport.locationID}
                                onChange={handleInputChange}
                                maxLength="50" // Optional: Set max length
                                placeholder="e.g., port_1 (Optional)"
                             />
                        </div>

                        {/* Feedback Messages */}
                        {addError && <p className="error-message">{addError}</p>}
                        {addSuccess && <p className="success-message">{addSuccess}</p>}

                        {/* Form Actions */}
                        <div className="form-actions">
                            <button type="submit" className="submit-button">Add Airport</button>
                        </div>
                    </form>
                </section>

                {/* Section to Display Existing Airports */}
                <section className="card airport-list-section">
                    <h2>Existing Airports</h2>
                    {loading && <p>Loading airports...</p>}
                    {error && <p className="error-message">{error}</p>}
                    {!loading && !error && (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        {/* Match headers to schema columns */}
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
                                            // Use airportID as key (it's the primary key)
                                            <tr key={airport.airportID}>
                                                <td>{airport.airportID}</td>
                                                <td>{airport.airport_name}</td>
                                                <td>{airport.city}</td>
                                                <td>{airport.state}</td>
                                                <td>{airport.country}</td>
                                                {/* Display 'N/A' or similar if locationID is null/empty */}
                                                <td>{airport.locationID || 'N/A'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            {/* Adjust colSpan to match number of columns (6) */}
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