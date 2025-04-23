// index.js

import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();

// --- MIDDLEWARE ---
app.use(cors({
    origin: "http://localhost:3000", // Your React app's URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
}));
app.use(express.json()); // To parse JSON request bodies

// --- DATABASE CONNECTION ---
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "team19", // Replace with your actual password if needed
    database: "flight_tracking"
});

// Connect to DB (Only ONCE)
db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err.stack);
        process.exit(1); // Exit if DB connection fails on startup
    }
    console.log("MySQL connected as id " + db.threadId);
});


// --- ROUTE DEFINITIONS ---

// Base Route
app.get("/", (req, res) => {
    res.json("Backend is running!");
});

// --- AIRPLANE ROUTES ---
app.get("/airplane", (req, res) => {
    const q = "SELECT * FROM airplane ORDER BY airlineID, tail_num";
    db.query(q, (err, data) => {
        if (err) {
            console.error("Database Query Error (GET /airplane):", err);
            return res.status(500).json({ message: "Error fetching airplanes from database." });
        }
        return res.json(data);
    });
});

app.post("/airplane", (req, res) => {
    const { airlineID, tail_num, seat_capacity, speed, locationID, plane_type, maintenanced, model, neo } = req.body;

    if (!airlineID || !tail_num || !seat_capacity || !speed) {
        return res.status(400).json({ message: "Missing required fields: airlineID, tail_num, seat_capacity, speed" });
    }
    const seatCapInt = parseInt(seat_capacity);
    const speedInt = parseInt(speed);
    if (isNaN(seatCapInt) || isNaN(speedInt)) {
        return res.status(400).json({ message: "seat_capacity and speed must be valid numbers." });
    }
    if (seatCapInt <= 0 || speedInt <= 0) {
         return res.status(400).json({ message: "seat_capacity and speed must be positive numbers." });
     }

    const q = `INSERT INTO airplane
               (airlineID, tail_num, seat_capacity, speed, locationID, plane_type, maintenanced, model, neo)
               VALUES (?)`;
    const values = [
        airlineID, tail_num, seatCapInt, speedInt,
        locationID || null, plane_type || null, maintenanced ? 1 : 0,
        model || null, neo ? 1 : 0
    ];

    db.query(q, [values], (err, result) => {
        if (err) {
            console.error("Database Query Error (POST /airplane):", err);
            if (err.code === 'ER_DUP_ENTRY') {
                 return res.status(409).json({ message: `Airplane with Airline ID '${airlineID}' and Tail Number '${tail_num}' already exists.` });
            }
             if (err.code === 'ER_NO_REFERENCED_ROW_2' && err.message.includes('fk1')) {
                 return res.status(400).json({ message: `Airline ID '${airlineID}' does not exist in the airline table.` });
             }
             if (err.code === 'ER_NO_REFERENCED_ROW_2' && err.message.includes('fk3')) {
                 return res.status(400).json({ message: `Location ID '${locationID}' does not exist in the location table.` });
             }
            return res.status(500).json({ message: "Error adding airplane to the database." });
        }
        return res.status(201).json({ message: "Airplane added successfully!", insertedId: result.insertId });
    });
});

// --- AIRPORT ROUTES ---
app.get("/airport", (req, res) => {
    const q = "SELECT airportID, airport_name, city, state, country, locationID FROM airport ORDER BY airportID";
    db.query(q, (err, data) => {
        if (err) {
            console.error("Database Query Error (GET /airport):", err);
            return res.status(500).json({ message: "Error fetching airports from database." });
        }
        return res.json(data);
    });
});

