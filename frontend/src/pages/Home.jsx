import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // for http requests to external APIs
import './Home.css'; // css file

// url for backend
const API_URL = 'http://localhost:8800'; // validate backend actually running on port 8800

const Home = () => {
    const [airplanes, setAirplanes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // add airplane form
    const [newAirplane, setNewAirplane] = useState({
        airlineID: '',
        tail_num: '',
        seat_capacity: '',
        speed: '',
        locationID: '', 
        plane_type: '', 
        maintenanced: false, 
        model: '', 
        neo: false 
    });
    const [addError, setAddError] = useState(null);
    const [addSuccess, setAddSuccess] = useState(null);

    // get airplanes
    const fetchAirplanes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // need cors
            const response = await axios.get(`${API_URL}/airplane`);
            setAirplanes(response.data);
        } catch (err) {
            console.error("Error fetching airplanes:", err);
            setError(err.response?.data?.message || "Failed to fetch airplanes. Is the backend running and CORS enabled?");
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch airplanes when the component mounts
    useEffect(() => {
        fetchAirplanes();
    }, [fetchAirplanes]); // Include fetchAirplanes in dependency array

    // form input changes
    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setNewAirplane(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // form submission
    const handleAddAirplane = async (event) => {
        event.preventDefault(); // Prevent default page reload
        setAddError(null);
        setAddSuccess(null);

        // Basic Validation (add more as needed)
        if (!newAirplane.airlineID || !newAirplane.tail_num || !newAirplane.seat_capacity || !newAirplane.speed) {
            setAddError("Please fill in all required fields (Airline ID, Tail Number, Seat Capacity, Speed).");
            return;
        }

        // Convert numeric fields
        const airplaneData = {
            ...newAirplane,
            seat_capacity: parseInt(newAirplane.seat_capacity, 10),
            speed: parseInt(newAirplane.speed, 10),
            // Ensure boolean values are sent correctly if needed
            maintenanced: Boolean(newAirplane.maintenanced),
            neo: Boolean(newAirplane.neo),
            // Handle potentially empty optional fields (send null or omit)
            locationID: newAirplane.locationID || null,
            plane_type: newAirplane.plane_type || null,
            model: newAirplane.model || null,
        };

        try {
            // IMPORTANT: You need to create this POST endpoint in your backend
            const response = await axios.post(`${API_URL}/airplane`, airplaneData);
            setAddSuccess("Airplane added successfully!");
            setNewAirplane({ // Clear the form
                airlineID: '', tail_num: '', seat_capacity: '', speed: '',
                locationID: '', plane_type: '', maintenanced: false, model: '', neo: false
            });
            fetchAirplanes(); // Refresh the list
        } catch (err) {
            console.error("Error adding airplane:", err);
            setAddError(err.response?.data?.message || "Failed to add airplane.");
        }
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Flight Tracking Dashboard</h1>
            </header>

            <main className="home-main">
                {/* Section to Add New Airplane */}
                <section className="card add-airplane-section">
                    <h2>Add New Airplane</h2>
                    <form onSubmit={handleAddAirplane} className="add-airplane-form">
                        {/* Required Fields */}
                        <div className="form-group">
                            <label htmlFor="airlineID">Airline ID *</label>
                            <input type="text" id="airlineID" name="airlineID" value={newAirplane.airlineID} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="tail_num">Tail Number *</label>
                            <input type="text" id="tail_num" name="tail_num" value={newAirplane.tail_num} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="seat_capacity">Seat Capacity *</label>
                            <input type="number" id="seat_capacity" name="seat_capacity" value={newAirplane.seat_capacity} onChange={handleInputChange} min="1" required />
                        </div>
                         <div className="form-group">
                            <label htmlFor="speed">Speed *</label>
                            <input type="number" id="speed" name="speed" value={newAirplane.speed} onChange={handleInputChange} min="1" required />
                        </div>

                        {/* Optional Fields */}
                        <div className="form-group">
                            <label htmlFor="locationID">Location ID</label>
                            <input type="text" id="locationID" name="locationID" value={newAirplane.locationID} onChange={handleInputChange} />
                        </div>
                         <div className="form-group">
                            <label htmlFor="plane_type">Plane Type</label>
                            <input type="text" id="plane_type" name="plane_type" value={newAirplane.plane_type} onChange={handleInputChange} />
                        </div>
                         <div className="form-group">
                            <label htmlFor="model">Model</label>
                            <input type="text" id="model" name="model" value={newAirplane.model} onChange={handleInputChange} />
                        </div>
                         <div className="form-group form-group-checkbox">
                            <label htmlFor="maintenanced">Maintenanced?</label>
                            <input type="checkbox" id="maintenanced" name="maintenanced" checked={newAirplane.maintenanced} onChange={handleInputChange} />
                        </div>
                         <div className="form-group form-group-checkbox">
                            <label htmlFor="neo">Neo?</label>
                            <input type="checkbox" id="neo" name="neo" checked={newAirplane.neo} onChange={handleInputChange} />
                        </div>

                        {addError && <p className="error-message">{addError}</p>}
                        {addSuccess && <p className="success-message">{addSuccess}</p>}

                        <button type="submit" className="submit-button">Add Airplane</button>
                    </form>
                </section>

                {/* Section to Display Airplanes */}
                <section className="card airplane-list-section">
                    <h2>Airplane Fleet</h2>
                    {loading && <p>Loading airplanes...</p>}
                    {error && <p className="error-message">{error}</p>}
                    {!loading && !error && (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Airline ID</th>
                                        <th>Tail Number</th>
                                        <th>Capacity</th>
                                        <th>Speed</th>
                                        <th>Location</th>
                                        <th>Type</th>
                                        <th>Model</th>
                                        <th>Maintenanced</th>
                                        <th>Neo</th>
                                        {/* Add more headers if needed */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {airplanes.length > 0 ? (
                                        airplanes.map((plane) => (
                                            <tr key={`${plane.airlineID}-${plane.tail_num}`}>
                                                <td>{plane.airlineID}</td>
                                                <td>{plane.tail_num}</td>
                                                <td>{plane.seat_capacity}</td>
                                                <td>{plane.speed}</td>
                                                <td>{plane.locationID || 'N/A'}</td>
                                                <td>{plane.plane_type || 'N/A'}</td>
                                                <td>{plane.model || 'N/A'}</td>
                                                {/* Display boolean values nicely */}
                                                <td>{plane.maintenanced ? 'Yes' : 'No'}</td>
                                                <td>{plane.neo ? 'Yes' : 'No'}</td>
                                                {/* Add more cells if needed */}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9">No airplanes found.</td>
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

export default Home;