import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddAirplane from './pages/procedures/AddAirplane';
import AddAirport from './pages/procedures/AddAirport'; 



function App() {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-airplane" element={<AddAirplane />} />
            <Route path="/add-airport" element={<AddAirport />} /> 
        </Routes>
    </Router>
);
}

export default App;