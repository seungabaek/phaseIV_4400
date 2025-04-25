import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './FormStyles.css';

const API_URL = 'http://localhost:8800';

const AssignPilot = () => {
    const [pilots, setPilots] = useState([]);
    const [flights, setFlights] = useState([]);

    const [selectedPilotId, setSelectedPilotId] = useState('');
    const [selectedFlightId, setSelectedFlightId] = useState('');

    const [loadingPilots, setLoadingPilots] = useState(false);
    const [loadingFlights, setLoadingFlights] = useState(false);
    const [fetchPilotsError, setFetchPilotsError] = useState(null);
    const [fetchFlightsError, setFetchFlightsError] = useState(null);

    const [assigning, setAssigning] = useState(false);
    const [assignError, setAssignError] = useState(null);
    const [assignSuccess, setAssignSuccess] = useState(null);

    const fetchPilots = useCallback(async () => {
        setLoadingPilots(true);
        setFetchPilotsError(null);
        try {
            const response = await axios.get(`${API_URL}/pilot`);
            setPilots(response.data);
        } catch (err) {
            setFetchPilotsError(err.response?.data?.message || "Failed to fetch pilots.");
        } finally {
            setLoadingPilots(false);
        }
    }, []);

    const fetchFlights = useCallback(async () => {
        setLoadingFlights(true);
        setFetchFlightsError(null);
        try {
            const response = await axios.get(`${API_URL}/flight`);
            setFlights(response.data);
        } catch (err) {
            setFetchFlightsError(err.response?.data?.message || "Failed to fetch flights.");
        } finally {
            setLoadingFlights(false);
        }
    }, []);

    useEffect(() => {
        fetchPilots();
        fetchFlights();
    }, [fetchPilots, fetchFlights]);

    const handleAssignPilot = async (event) => {
        event.preventDefault();
        setAssignError(null);
        setAssignSuccess(null);

        if (!selectedPilotId) {
            setAssignError("Please select a pilot.");
            return;
        }
        if (selectedFlightId === '') {
            setAssignError("Please select a flight to assign, or choose 'Unassign'.");
            return;
        }

        setAssigning(true);
        const flightIdToSend = selectedFlightId === 'UNASSIGN' ? null : selectedFlightId;

        try {
            const response = await axios.put(
                `${API_URL}/pilot/${selectedPilotId}/assignFlight`,
                { flightId: flightIdToSend }
            );
            setAssignSuccess(response.data.message || "Assignment updated successfully!");
            setSelectedPilotId('');
            setSelectedFlightId('');
            fetchPilots();
        } catch (err) {
            setAssignError(err.response?.data?.message || "Failed to update assignment.");
        } finally {
            setAssigning(false);
        }
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Flight Tracking Dashboard - Assign Pilot</h1>
            </header>

            <main className="home-main">
                <section className="card assign-pilot-section">
                    <h2>Assign Pilot to Flight</h2>
                    <form onSubmit={handleAssignPilot} className="procedure-form">
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
                                        setAssignError(null);
                                        setAssignSuccess(null);
                                    }}
                                    required
                                >
                                    <option value="" disabled>-- Select a Pilot --</option>
                                    {pilots.map(pilot => (
                                        <option key={pilot.personID} value={pilot.personID}>
                                            {`${pilot.last_name || ''}, ${pilot.first_name} (${pilot.personID})`}
                                            {pilot.commanding_flight ? ` [Cmd: ${pilot.commanding_flight}]` : ''}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="flightSelect">Select Flight to Assign *</label>
                            {loadingFlights && <p>Loading flights...</p>}
                            {fetchFlightsError && <p className="error-message">{fetchFlightsError}</p>}
                            {!loadingFlights && !fetchFlightsError && (
                                <select
                                    id="flightSelect"
                                    name="selectedFlightId"
                                    value={selectedFlightId}
                                    onChange={(e) => {
                                        setSelectedFlightId(e.target.value);
                                        setAssignError(null);
                                        setAssignSuccess(null);
                                    }}
                                    required
                                >
                                    <option value="" disabled>-- Select Flight or Unassign --</option>
                                    <option value="UNASSIGN">-- Unassign Pilot --</option>
                                    {flights.map(flight => (
                                        <option key={flight.flightID} value={flight.flightID}>
                                            {`${flight.flightID} (Route: ${flight.routeID}, Status: ${flight.airplane_status || 'N/A'})`}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {assignError && <p className="error-message">{assignError}</p>}
                        {assignSuccess && <p className="success-message">{assignSuccess}</p>}

                        <div className="form-actions">
                            <button type="submit" className="submit-button" disabled={assigning || loadingPilots || loadingFlights}>
                                {assigning ? 'Assigning...' : 'Assign Pilot'}
                            </button>
                        </div>
                    </form>
                </section>

                <section className="card airplane-list-section">
                    <h2>Current Flights</h2>
                    {loadingFlights ? <p>Loading flights...</p> : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Flight ID</th>
                                        <th>Route ID</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {flights.map((f) => (
                                        <tr key={f.flightID}>
                                            <td>{f.flightID}</td>
                                            <td>{f.routeID}</td>
                                            <td>{f.airplane_status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default AssignPilot;
