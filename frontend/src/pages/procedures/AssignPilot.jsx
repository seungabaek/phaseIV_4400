// src/pages/procedures/AssignPilot.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './FormStyles.css'; // Assuming common form styles
// import '../Home.css'; // Uncomment if using home-container etc.

const API_URL = 'http://localhost:8800';

const AssignPilot = () => {
    // State for dropdown data
    const [pilots, setPilots] = useState([]);
    const [flights, setFlights] = useState([]);

    // State for selections
    const [selectedPilotId, setSelectedPilotId] = useState('');
    const [selectedFlightId, setSelectedFlightId] = useState(''); // Store the flightID or 'UNASSIGN'

    // State for loading and errors during fetch
    const [loadingPilots, setLoadingPilots] = useState(false);
    const [loadingFlights, setLoadingFlights] = useState(false);
    const [fetchPilotsError, setFetchPilotsError] = useState(null);
    const [fetchFlightsError, setFetchFlightsError] = useState(null);

    // State for assignment process
    const [assigning, setAssigning] = useState(false);
    const [assignError, setAssignError] = useState(null);
    const [assignSuccess, setAssignSuccess] = useState(null);

    // Fetch pilots
    const fetchPilots = useCallback(async () => {
        setLoadingPilots(true);
        setFetchPilotsError(null);
        try {
            const response = await axios.get(`${API_URL}/pilot`);
            setPilots(response.data);
        } catch (err) {
            console.error("Error fetching pilots:", err);
            setFetchPilotsError(err.response?.data?.message || "Failed to fetch pilots.");
        } finally {
            setLoadingPilots(false);
        }
    }, []);

    // Fetch flights
    const fetchFlights = useCallback(async () => {
        setLoadingFlights(true);
        setFetchFlightsError(null);
        try {
            const response = await axios.get(`${API_URL}/flight`);
            setFlights(response.data);
        } catch (err) {
            console.error("Error fetching flights:", err);
            setFetchFlightsError(err.response?.data?.message || "Failed to fetch flights.");
        } finally {
            setLoadingFlights(false);
        }
    }, []);

    // Fetch data on mount
    useEffect(() => {
        fetchPilots();
        fetchFlights();
    }, [fetchPilots, fetchFlights]); // Include fetch functions in dependency array


    // Handle assignment submission
    const handleAssignPilot = async (event) => {
        event.preventDefault();
        setAssignError(null);
        setAssignSuccess(null);

        if (!selectedPilotId) {
            setAssignError("Please select a pilot.");
            return;
        }
        // selectedFlightId can be empty string initially, or 'UNASSIGN' or a flight ID
        if (selectedFlightId === '') {
             setAssignError("Please select a flight to assign, or choose 'Unassign'.");
             return;
         }


        setAssigning(true);

        // Determine the flightId value to send to the backend
        // If user selected 'Unassign', send null. Otherwise, send the selected flight ID.
        const flightIdToSend = selectedFlightId === 'UNASSIGN' ? null : selectedFlightId;

        try {
            const response = await axios.put(
                `${API_URL}/pilot/${selectedPilotId}/assignFlight`,
                { flightId: flightIdToSend } // Send flightId in the request body
            );
            setAssignSuccess(response.data.message || "Assignment updated successfully!");
            setSelectedPilotId(''); // Optional: clear selections after success
            setSelectedFlightId('');
            // Refresh pilot list to show updated assignment status
            fetchPilots();

        } catch (err) {
            console.error("Error assigning pilot:", err);
            setAssignError(err.response?.data?.message || "Failed to update assignment.");
        } finally {
            setAssigning(false);
        }
    };

    return (
        <div className="home-container"> {/* Or your main container class */}
            <header className="home-header">
                <h1>Flight Tracking Dashboard - Assign Pilot</h1>
            </header>

            <main className="home-main">
                <section className="card assign-pilot-section">
                    <h2>Assign Pilot to Flight</h2>
                    <form onSubmit={handleAssignPilot} className="procedure-form">
                        {/* Pilot Selection Dropdown */}
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
                                        setAssignError(null); // Clear errors on change
                                        setAssignSuccess(null);
                                    }}
                                    required
                                >
                                    <option value="" disabled>-- Select a Pilot --</option>
                                    {pilots.map(pilot => (
                                        <option key={pilot.personID} value={pilot.personID}>
                                            {`${pilot.last_name || ''}, ${pilot.first_name} (${pilot.personID})`}{/* Display current assignment */}
                                            {pilot.commanding_flight ? ` [Cmd: ${pilot.commanding_flight}]` : ''}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Flight Selection Dropdown */}
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
                                        setAssignError(null); // Clear errors on change
                                        setAssignSuccess(null);
                                    }}
                                    required
                                >
                                     <option value="" disabled>-- Select Flight or Unassign --</option>
                                     {/* Add an explicit option to unassign */}
                                     <option value="UNASSIGN">-- Unassign Pilot --</option>
                                    {flights.map(flight => (
                                        <option key={flight.flightID} value={flight.flightID}>
                                            {`${flight.flightID} (Route: ${flight.routeID}, Status: ${flight.airplane_status || 'N/A'})`}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Feedback Messages */}
                        {assignError && <p className="error-message">{assignError}</p>}
                        {assignSuccess && <p className="success-message">{assignSuccess}</p>}

                        {/* Submit Button */}
                        <div className="form-actions">
                            <button type="submit" className="submit-button" disabled={assigning || loadingPilots || loadingFlights}>
                                {assigning ? 'Assigning...' : 'Assign Pilot'}
                            </button>
                        </div>
                    </form>
                </section>

                {/* Optional: You could add another section here to display current assignments clearly */}
                {/* <section className="card pilot-assignments-section">...</section> */}

            </main>
        </div>
    );
};

export default AssignPilot;