app.post("/airport", (req, res) => {
    const { airportID, airport_name, city, state, country, locationID } = req.body;

    if (!airportID || !airport_name || !city || !state || !country) {
        return res.status(400).json({ message: "Missing required fields: airportID, airport_name, city, state, country" });
    }
    if (typeof airportID !== 'string' || airportID.trim().length !== 3) {
        return res.status(400).json({ message: "Airport ID must be exactly 3 characters." });
    }
    if (typeof country !== 'string' || country.trim().length !== 3) {
        return res.status(400).json({ message: "Country code must be exactly 3 characters." });
    }
    if (locationID && typeof locationID !== 'string') {
        return res.status(400).json({ message: "Location ID must be a string." });
    }

    const q = `INSERT INTO airport (airportID, airport_name, city, state, country, locationID) VALUES (?)`;
    const values = [
        airportID.trim().toUpperCase(), airport_name.trim(), city.trim(), state.trim(),
        country.trim().toUpperCase(), locationID ? locationID.trim() : null
    ];

    db.query(q, [values], (err, result) => {
        if (err) {
            console.error("Database Query Error (POST /airport):", err);
            if (err.code === 'ER_DUP_ENTRY') {
                 return res.status(409).json({ message: `Airport with ID '${values[0]}' already exists.` });
            }
             if (err.code === 'ER_NO_REFERENCED_ROW_2' && err.message.includes('fk2')) {
                 return res.status(400).json({ message: `Location ID '${values[5]}' does not exist in the location table.` });
             }
            return res.status(500).json({ message: "Error adding airport to the database." });
        }
        return res.status(201).json({ message: "Airport added successfully!", insertedId: values[0] });
    });
});

// --- PERSON ROUTES ---
app.get("/person", (req, res) => {
    const q = "SELECT personID, first_name, last_name, locationID FROM person ORDER BY personID";
    db.query(q, (err, data) => {
        if (err) {
            console.error("Database Query Error (GET /person):", err);
            return res.status(500).json({ message: "Error fetching persons from database." });
        }
        return res.json(data);
    });
});

app.post("/person", (req, res) => {
    const { personID, first_name, last_name, locationID } = req.body;

    if (!personID || !first_name || !locationID) {
        return res.status(400).json({ message: "Missing required fields: personID, first_name, locationID" });
    }
    if (typeof personID !== 'string' || personID.trim().length === 0) {
         return res.status(400).json({ message: "Person ID must be a non-empty string." });
    }
    if (typeof first_name !== 'string' || first_name.trim().length === 0) {
         return res.status(400).json({ message: "First Name must be a non-empty string." });
    }
    if (typeof locationID !== 'string' || locationID.trim().length === 0) {
        return res.status(400).json({ message: "Location ID must be a non-empty string." });
    }
    if (last_name && typeof last_name !== 'string') {
         return res.status(400).json({ message: "Last Name must be a string if provided." });
    }

    const q = `INSERT INTO person (personID, first_name, last_name, locationID) VALUES (?)`;
    const values = [
        personID.trim(), first_name.trim(),
        last_name ? last_name.trim() : null, locationID.trim()
    ];

    db.query(q, [values], (err, result) => {
        if (err) {
            console.error("Database Query Error (POST /person):", err);
            if (err.code === 'ER_DUP_ENTRY') {
                 return res.status(409).json({ message: `Person with ID '${values[0]}' already exists.` });
            }
             if (err.code === 'ER_NO_REFERENCED_ROW_2' && err.message.includes('fk8')) {
                 return res.status(400).json({ message: `Location ID '${values[3]}' does not exist in the location table.` });
             }
            return res.status(500).json({ message: "Error adding person to the database." });
        }
        return res.status(201).json({ message: "Person added successfully!", insertedId: values[0] });
    });
});

// --- FLIGHT ROUTES --- (Needed for pilot assignment dropdown)
app.get("/flight", (req, res) => {
    const q = "SELECT flightID, routeID, airplane_status FROM flight ORDER BY flightID";
    db.query(q, (err, data) => {
        if (err) {
            console.error("Database Query Error (GET /flight):", err);
            return res.status(500).json({ message: "Error fetching flights from database." });
        }
        return res.json(data);
    });
});


// --- PILOT & PILOT ASSIGNMENT/LICENSE ROUTES ---

