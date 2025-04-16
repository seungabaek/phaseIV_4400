import express from "express"
import mysql from "mysql"

const app = express()
const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"team19",
    database:"flight_tracking"
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err.message);
        return;
    }
    console.log("MySQL connected!");
})

app.get("/airplane", (req,res)=>{
    const q = "SELECT * FROM airplane";
    db.query(q,(err,data)=>{
        if(err) return res.json(err);
            return res.json(data);
    });
})

app.get("/",(req,res) =>{
    res.json("Dagmawi Begashaw  in all aspect");
});
app.listen(8800,()=>{
    console.log("Connected to backend!!");
});