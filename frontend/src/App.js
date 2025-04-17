// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import Layout and Components
import Layout from "./components/Layout"; // Assuming you have Layout.jsx and Sidebar.jsx components
import Home from "./pages/Home";         // The new landing page component
import AddAirport from './pages/procedures/AddAirport';
import ViewFlightsInAir from './pages/views/ViewFlightsInAir';
// Import other procedure/view components as you create them...

// Import necessary CSS
import './App.css'; // General app styles
import './components/Layout.css'; // Styles for Layout/Sidebar
import './components/Sidebar.css';
import './pages/FormStyles.css'; // Styles for procedure forms
import './pages/ViewStyles.css'; // Styles for view tables

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Use the Layout component as the main structure */}
        <Route path="/" element={<Layout />}>

          {/* The default page shown within the Layout (our landing page) */}
          <Route index element={<Home />} />

          {/* Define specific routes for procedures */}
          <Route path="proc/add-airport" element={<AddAirport />} />
          {/* Add routes for other procedures here as you build them */}
          {/* e.g., <Route path="proc/add-airplane" element={<AddAirplane />} /> */}

          {/* Define specific routes for views */}
          <Route path="view/flights-in-air" element={<ViewFlightsInAir />} />
          {/* Add routes for other views here */}
          {/* e.g., <Route path="view/flights-on-ground" element={<ViewFlightsOnGround />} /> */}

          {/* Optional: Catch-all route for 404 within the Layout */}
          <Route path="*" element={<div style={{ padding: '20px' }}>Page Not Found</div>} />

        </Route> {/* End of Layout Route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;