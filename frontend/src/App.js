import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
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



function App() {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-airplane" element={<AddAirplane />} />
            <Route path="/add-airport" element={<AddAirport />} /> 
            <Route path="/add-person" element={<AddPerson />} /> 
            <Route path="/assign-pilot" element={<AssignPilot />} /> 
            <Route path="/flight-landing" element={<FlightLanding />} /> 
            <Route path="/flight-takeoff" element={<FlightTakeoff />} /> 
            <Route path="/grant-or-revoke" element={<GrantOrRevoke />} /> 
            <Route path="/offer-flight" element={<OfferFlight />} /> 
            <Route path="/passengers-board" element={<PassengersBoard />} /> 
            <Route path="/passengers-disembark" element={<PassengersDisembark />} /> 
            <Route path="/recycle-crew" element={<RecycleCrew />} /> 
            <Route path="/retire-flight" element={<RetireFlight />} /> 
            <Route path="/simulation-cycle" element={<SimulationCycle />} /> 

        </Routes>
    </Router>
);
}

export default App;