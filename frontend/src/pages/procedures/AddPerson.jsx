// src/pages/procedures/AddPerson.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './FormStyles.css'; // Assuming you have common form styles
// import '../Home.css'; // Uncomment if you use styles from Home.css like home-container

const API_URL = 'http://localhost:8800';

const AddPerson = () => {
    // State for displaying existing persons
    const [persons, setPersons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // Error fetching persons

    // State for the add person form - matching schema columns
    const [newPerson, setNewPerson] = useState({
        personID: '',
        first_name: '',
        last_name: '', // Optional
        locationID: ''
    });
    const [addError, setAddError] = useState(null); // Error adding person
    const [addSuccess, setAddSuccess] = useState(null);

    // Function to fetch persons
    const fetchPersons = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/person`);
            setPersons(response.data);
        } catch (err) {
            console.error("Error fetching persons:", err);
            setError(err.response?.data?.message || "Failed to fetch persons. Is the backend running?");
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch persons when the component mounts
    useEffect(() => {
        fetchPersons();
    }, [fetchPersons]);

    // Handle form input changes
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewPerson(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear messages when user starts typing again
        if (addError || addSuccess) {
            setAddError(null);
            setAddSuccess(null);
        }
    };

    // Handle form submission to add a new person
    const handleAddPerson = async (event) => {
        event.preventDefault();
        setAddError(null);
        setAddSuccess(null);

        // Trim values before validation and sending
        const trimmedPerson = {
            personID: newPerson.personID.trim(),
            first_name: newPerson.first_name.trim(),
            last_name: newPerson.last_name.trim() || null, // Send null if empty or only whitespace
            locationID: newPerson.locationID.trim()
        };

        // Client-side validation based on schema (NOT NULL constraints)
        if (!trimmedPerson.personID || !trimmedPerson.first_name || !trimmedPerson.locationID) {
             setAddError('Please fill in all required fields (Person ID, First Name, Location ID).');
             return;
         }
         // Optional: Add more specific validation if needed (e.g., locationID format)


        try {
            const response = await axios.post(`${API_URL}/person`, trimmedPerson);
            setAddSuccess(response.data.message || "Person added successfully!");
            setNewPerson({ // Clear the form
                personID: '', first_name: '', last_name: '', locationID: ''
            });
            fetchPersons(); // Refresh the list of persons
        } catch (err) {
            console.error("Error adding person:", err);
            // Display error message from backend response if available
            setAddError(err.response?.data?.message || "Failed to add person. Please check inputs and backend connection.");
        }
    };


    return (
        <div className="home-container"> {/* Or your main container class */}
            <header className="home-header"> {/* Optional: Keep header consistent */}
                <h1>Flight Tracking Dashboard - Persons</h1>
            </header>

            <main className="home-main"> {/* Or your main content area class */}
                {/* Section to Add New Person */}
                <section className="card add-person-section">
                    <h2>Add New Person</h2>
                    <form onSubmit={handleAddPerson} className="procedure-form"> {/* Adjust class if needed */}
                        {/* Required Fields */}
                        <div className="form-group">
                             {/* MaxLength from schema VARCHAR(50) */}
                            <label htmlFor="personID">Person ID *</label>
                            <input
                                type="text"
                                id="personID"
                                name="personID"
                                value={newPerson.personID}
                                onChange={handleInputChange}
                                maxLength="50"
                                required
                                placeholder="e.g., p57"
                             />
                        </div>
                        <div className="form-group">
                             {/* MaxLength from schema VARCHAR(100) */}
                            <label htmlFor="first_name">First Name *</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={newPerson.first_name}
                                onChange={handleInputChange}
                                maxLength="100"
                                required
                                placeholder="e.g., John"
                            />
                        </div>
                        {/* Optional Field */}
                        <div className="form-group">
                            {/* MaxLength from schema VARCHAR(100) */}
                            <label htmlFor="last_name">Last Name</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={newPerson.last_name}
                                onChange={handleInputChange}
                                maxLength="100"
                                placeholder="e.g., Doe (Optional)"
                            />
                        </div>
                         {/* Required Field */}
                         <div className="form-group">
                             {/* MaxLength from schema VARCHAR(50) */}
                            <label htmlFor="locationID">Location ID *</label>
                            <input
                                type="text"
                                id="locationID"
                                name="locationID"
                                value={newPerson.locationID}
                                onChange={handleInputChange}
                                maxLength="50"
                                required
                                placeholder="e.g., port_1 or plane_5"
                            />
                        </div>

                        {/* Feedback Messages */}
                        {addError && <p className="error-message">{addError}</p>}
                        {addSuccess && <p className="success-message">{addSuccess}</p>}

                        {/* Form Actions */}
                        <div className="form-actions">
                            <button type="submit" className="submit-button">Add Person</button>
                        </div>
                    </form>
                </section>

                {/* Section to Display Existing Persons */}
                <section className="card person-list-section">
                    <h2>Existing Persons</h2>
                    {loading && <p>Loading persons...</p>}
                    {error && <p className="error-message">{error}</p>}
                    {!loading && !error && (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        {/* Match headers to schema columns */}
                                        <th>Person ID</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Location ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {persons.length > 0 ? (
                                        persons.map((person) => (
                                            // Use personID as key (it's the primary key)
                                            <tr key={person.personID}>
                                                <td>{person.personID}</td>
                                                <td>{person.first_name}</td>
                                                {/* Display 'N/A' or empty if last_name is null/empty */}
                                                <td>{person.last_name || 'N/A'}</td>
                                                <td>{person.locationID}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            {/* Adjust colSpan to match number of columns (4) */}
                                            <td colSpan="4">No persons found in the database.</td>
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

export default AddPerson;