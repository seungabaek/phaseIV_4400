import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PilotLicense from "./pages/procedures/PilotLicense";


function App() {
  return (
    <div className="App">
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/PilotLicense" element={<PilotLicense />} />
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
