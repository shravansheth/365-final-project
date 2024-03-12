const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3001; // Make sure this port doesn't conflict with your React app's port

// Use CORS to allow your React app to communicate with this server
app.use(cors());

// Create a connection to your SQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'shravann',
    database: 'FlightDatabase'
});

// Connect to the database
db.connect(err => {
    if (err) throw err;
    console.log('Connected to the database');
});

// Example route
app.get('/data', (req, res) => {
    db.query('SELECT * FROM Flight', (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

