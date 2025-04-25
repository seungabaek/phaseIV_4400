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
    password: "team19", 
    database: "flight_tracking"
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err.stack);
        process.exit(1); 
    }
    console.log("MySQL connected as id " + db.threadId);
});



app.get("/", (req, res) => {
    res.json("Backend is running!");
});

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

    const q = `CALL add_airplane(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
        airlineID, tail_num, parseInt(seat_capacity, 10), parseInt(speed, 10),
        locationID || null, plane_type || null, maintenanced ? 1 : 0,
        model || null, neo ? 1 : 0
    ];

    db.query(q, values, (err, result) => {
        if (err) {
            console.error("Database Query Error (CALL add_airplane):", err);
            return res.status(500).json({ message: "Error adding airplane via stored procedure." });
        }
        return res.status(201).json({ message: "Airplane added successfully!" });
    });
});


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

    const q = `CALL add_airport(?, ?, ?, ?, ?, ?)`;
    const values = [
        airportID.trim().toUpperCase(),
        airport_name.trim(),
        city.trim(),
        state.trim(),
        country.trim().toUpperCase(),
        locationID || null
    ];

    db.query(q, values, (err, result) => {
        if (err) {
            console.error("Database Query Error (CALL add_airport):", err);
            return res.status(500).json({ message: "Error adding airport via stored procedure." });
        }
        return res.status(201).json({ message: "Airport added successfully!" });
    });
});


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

    const q = `CALL add_person(?, ?, ?, ?)`;
    const values = [
        personID.trim(),
        first_name.trim(),
        last_name ? last_name.trim() : null,
        locationID.trim()
    ];

    db.query(q, values, (err, result) => {
        if (err) {
            console.error("Database Query Error (CALL add_person):", err);
            return res.status(500).json({ message: "Error adding person via stored procedure." });
        }
        return res.status(201).json({ message: "Person added successfully!" });
    });
});


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

app.get("/flight", (req, res) => {
    const q = `
        SELECT
            flightID,
            routeID,
            progress,
            next_time AS nextTime,
            cost,
            support_airline AS supportAirline,
            support_tail AS supportTail
        FROM flight
        ORDER BY flightID;
    `;

    db.query(q, (err, data) => {
        if (err) {
            console.error("Database Query Error (GET /flight):", err);
            return res.status(500).json({ message: "Error fetching flights from the database." });
        }
        return res.json(data);
    });
});

app.post("/offer_flight", (req, res) => {
    const { flightID, routeID, supportAirline, supportTail, progress, nextTime, cost } = req.body;

    if (!flightID || !routeID || progress == null || !nextTime || cost == null) {
        return res.status(400).json({ message: "Missing required fields: flightID, routeID, progress, nextTime, cost" });
    }

    const q = `CALL offer_flight(?, ?, ?, ?, ?, ?, ?)`;
    const values = [flightID, routeID, supportAirline || null, supportTail || null, progress, nextTime, cost];

    db.query(q, values, (err, result) => {
        if (err) {
            console.error("Database Query Error (CALL offer_flight):", err);
            return res.status(500).json({ message: "Error offering flight." });
        }

        const offerResult = result?.[0]?.[0]?.result;
        if (offerResult !== 'SUCCESS') {
            return res.status(400).json({ message: "Flight could not be offered due to invalid data." });
        }

        return res.status(201).json({ message: "Flight offered successfully!" });
    });
});


app.get("/flights_in_the_air", (req, res) => {
    const q = `
        SELECT departing_from, arriving_at, num_flights, flight_list,
		    earliest_arrival, latest_arrival, airplane_list
        FROM flights_in_the_air
    `;

    db.query(q, (err, data) => {
        if (err) {
            console.error("Database Query Error (GET /flights_in_the_air):", err);
            return res.status(500).json({ message: "Error fetching flights in air from database." });
        }
        console.log(data);
        return res.json(data);
    });
});

app.get("/flights_on_the_ground", (req, res) => {
    const q = `
        SELECT departing_from, num_flights, flight_list,
                earliest_arrival, latest_arrival, airplane_list
        FROM flights_on_the_ground
    `;

    db.query(q, (err, data) => {
        if (err) {
            console.error("Database Query Error (GET /flights_on_the_ground):", err);
            return res.status(500).json({ message: "Error fetching flights in air from database." });
        }
        console.log(data);
        return res.json(data);
    });
});

app.post("/passengers_disembark", (req, res) => {
    const { flightID } = req.body;

    if (!flightID || flightID.trim() === "") {
        return res.status(400).json({ message: "Flight ID is required and cannot be empty." });
    }

    const checkFlightQuery = `SELECT airplane_status FROM flight WHERE flightID = ?`;
    db.query(checkFlightQuery, [flightID], (err, result) => {
        if (err) {
            console.error("Database Query Error (Check Flight):", err);
            return res.status(500).json({ message: "Error checking flight existence." });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: `Flight with ID '${flightID}' does not exist.` });
        }

        const airplaneStatus = result[0].airplane_status;
        if (airplaneStatus !== "on_ground") {
            return res.status(400).json({ message: `Flight with ID '${flightID}' is not on the ground. Current status: '${airplaneStatus}'.` });
        }

        const q = `CALL passengers_disembark(?)`;
        db.query(q, [flightID], (err, result) => {
            if (err) {
                console.error("Database Query Error (POST /passengers_disembark):", err);
                return res.status(500).json({ message: "Error disembarking passengers." });
            }

            if (result.affectedRows === 0) {
                return res.status(200).json({ message: `No passengers to disembark for flight ID '${flightID}'.` });
            }

            return res.status(200).json({ message: "Passengers disembarked successfully!" });
        });
    });
});


app.post("/passengers_board", (req, res) => {
    const { flightID } = req.body;

    if (!flightID || flightID.trim() === "") {
        return res.status(400).json({ message: "Flight ID is required and cannot be empty." });
    }

    const q = `CALL passengers_board(?)`;
    db.query(q, [flightID], (err, result) => {
        if (err) {
            console.error("Database Query Error (POST /passengers_board):", err);
            return res.status(500).json({ message: "Error boarding passengers." });
        }

        if (!result || !result[0] || result[0].length === 0) {
            return res.status(200).json({ message: `No passengers to board for flight ID '${flightID}'.` });
        }

        return res.status(200).json({
            message: "Passengers boarded successfully!",
            passengers: result[0]
        });
    });
});


app.get("/boarded_passengers/:flightID", (req, res) => {
    const { flightID } = req.params;

    if (!flightID || flightID.trim() === "") {
        return res.status(400).json({ message: "Flight ID is required and cannot be empty." });
    }

    const q = `
        SELECT p.personID, p.first_name, p.last_name
        FROM person p
        JOIN passenger ps ON p.personID = ps.personID
        WHERE p.locationID = (
            SELECT ap.locationID
            FROM flight f
            JOIN airplane ap ON f.support_airline = ap.airlineID AND f.support_tail = ap.tail_num
            WHERE f.flightID = ?
        )
    `;

    db.query(q, [flightID], (err, data) => {
        if (err) {
            console.error("Database Query Error (GET /boarded_passengers):", err);
            return res.status(500).json({ message: "Error fetching boarded passengers." });
        }

        if (!data || data.length === 0) {
            return res.status(200).json({
                message: `No passengers are currently boarded on flight ID '${flightID}'.`,
                passengers: []
            });
        }

        return res.status(200).json({
            message: "Boarded passengers retrieved successfully!",
            passengers: data
        });
    });
});

app.get("/alternate_airports", (req, res) => {
    const q = `SELECT * FROM alternative_airports`;
    db.query(q, (err, data) => {
        if (err) {
            console.error("Database Query Error (GET /alternate_airports):", err);
            return res.status(500).json({ message: "Error fetching flights in the air." });
        }
        return res.status(200).json(data);
    });
});

app.get("/flights_in_air", (req, res) => {
    const q = `SELECT * FROM people_in_the_air`;
    db.query(q, (err, data) => {
        if (err) {
            console.error("Database Query Error (GET /flights_in_air):", err);
            return res.status(500).json({ message: "Error fetching flights in the air." });
        }
        return res.status(200).json(data);
    });
});

app.get("/people_on_the_ground", (req, res) => {
    const q = `SELECT * FROM people_on_the_ground`;
    db.query(q, (err, data) => {
        if (err) {
            console.error("Database Query Error (GET /people_on_the_ground):", err);
            return res.status(500).json({ message: "Error fetching people on the ground." });
        }
        return res.status(200).json(data);
    });
});

app.get("/route_summary", (req, res) => {
    const q = `SELECT * FROM route_summary`;
    db.query(q, (err, data) => {
        if (err) {
            console.error("Database Query Error (GET /route_summary):", err);
            return res.status(500).json({ message: "Error fetching route summaries." });
        }
        return res.status(200).json(data);
    });
});


app.get("/", (req, res) => {
    res.json("Backend is running!");
});

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
        return res.json(data.map(item => item.license)); 
    });
});

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
             if (err.code === 'ER_NO_REFERENCED_ROW_2') { 
                 return res.status(404).json({ message: `Pilot with Person ID '${personId}' not found.` });
             }
            return res.status(500).json({ message: `Error processing license change for ${licenseToToggle}.` });
        }
        return res.status(200).json({ message: `License '${licenseToToggle}' status updated successfully for pilot '${personId}'.` });
    });
});

app.post("/flight_takeoff", (req, res) => {
    const { flightID } = req.body;
    if (!flightID || flightID.trim() === "") {
        return res.status(400).json({ message: "Flight ID is required." });
    }

    db.query(`CALL flight_takeoff(?)`, [flightID], (err) => {
        if (err) {
            console.error("Database Query Error (POST /flight_takeoff):", err);
            return res.status(500).json({ message: "Error initiating takeoff." });
        }
        return res.status(200).json({ message: `Flight '${flightID}' landed successfully.` });
    });
});

app.post("/flight_landing", (req, res) => {
    const { flightID } = req.body;
    if (!flightID || flightID.trim() === "") {
        return res.status(400).json({ message: "Flight ID is required." });
    }

    db.query(`CALL flight_landing(?)`, [flightID], (err) => {
        if (err) {
            console.error("Database Query Error (POST /flight_landing):", err);
            return res.status(500).json({ message: "Error landing flight." });
        }
        return res.status(200).json({ message: `Flight '${flightID}' landed successfully.` });
    });
});

app.post("/recycle_crew", (req, res) => {
    const { flightID } = req.body;
    if (!flightID || flightID.trim() === "") {
        return res.status(400).json({ message: "Flight ID is required." });
    }

    db.query(`CALL recycle_crew(?)`, [flightID], (err) => {
        if (err) {
            console.error("Database Query Error (POST /recycle_crew):", err);
            return res.status(500).json({ message: "Error recycling crew." });
        }
        return res.status(200).json({ message: `Crew for flight '${flightID}' recycled successfully.` });
    });
});

app.post("/retire_flight", (req, res) => {
    const { flightID } = req.body;

    if (!flightID || flightID.trim() === "") {
        return res.status(400).json({ message: "Flight ID is required and cannot be empty." });
    }

    db.query(`CALL retire_flight(?)`, [flightID], (err) => {
        if (err) {
            console.error("Database Query Error (POST /retire_flight):", err);
            return res.status(500).json({ message: "Error retiring flight." });
        }

        return res.status(200).json({ message: "Flight retired successfully!" });
    });
});





app.post("/simulation_cycle", (req, res) => {
    const q = `CALL simulation_cycle();`;
    db.query(q, (err) => {
        if (err) {
            console.error("Database Query Error (POST /simulation_cycle):", err);
            return res.status(500).json({ message: "Error executing simulation cycle." });
        }
        return res.status(200).json({ message: "Simulation cycle executed successfully." });
    });
});



const PORT = 8800;
app.listen(PORT, () => {
    console.log(`Backend server connected and listening on port ${PORT}!!`);
});