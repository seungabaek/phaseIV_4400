import React from 'react';

import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";

import './Main.css';

//PROCEDURES
import AddAirplane from './pages/procedures/AddAirplane';
import AddAirport from './pages/procedures/AddAirport'; 
import AddPerson from './pages/procedures/AddPerson'; 
import AssignPilot from './pages/procedures/AssignPilot'; 
import FlightLanding from './pages/procedures/FlightLanding'; 
import FlightTakeoff from './pages/procedures/FlightTakeoff'; 
import GrantOrRevoke from './pages/procedures/GrantOrRevoke'; 
import OfferFlight from './pages/procedures/OfferFlight'; 
import PassengersBoard from './pages/procedures/PassengersBoard'; 
import PassengersDisembark from './pages/procedures/PassengersDisembark'; 
import RecycleCrew from './pages/procedures/RecycleCrew'; 
import RetireFlight from './pages/procedures/RetireFlight'; 
import SimulationCycle from './pages/procedures/SimulationCycle'; 

//VIEWS
import AlternateAirports from './pages/views/AlternateAirports'; 
import FlightsInAir from './pages/views/FlightsInAir'; 
import FlightsOnGround from './pages/views/FlightsOnGround'; 
import PeopleInAir from './pages/views/PeopleInAir'; 
import PeopleOnGround from './pages/views/PeopleOnGround'; 
import RouteSummary from './pages/views/RouteSummary'; 


function Main() {
  const procedures = [
    { path: '/add-airplane', label: 'Add Airplane' },
    { path: '/add-airport', label: 'Add Airport' },
    { path: '/add-person', label: 'Add Person' },
    { path: '/grant-revoke-license', label: 'Grant/Revoke License' },
    { path: '/offer-flight', label: 'Offer Flight' },
    { path: '/flight-landing', label: 'Flight Landing' },
    { path: '/flight-takeoff', label: 'Flight Takeoff' },
    { path: '/passengers-board', label: 'Passengers Board' },
    { path: '/passengers-disembark', label: 'Passengers Disembark' },
    { path: '/assign-pilot', label: 'Assign Pilot' },
    { path: '/recycle-crew', label: 'Recycle Crew' },
    { path: '/retire-flight', label: 'Retire Flight' },
    { path: '/simulation-cycle', label: 'Simulation Cycle' },
  ];

  const views = [
    { path: '/flights-in-air', label: 'Flights in Air' },
    { path: '/flights-on-ground', label: 'Flights on Ground' },
    { path: '/people-in-air', label: 'People in Air' },
    { path: '/people-on-ground', label: 'People on Ground' },
    { path: '/route-summary', label: 'Route Summary' },
    { path: '/alternate-airports', label: 'Alternate Airports' },
  ];


  return (
    <Router>
      <div className="app-container">
        <nav className="sidebar">
          <h2>Procedures</h2>
          <ul>
            {procedures.map(p => (
              <li key={p.path}>
                <NavLink to={p.path} className={({isActive}) => isActive ? 'active' : ''}>
                  {p.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <h2>Views</h2>
          <ul>
            {views.map(p => (
              <li key={p.path}>
                <NavLink to={p.path} className={({isActive}) => isActive ? 'active' : ''}>
                  {p.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <main className="content-area">
          <Routes>
            {/* //PROCEDURES */}
            <Route path="/add-airplane" element={<AddAirplane />} />
            <Route path="/add-airport" element={<AddAirport />} /> 
            <Route path="/add-person" element={<AddPerson />} /> 
            <Route path="/assign-pilot" element={<AssignPilot />} /> 
            <Route path="/flight-landing" element={<FlightLanding />} /> 
            <Route path="/flight-takeoff" element={<FlightTakeoff />} /> 
            <Route path="/grant-revoke-license" element={<GrantOrRevoke />} /> 
            <Route path="/offer-flight" element={<OfferFlight />} /> 
            <Route path="/passengers-board" element={<PassengersBoard />} /> 
            <Route path="/passengers-disembark" element={<PassengersDisembark />} /> 
            <Route path="/recycle-crew" element={<RecycleCrew />} /> 
            <Route path="/retire-flight" element={<RetireFlight />} /> 
            <Route path="/simulation-cycle" element={<SimulationCycle />} />

            {/* VIEWS */}
            <Route path="/flights-in-air" element={<FlightsInAir />} />
            <Route path="/flights-on-ground"  element={<FlightsOnGround />} />
            <Route path="/people-in-air"  element={<PeopleInAir />} />
            <Route path="/people-on-ground" element={<PeopleOnGround />} />
            <Route path="/route-summary" element={<RouteSummary />} />
            <Route path="/alternate-airports" element={<AlternateAirports />} />
            
            </Routes>
        </main>
      </div>
    </Router>
  );
}

export default Main;