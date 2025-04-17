
import express from "express";
import mysql from "mysql";
import cors from "cors"; // for front end requests to backend

const app = express();

// 1. Enable CORS - Allow requests from your React app's origin
//    Replace 'http://localhost:3000' with your actual frontend URL if different
//    For development, allowing all origins (*) is often okay, but be specific in production.
app.use(cors({
    origin: "http://localhost:3000", // Or '*' for development, but less secure
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow necessary methods
}));


app.use(express.json());

// connecting to database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "team19", 
    database: "flight_tracking"
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err.stack); // Log full stack
        // want backend to exit if DB connection fails on startup
        process.exit(1);
    }
    console.log("MySQL connected as id " + db.threadId);
});



// GET all airplanes
app.get("/airplane", (req, res) => {
    const q = "SELECT * FROM airplane ORDER BY airlineID, tail_num"; // Added ordering
    db.query(q, (err, data) => {
        if (err) {
            console.error("Database Query Error (GET /airplane):", err);
            // Send a generic, user-friendly error
            return res.status(500).json({ message: "Error fetching airplanes from database." });
        }
        return res.json(data); // Send the data on success
    });
});

// POST a new airplane
app.post("/airplane", (req, res) => {
    // Basic validation on server-side too (though frontend should validate first)
    const { airlineID, tail_num, seat_capacity, speed, locationID, plane_type, maintenanced, model, neo } = req.body;

    if (!airlineID || !tail_num || !seat_capacity || !speed) {
        return res.status(400).json({ message: "Missing required fields: airlineID, tail_num, seat_capacity, speed" });
    }
     if (isNaN(parseInt(seat_capacity)) || isNaN(parseInt(speed))) {
        return res.status(400).json({ message: "seat_capacity and speed must be valid numbers." });
    }

    const q = `INSERT INTO airplane
               (airlineID, tail_num, seat_capacity, speed, locationID, plane_type, maintenanced, model, neo)
               VALUES (?)`; // Use parameterized query to prevent SQL injection

    const values = [
        airlineID,
        tail_num,                // validations underneath: is it a number etc
        parseInt(seat_capacity), // make sure input is #
        parseInt(speed),         // make sure input is #
        locationID || null,      // Handle optional fields (use null if empty/undefined)
        plane_type || null,
        maintenanced ? 1 : 0,    // into int
        model || null,
        neo ? 1 : 0              // into int
    ];

    db.query(q, [values], (err, result) => { 
        if (err) {
            console.error("Database Query Error (POST /airplane):", err);
            // check for duplicate entry
            if (err.code === 'ER_DUP_ENTRY') {
                 return res.status(409).json({ message: `Airplane with Airline ID '${airlineID}' and Tail Number '${tail_num}' already exists.` });
            }
             if (err.code === 'ER_NO_REFERENCED_ROW_2' && err.message.includes('fk1')) {
                 return res.status(400).json({ message: `Airline ID '${airlineID}' does not exist in the airline table.` });
             }
             if (err.code === 'ER_NO_REFERENCED_ROW_2' && err.message.includes('fk3')) {
                 return res.status(400).json({ message: `Location ID '${locationID}' does not exist in the location table.` });
             }
            // Generic error for other issues
            return res.status(500).json({ message: "Error adding airplane to the database." });
        }
        // Send back success message and potentially the ID of the inserted row
        return res.status(201).json({ message: "Airplane added successfully!", insertedId: result.insertId });
    });
});


// Test route (keep or remove as needed)
app.get("/", (req, res) => {
    res.json("Backend is running!");
});

// start server
const PORT = 8800;
app.listen(PORT, () => {
    console.log(`Backend server connected and listening on port ${PORT}!!`);
});