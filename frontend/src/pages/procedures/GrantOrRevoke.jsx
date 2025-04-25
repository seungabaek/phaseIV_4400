import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './FormStyles.css'; 
const API_URL = 'http://localhost:8800';

const AVAILABLE_LICENSE_TYPES = ['Airbus', 'Boeing', 'general'];

const GrantRevokeLicense = () => {
    const [pilots, setPilots] = useState([]);
    const [selectedPilotId, setSelectedPilotId] = useState('');
    const [selectedLicenseType, setSelectedLicenseType] = useState('');
    const [currentLicenses, setCurrentLicenses] = useState([]);
    const [loadingLicenses, setLoadingLicenses] = useState(false);
    const [fetchLicensesError, setFetchLicensesError] = useState(null);
    const [loadingPilots, setLoadingPilots] = useState(false);
    const [fetchPilotsError, setFetchPilotsError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [processError, setProcessError] = useState(null);
    const [processSuccess, setProcessSuccess] = useState(null);

    const fetchPilots = useCallback(async () => {
        setLoadingPilots(true);
        setFetchPilotsError(null);
        try {
            const response = await axios.get(`${API_URL}/pilot`);
            setPilots(response.data || []);
        } catch (err) {
            console.error("Error fetching pilots:", err);
            setFetchPilotsError(err.response?.data?.message || "Failed to fetch pilots.");
        } finally {
            setLoadingPilots(false);
        }
    }, []);

    const fetchCurrentLicenses = useCallback(async (pilotId) => {
        if (!pilotId) {
            setCurrentLicenses([]);
            setFetchLicensesError(null);
            return;
        }
        setLoadingLicenses(true);
        setFetchLicensesError(null);
        try {
            const response = await axios.get(`${API_URL}/pilot/${pilotId}/licenses`);
            setCurrentLicenses(response.data || []);
        } catch (err) {
            console.error("Error fetching licenses:", err);
            setCurrentLicenses([]);
            setFetchLicensesError(err.response?.data?.message || `Failed to fetch licenses for pilot ${pilotId}.`);
        } finally {
            setLoadingLicenses(false);
        }
    }, []);

    useEffect(() => {
        fetchPilots();
    }, [fetchPilots]);

    useEffect(() => {
        fetchCurrentLicenses(selectedPilotId);
    }, [selectedPilotId, fetchCurrentLicenses]);

    const handleGrantRevoke = async (event) => {
        event.preventDefault();
        setProcessError(null);
        setProcessSuccess(null);

        if (!selectedPilotId || !selectedLicenseType) {
            setProcessError("Please select both a pilot and a license type.");
            return;
        }

        setProcessing(true);

        try {
            const response = await axios.post(
                `${API_URL}/pilot/${selectedPilotId}/toggleLicense`,
                { license: selectedLicenseType }
            );
            setProcessSuccess(response.data.message || "License status updated successfully!");
            fetchCurrentLicenses(selectedPilotId);
        } catch (err) {
            console.error("Error updating license:", err);
            setProcessError(err.response?.data?.message || "Failed to update license status.");
        } finally {
            setProcessing(false);
        }
    };

    const renderCurrentLicenses = () => {
        if (loadingLicenses) return <p>Loading licenses...</p>;
        if (fetchLicensesError) return <p className="error-message">{fetchLicensesError}</p>;
        if (!selectedPilotId) return <p>Select a pilot to view their licenses.</p>;
        if (currentLicenses.length === 0) return <p>This pilot currently holds no licenses.</p>;
        return (
            <ul>
                {currentLicenses.map(lic => <li key={lic}>{lic}</li>)}
            </ul>
        );
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Flight Tracking Dashboard - Grant/Revoke Pilot License</h1>
            </header>

            <main className="home-main grant-revoke-layout">
                <section className="card grant-revoke-form-section">
                    <h2>Select Pilot and License</h2>
                    <form onSubmit={handleGrantRevoke} className="procedure-form">
                        <div className="form-group">
                            <label htmlFor="pilotSelect">Select Pilot *</label>
                            {loadingPilots && <p>Loading pilots...</p>}
                            {fetchPilotsError && <p className="error-message">{fetchPilotsError}</p>}
                            {!loadingPilots && !fetchPilotsError && (
                                <select
                                    id="pilotSelect"
                                    name="selectedPilotId"
                                    value={selectedPilotId}
                                    onChange={(e) => {
                                        setSelectedPilotId(e.target.value);
                                        setProcessError(null);
                                        setProcessSuccess(null);
                                        setSelectedLicenseType('');
                                    }}
                                    required
                                >
                                    <option value="" disabled>-- Select a Pilot --</option>
                                    {pilots.map(pilot => (
                                        <option key={pilot.personID} value={pilot.personID}>
                                            {`${pilot.last_name || ''}, ${pilot.first_name} (${pilot.personID})`}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="licenseSelect">Select License Type *</label>
                            <select
                                id="licenseSelect"
                                name="selectedLicenseType"
                                value={selectedLicenseType}
                                onChange={(e) => {
                                    setSelectedLicenseType(e.target.value);
                                    setProcessError(null);
                                    setProcessSuccess(null);
                                }}
                                disabled={!selectedPilotId}
                                required
                            >
                                <option value="" disabled>-- Select License --</option>
                                {AVAILABLE_LICENSE_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        {processError && <p className="error-message">{processError}</p>}
                        {processSuccess && <p className="success-message">{processSuccess}</p>}

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="submit-button"
                                disabled={processing || loadingPilots || !selectedPilotId || !selectedLicenseType}
                            >
                                {processing ? 'Processing...' : 'Grant / Revoke Selected License'}
                            </button>
                        </div>

                        <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#555' }}>
                            Note: This action will ADD the license if the pilot doesn't have it,
                            and REMOVE it if they do.
                        </p>
                    </form>
                </section>

                <section className="card current-licenses-section">
                    <h2>Current Licenses for Selected Pilot</h2>
                    {renderCurrentLicenses()}
                </section>
            </main>
        </div>
    );
};

export default GrantRevokeLicense;
