// src/pages/views/ViewFlightsInAir.jsx
import React, { useState, useEffect } from 'react';
import { getViewData } from '../../api'; // Import the API helper
import '../ViewStyles.css'; // Create a shared CSS file for views

const ViewFlightsInAir = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            const result = await getViewData('flights_in_the_air');
            if (result.success) {
                setData(result.data);
            } else {
                setError(result.error || 'Failed to fetch data.');
            }
            setLoading(false);
        };

        fetchData();
    }, []); // Empty dependency array means run once on mount

    if (loading) return <p>Loading flights in the air...</p>;
    if (error) return <p className="error-message">Error: {error}</p>;
    if (!data || data.length === 0) return <p>No flights currently in the air.</p>;

    // Dynamically get headers from the first data object
    const headers = data.length > 0 ? Object.keys(data[0]) : [];

    return (
        <div className="view-container">
            <h2>View: Flights in the Air</h2>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            {headers.map(header => (
                                <th key={header}>{header.replace(/_/g, ' ')}</th> // Format header
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index}> {}
                                {headers.map(header => (
                                    <td key={`${index}-${header}`}>{row[header] !== null ? String(row[header]) : 'NULL'}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewFlightsInAir;