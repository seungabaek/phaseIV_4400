// index.js (Replace or add these airport routes)

import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "team19", // Replace with your actual password if needed
    database: "flight_tracking"
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err.stack);
        process.exit(1);
    }
    console.log("MySQL connected as id " + db.threadId);
});

// --- AIRPLANE ROUTES (Keep your existing ones) ---
// GET all airplanes
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

// POST a new airplane
app.post("/airplane", (req, res) => {
    const { airlineID, tail_num, seat_capacity, speed, locationID, plane_type, maintenanced, model, neo } = req.body;

    if (!airlineID || !tail_num || !seat_capacity || !speed) {
        return res.status(400).json({ message: "Missing required fields: airlineID, tail_num, seat_capacity, speed" });
    }
    if (isNaN(parseInt(seat_capacity)) || isNaN(parseInt(speed))) {
        return res.status(400).json({ message: "seat_capacity and speed must be valid numbers." });
    }
    // Add check for positive numbers based on schema constraints
    if (parseInt(seat_capacity) <= 0 || parseInt(speed) <= 0) {
         return res.status(400).json({ message: "seat_capacity and speed must be positive numbers." });
     }

    const q = `INSERT INTO airplane
               (airlineID, tail_num, seat_capacity, speed, locationID, plane_type, maintenanced, model, neo)
               VALUES (?)`;

    const values = [
        airlineID,
        tail_num,
        parseInt(seat_capacity),
        parseInt(speed),
        locationID || null,
        plane_type || null,
        maintenanced ? 1 : 0,
        model || null,
        neo ? 1 : 0
    ];

    db.query(q, [values], (err, result) => {
        if (err) {
            console.error("Database Query Error (POST /airplane):", err);
            if (err.code === 'ER_DUP_ENTRY') {
                 return res.status(409).json({ message: `Airplane with Airline ID '${airlineID}' and Tail Number '${tail_num}' already exists.` });
            }
             // Use specific foreign key constraint names from your schema
             if (err.code === 'ER_NO_REFERENCED_ROW_2' && err.message.includes('fk1')) { // airlineID -> airline
                 return res.status(400).json({ message: `Airline ID '${airlineID}' does not exist in the airline table.` });
             }
             if (err.code === 'ER_NO_REFERENCED_ROW_2' && err.message.includes('fk3')) { // locationID -> location
                 return res.status(400).json({ message: `Location ID '${locationID}' does not exist in the location table.` });
             }
            return res.status(500).json({ message: "Error adding airplane to the database." });
        }
        return res.status(201).json({ message: "Airplane added successfully!", insertedId: result.insertId });
    });
});


// --- AIRPORT ROUTES ---

// GET all airports
app.get("/airport", (req, res) => {
    // Select specific columns defined in the schema
    const q = "SELECT airportID, airport_name, city, state, country, locationID FROM airport ORDER BY airportID";
    db.query(q, (err, data) => {
        if (err) {
            console.error("Database Query Error (GET /airport):", err);
            return res.status(500).json({ message: "Error fetching airports from database." });
        }
        return res.json(data);
    });
});

