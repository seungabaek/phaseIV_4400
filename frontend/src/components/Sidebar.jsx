import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; 

const Sidebar = () => {
    const procedures = [
        { path: '/proc/add-airplane', label: 'Add Airplane' },
        { path: '/proc/add-airport', label: 'Add Airport' },
        { path: '/proc/add-person', label: 'Add Person' },
        { path: '/proc/grant-revoke-license', label: 'Grant/Revoke License' },
        { path: '/proc/offer-flight', label: 'Offer Flight' },
        { path: '/proc/flight-landing', label: 'Flight Landing' },
        { path: '/proc/flight-takeoff', label: 'Flight Takeoff' },
        { path: '/proc/passengers-board', label: 'Passengers Board' },
        { path: '/proc/passengers-disembark', label: 'Passengers Disembark' },
        { path: '/proc/assign-pilot', label: 'Assign Pilot' },
        { path: '/proc/recycle-crew', label: 'Recycle Crew' },
        { path: '/proc/retire-flight', label: 'Retire Flight' },
        { path: '/proc/simulation-cycle', label: 'Simulation Cycle' },
    ];

    const views = [
        { path: '/view/flights-in-air', label: 'Flights in Air' },
        { path: '/view/flights-on-ground', label: 'Flights on Ground' },
        { path: '/view/people-in-air', label: 'People in Air' },
        { path: '/view/people-on-ground', label: 'People on Ground' },
        { path: '/view/route-summary', label: 'Route Summary' },
        { path: '/view/alternative-airports', label: 'Alternative Airports' },
    ];

    return (
        <nav className="sidebar">
            <h2>Procedures</h2>
            <ul>
                {procedures.map(proc => (
                    <li key={proc.path}><Link to={proc.path}>{proc.label}</Link></li>
                ))}
            </ul>
            <h2>Views</h2>
            <ul>
                {views.map(view => (
                    <li key={view.path}><Link to={view.path}>{view.label}</Link></li>
                ))}
            </ul>
        </nav>
    );
};

export default Sidebar;