// GET all pilots (with names, for dropdowns)
app.get("/pilot", (req, res) => {
    const q = `
        SELECT
            p.personID,
            pe.first_name,
            pe.last_name,
            p.commanding_flight
        FROM pilot p
        JOIN person pe ON p.personID = pe.personID
        ORDER BY pe.last_name, pe.first_name`;

    db.query(q, (err, data) => {
        if (err) {
            console.error("Database Query Error (GET /pilot):", err);
            return res.status(500).json({ message: "Error fetching pilots from database." });
        }
        return res.json(data);
    });
});

// PUT - Assign/Unassign a flight to a pilot
app.put("/pilot/:personId/assignFlight", (req, res) => {
    const personId = req.params.personId;
    const { flightId } = req.body;

    if (!personId) {
        return res.status(400).json({ message: "Missing pilot ID in URL parameter." });
    }
    if (flightId === undefined) {
         return res.status(400).json({ message: "Missing 'flightId' in request body (can be null to unassign)." });
     }

    const flightToAssign = (flightId && typeof flightId === 'string' && flightId.trim().length > 0) ? flightId.trim() : null;
    const q = "UPDATE pilot SET commanding_flight = ? WHERE personID = ?";

    db.query(q, [flightToAssign, personId], (err, result) => {
        if (err) {
            console.error("Database Query Error (PUT /pilot/:personId/assignFlight):", err);
             if (err.code === 'ER_NO_REFERENCED_ROW_2' && err.message.includes('fk9')) {
                 return res.status(400).json({ message: `Flight ID '${flightToAssign}' does not exist in the flight table.` });
             }
            return res.status(500).json({ message: "Error updating pilot assignment." });
        }
        if (result.affectedRows === 0) {
             return res.status(404).json({ message: `Pilot with Person ID '${personId}' not found.` });
        }
        const successMessage = flightToAssign
            ? `Pilot '${personId}' assigned to flight '${flightToAssign}' successfully!`
            : `Pilot '${personId}' unassigned from flight successfully!`;
        return res.status(200).json({ message: successMessage });
    });
});

// GET - Fetch licenses for a specific pilot
app.get("/pilot/:personId/licenses", (req, res) => {
    const personId = req.params.personId;
    if (!personId) {
        return res.status(400).json({ message: "Missing pilot person ID in URL parameter." });
    }
    const q = "SELECT license FROM pilot_licenses WHERE personID = ? ORDER BY license";
    db.query(q, [personId], (err, data) => {
        if (err) {
            console.error(`Database Query Error (GET /pilot/${personId}/licenses):`, err);
            return res.status(500).json({ message: "Error fetching pilot licenses." });
        }
        return res.json(data.map(item => item.license)); // Send array of strings
    });
});

// POST - Call SP to grant or revoke a specific license for a pilot
app.post("/pilot/:personId/toggleLicense", (req, res) => {
    const personId = req.params.personId;
    const { license } = req.body;

    if (!personId) {
        return res.status(400).json({ message: "Missing pilot person ID in URL parameter." });
    }
    if (!license || typeof license !== 'string' || license.trim().length === 0) {
        return res.status(400).json({ message: "Missing or invalid 'license' type in request body." });
    }
    const licenseToToggle = license.trim();
    const q = "CALL grant_or_revoke_pilot_license(?, ?)";

    db.query(q, [personId, licenseToToggle], (err, result) => {
        if (err) {
            console.error(`Database Query Error (CALL SP grant_or_revoke_pilot_license for ${personId}, ${licenseToToggle}):`, err);
             if (err.code === 'ER_NO_REFERENCED_ROW_2') { // Less likely due to SP check
                 return res.status(404).json({ message: `Pilot with Person ID '${personId}' not found.` });
             }
            return res.status(500).json({ message: `Error processing license change for ${licenseToToggle}.` });
        }
        return res.status(200).json({ message: `License '${licenseToToggle}' status updated successfully for pilot '${personId}'.` });
    });
});


const PORT = 8800;
app.listen(PORT, () => {
    console.log(`Backend server connected and listening on port ${PORT}!!`);
});