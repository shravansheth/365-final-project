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



// All flights
app.get('/data', (req, res) => {
    db.query(`
    SELECT 
    Flight.flight_id AS FlightID,
    Airline.airline_name AS AirlineName,
    DepartureAirport.airport_city AS DepartureCity,
    DestinationAirport.airport_city AS DestinationCity,
    Flight.scheduled_departure_time AS ScheduledDepartureTime,
    Flight.scheduled_arrival_time AS ScheduledArrivalTime,
    Flight.flight_status AS FlightStatus
FROM 
    Flight
JOIN 
    Airline ON Flight.airline_id = Airline.airline_id
JOIN 
    Airport AS DepartureAirport ON Flight.departure_airport_id = DepartureAirport.airport_id
JOIN 
    Airport AS DestinationAirport ON Flight.destination_airport_id = DestinationAirport.airport_id;`, 
    (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// Search Flights
app.get('/search-flights', async (req, res) => {
    const { departureCity, destinationCity, date } = req.query;

    // Format date to match SQL's DATE format (YYYY-MM-DD)
    const formattedDate = new Date(date).toISOString().split('T')[0];

    // Assuming you're using a library like mysql2 or similar for SQL operations
    const query = `
    SELECT 
    Flight.flight_id AS FlightID,
    Airline.airline_name AS AirlineName,
    DepartureAirport.airport_city AS DepartureCity,
    DestinationAirport.airport_city AS DestinationCity,
    Flight.scheduled_departure_time AS ScheduledDepartureTime,
    Flight.scheduled_arrival_time AS ScheduledArrivalTime,
    Flight.flight_status AS FlightStatus
FROM 
    Flight
JOIN 
    Airline ON Flight.airline_id = Airline.airline_id
JOIN 
    Airport AS DepartureAirport ON Flight.departure_airport_id = DepartureAirport.airport_id
JOIN 
    Airport AS DestinationAirport ON Flight.destination_airport_id = DestinationAirport.airport_id;
WHERE DepartureAirport.airport_city = ?
    AND DestinationAirport.airport_city = ?
    AND DATE(Flight.scheduled_departure_time) = ?
    `;

    try {
        const results = await db.query(query, [departureCity, destinationCity, formattedDate]);
        res.json(results);
    } catch (error) {
        console.error('Error fetching flights:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

