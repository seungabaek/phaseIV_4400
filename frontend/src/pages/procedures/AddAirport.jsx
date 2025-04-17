// src/pages/procedures/AddAirport.jsx
import React, { useState } from 'react';
import { callProcedure } from '../../api'; // Import the API helper
import './FormStyles.css'; 

const AddAirport = () => {
    const [formData, setFormData] = useState({
        airportID: '',
        airport_name: '',
        city: '',
        state: '',
        country: '',
        locationID: '' // Optional based on your logic/SP
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsError(false);
        setMessage('');

        // Basic validation (add more as needed)
        if (!formData.airportID || !formData.airport_name || !formData.city || !formData.state || !formData.country) {
             setIsError(true);
             setMessage('Please fill in all required fields (Airport ID, Name, City, State, Country).');
             return;
         }
         if (formData.airportID.length !== 3) {
              setIsError(true);
              setMessage('Airport ID must be exactly 3 characters.');
              return;
         }
         if (formData.country.length !== 3) {
              setIsError(true);
              setMessage('Country code must be exactly 3 characters.');
              return;
         }

        const result = await callProcedure('add_airport', formData);

        if (result.success) {
            setIsError(false);
            setMessage(result.data.message || 'Airport added successfully!');
        } else {
            setIsError(true);
            setMessage(result.error || 'Failed to add airport.');
        }
    };

     const handleCancel = () => {
         setFormData({ airportID: '', airport_name: '', city: '', state: '', country: '', locationID: '' });
         setMessage('');
         setIsError(false);
     };

    return (
        <div className="form-container">
            <h2>Procedure: Add Airport</h2>
            <form onSubmit={handleSubmit} className="procedure-form">
                {/* Match input fields to mockups/SP params */}
                <div className="form-group">
                    <label htmlFor="airportID">Airport ID</label>
                    <input type="text" id="airportID" name="airportID" value={formData.airportID} onChange={handleChange} maxLength="3" required />
                </div>
                <div className="form-group">
                    <label htmlFor="airport_name">Airport Name</label>
                    <input type="text" id="airport_name" name="airport_name" value={formData.airport_name} onChange={handleChange} required />
                </div>
                 <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />
                </div>
                 <div className="form-group">
                    <label htmlFor="state">State</label>
                    <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} required />
                </div>
                 <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <input type="text" id="country" name="country" value={formData.country} onChange={handleChange} maxLength="3" required />
                </div>
                 <div className="form-group">
                    <label htmlFor="locationID">Location ID</label>
                    <input type="text" id="locationID" name="locationID" value={formData.locationID} onChange={handleChange} placeholder="e.g., port_XXX (optional)" />
                </div>

                {message && (
                    <p className={`message ${isError ? 'error' : 'success'}`}>{message}</p>
                )}

                <div className="form-actions">
                    <button type="button" onClick={handleCancel} className="cancel-button">Cancel</button>
                    <button type="submit" className="submit-button">Add</button>
                </div>
            </form>
        </div>
    );
};

export default AddAirport;