// POST a new airport
app.post("/airport", (req, res) => {
    const { airportID, airport_name, city, state, country, locationID } = req.body;

    // Server-side validation based on schema
    if (!airportID || !airport_name || !city || !state || !country) {
        // airport_name is not explicitly NOT NULL in schema, but likely required functionally
        return res.status(400).json({ message: "Missing required fields: airportID, airport_name, city, state, country" });
    }
    if (typeof airportID !== 'string' || airportID.trim().length !== 3) {
        return res.status(400).json({ message: "Airport ID must be exactly 3 characters." });
    }
    if (typeof country !== 'string' || country.trim().length !== 3) {
        return res.status(400).json({ message: "Country code must be exactly 3 characters." });
    }
    if (locationID && typeof locationID !== 'string') { // Ensure locationID if provided is a string
        return res.status(400).json({ message: "Location ID must be a string." });
    }


    const q = `INSERT INTO airport
               (airportID, airport_name, city, state, country, locationID)
               VALUES (?)`;

    const values = [
        airportID.trim().toUpperCase(), // Enforce uppercase and remove whitespace
        airport_name,
        city,
        state,
        country.trim().toUpperCase(), // Enforce uppercase and remove whitespace
        locationID ? locationID.trim() : null // Send null if empty/undefined, trim if provided
    ];

    db.query(q, [values], (err, result) => {
        if (err) {
            console.error("Database Query Error (POST /airport):", err);
            // Check for duplicate entry (airportID is primary key)
            if (err.code === 'ER_DUP_ENTRY') {
                 return res.status(409).json({ message: `Airport with ID '${values[0]}' already exists.` }); // Use processed value
            }
             // Check for foreign key constraint violation for locationID
             // Use the specific constraint name from your schema 'fk2'
             if (err.code === 'ER_NO_REFERENCED_ROW_2' && err.message.includes('fk2')) {
                 return res.status(400).json({ message: `Location ID '${values[5]}' does not exist in the location table.` }); // Use processed value
             }
            // Generic error for other issues
            return res.status(500).json({ message: "Error adding airport to the database." });
        }
        // Send back success message
        return res.status(201).json({ message: "Airport added successfully!", insertedId: values[0] }); // Return the ID used
    });
});
// index.js (Add these routes)

// --- PERSON ROUTES ---

// GET all persons
app.get("/person", (req, res) => {
    // Select specific columns defined in the schema
    const q = "SELECT personID, first_name, last_name, locationID FROM person ORDER BY personID";
    db.query(q, (err, data) => {
        if (err) {
            console.error("Database Query Error (GET /person):", err);
            return res.status(500).json({ message: "Error fetching persons from database." });
        }
        return res.json(data);
    });
});

// POST a new person
app.post("/person", (req, res) => {
    const { personID, first_name, last_name, locationID } = req.body;

    // Server-side validation based on schema
    // personID, first_name, locationID are NOT NULL
    if (!personID || !first_name || !locationID) {
        return res.status(400).json({ message: "Missing required fields: personID, first_name, locationID" });
    }

    // Basic type checks (can add more specific validation if needed)
    if (typeof personID !== 'string' || personID.trim().length === 0) {
         return res.status(400).json({ message: "Person ID must be a non-empty string." });
    }
    if (typeof first_name !== 'string' || first_name.trim().length === 0) {
         return res.status(400).json({ message: "First Name must be a non-empty string." });
    }
    if (typeof locationID !== 'string' || locationID.trim().length === 0) {
        return res.status(400).json({ message: "Location ID must be a non-empty string." });
    }
    // last_name is optional, check type if provided
    if (last_name && typeof last_name !== 'string') {
         return res.status(400).json({ message: "Last Name must be a string if provided." });
    }


    const q = `INSERT INTO person
               (personID, first_name, last_name, locationID)
               VALUES (?)`;

    const values = [
        personID.trim(),
        first_name.trim(),
        last_name ? last_name.trim() : null, // Send null if last_name is empty/undefined/null
        locationID.trim()
    ];

    db.query(q, [values], (err, result) => {
        if (err) {
            console.error("Database Query Error (POST /person):", err);
            // Check for duplicate entry (personID is primary key)
            if (err.code === 'ER_DUP_ENTRY') {
                 return res.status(409).json({ message: `Person with ID '${values[0]}' already exists.` });
            }
             // Check for foreign key constraint violation for locationID
             // Use the specific constraint name from your schema 'fk8'
             if (err.code === 'ER_NO_REFERENCED_ROW_2' && err.message.includes('fk8')) {
                 return res.status(400).json({ message: `Location ID '${values[3]}' does not exist in the location table.` });
             }
            // Generic error for other issues
            return res.status(500).json({ message: "Error adding person to the database." });
        }
        // Send back success message
        return res.status(201).json({ message: "Person added successfully!", insertedId: values[0] }); // Return the ID used
    });
});


// --- Make sure other routes (/, /airplane, /airport) and app.listen remain ---


// --- OTHER ROUTES (Keep existing ones if any) ---
app.get("/", (req, res) => {
    res.json("Backend is running!");
});

// --- START SERVER ---
const PORT = 8800;
app.listen(PORT, () => {
    console.log(`Backend server connected and listening on port ${PORT}!!`);
});