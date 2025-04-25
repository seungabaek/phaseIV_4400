import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './FormStyles.css';

const API_URL = 'http://localhost:8800';

const AddPerson = () => {
    const [persons, setPersons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newPerson, setNewPerson] = useState({
        personID: '',
        first_name: '',
        last_name: '',
        locationID: ''
    });
    const [addError, setAddError] = useState(null);
    const [addSuccess, setAddSuccess] = useState(null);

    const fetchPersons = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/person`);
            setPersons(response.data);
        } catch (err) {
            console.error("Error getting people:", err);
            setError(err.response?.data?.message || "Failed to get people. Check Backend");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPersons();
    }, [fetchPersons]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewPerson(prev => ({
            ...prev,
            [name]: value
        }));
        if (addError || addSuccess) {
            setAddError(null);
            setAddSuccess(null);
        }
    };

    const handleAddPerson = async (event) => {
        event.preventDefault();
        setAddError(null);
        setAddSuccess(null);

        const trimmedPerson = {
            personID: newPerson.personID.trim(),
            first_name: newPerson.first_name.trim(),
            last_name: newPerson.last_name.trim() || null,
            locationID: newPerson.locationID.trim()
        };

        if (!trimmedPerson.personID || !trimmedPerson.first_name || !trimmedPerson.locationID) {
            setAddError('Please fill in all required fields.');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/person`, trimmedPerson);
            setAddSuccess(response.data.message || "Person added!");
            setNewPerson({
                personID: '', first_name: '', last_name: '', locationID: ''
            });
            fetchPersons();
        } catch (err) {
            console.error("Error adding:", err);
            setAddError(err.response?.data?.message || "Failed to add. Please check inputs and make sure backend is connected.");
        }
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Flight Tracking Dashboard - Persons</h1>
            </header>

            <main className="home-main">
                <section className="card add-person-section">
                    <h2>Add New Person</h2>
                    <form onSubmit={handleAddPerson} className="procedure-form">
                        <div className="form-group">
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
                        <div className="form-group">
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
                        <div className="form-group">
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

                        {addError && <p className="error-message">{addError}</p>}
                        {addSuccess && <p className="success-message">{addSuccess}</p>}

                        <div className="form-actions">
                            <button type="submit" className="submit-button">Add Person</button>
                        </div>
                    </form>
                </section>

                <section className="card person-list-section">
                    <h2>Existing Persons</h2>
                    {loading && <p>Loading persons...</p>}
                    {error && <p className="error-message">{error}</p>}
                    {!loading && !error && (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Person ID</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Location ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {persons.length > 0 ? (
                                        persons.map((person) => (
                                            <tr key={person.personID}>
                                                <td>{person.personID}</td>
                                                <td>{person.first_name}</td>
                                                <td>{person.last_name || 'N/A'}</td>
                                                <td>{person.locationID}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4">No persons found in database.</td>
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
