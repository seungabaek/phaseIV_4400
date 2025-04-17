import React, { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8800'; // Ensure backend is running on port 8800

const PilotLicense = () => {
    const [licenses, setLicenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        personID: '',
        license: ''
    });
    const [actionError, setActionError] = useState(null);
    const [actionSuccess, setActionSuccess] = useState(null);

    // Fetch licenses
    const fetchLicenses = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/pilot_licenses`);
            setLicenses(response.data);
        } catch (err) {
            console.error("Error fetching licenses:", err);
            setError(err.response?.data?.message || "Failed to fetch licenses.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Handle input changes
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle add/revoke license
    const handleAddRevokeLicense = async (event) => {
        event.preventDefault();
        setActionError(null);
        setActionSuccess(null);

        if (!formData.personID || !formData.license) {
            setActionError("Please fill in both Person ID and License.");
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/pilot_licenses`, formData);
            setActionSuccess(response.data.message || "Action completed successfully!");
            setFormData({ personID: '', license: '' }); // Clear the form
            fetchLicenses(); // Refresh the list
        } catch (err) {
            console.error("Error performing action:", err);
            setActionError(err.response?.data?.message || "Failed to perform action.");
        }
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Pilot License Management</h1>
            </header>

            <main className="home-main">
                {/* Section to Add/Revoke License */}
                <section className="card license-section">
                    <h2>Grant or Revoke License</h2>
                    <form onSubmit={handleAddRevokeLicense} className="license-form">
                        <div className="form-group">
                            <label htmlFor="personID">Person ID *</label>
                            <input
                                type="text"
                                id="personID"
                                name="personID"
                                value={formData.personID}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="license">License *</label>
                            <input
                                type="text"
                                id="license"
                                name="license"
                                value={formData.license}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {actionError && <p className="error-message">{actionError}</p>}
                        {actionSuccess && <p className="success-message">{actionSuccess}</p>}

                        <button type="submit" className="submit-button">Add/Revoke</button>
                    </form>
                </section>

                {/* Section to Display Licenses */}
                <section className="card license-list-section">
                    <h2>License Records</h2>
                    {loading && <p>Loading licenses...</p>}
                    {error && <p className="error-message">{error}</p>}
                    {!loading && !error && (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Person ID</th>
                                        <th>License</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {licenses.length > 0 ? (
                                        licenses.map((license) => (
                                            <tr key={`${license.personID}-${license.license}`}>
                                                <td>{license.personID}</td>
                                                <td>{license.license}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2">No licenses found.</td>
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

export default PilotLicense;