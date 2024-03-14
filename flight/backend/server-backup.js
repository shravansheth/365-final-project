const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3001; // Make sure this port doesn't conflict with your React app's port

// Use CORS to allow your React app to communicate with this server
app.use(cors());

app.use(express.json());

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
        console.log(result)
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
    Airport AS DestinationAirport ON Flight.destination_airport_id = DestinationAirport.airport_id
WHERE DepartureAirport.airport_city = ?
    AND DestinationAirport.airport_city = ?
    AND DATE(Flight.scheduled_departure_time) = ?;
    `;
    console.log(formattedDate);
    db.query(query, [departureCity, destinationCity, formattedDate],
        (err, result) => {
        console.log(result)
        if (err) throw err;
        res.send(result);
    });

    // try {
    //     const result = await db.query(query, [departureCity, destinationCity, formattedDate]);
    //     console.log(result)
    //     res.send(result);
    // } catch (error) {
    //     console.error('Error fetching flights:', error);
    //     res.status(500).send('Internal Server Error');
    // }
});

//book flight, intserts into booking, baggage, and tickets
app.post('/book-flight', async (req, res) => {
    const { flightId, passengerName, fareClass, baggageType, numBags } = req.body;

    // Start a transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        // Step 1: Insert into Bookings Table
        const bookingQuery = `
            INSERT INTO Bookings (num_tickets, date_of_booking)
            VALUES (?, CURDATE());
        `;
        const [bookingResult] = await connection.query(bookingQuery, [1]); // Assuming 1 ticket per booking for simplicity
        const bookingId = bookingResult.insertId;

        // Step 2: Insert into Baggage Table - Adjusted to include baggageType and numBags
        const baggageQuery = `
            INSERT INTO Baggage (baggage_type, num_bags)
            VALUES (?, ?);
        `;
        const [baggageResult] = await connection.query(baggageQuery, [baggageType, numBags]);
        const baggageId = baggageResult.insertId;

        // Step 3: Insert into Tickets Table - Adjusted to include all required details
        // Ensure to retrieve the airlineId from the Flight table based on flightId
        const ticketQuery = `
            INSERT INTO Tickets (flight_id, airline_id, booking_id, baggage_id, passenger_name, fare_class)
            SELECT F.flight_id, F.airline_id, ?, ?, ?, ?
            FROM Flight F
            WHERE F.flight_id = ?;
        `;
        await connection.query(ticketQuery, [bookingId, baggageId, passengerName, fareClass, flightId]);

        // Commit the transaction
        await connection.commit();

        res.json({ success: true, message: "Booking successfully created.", bookingId, baggageId });
    } catch (error) {
        // Rollback the transaction in case of an error
        await connection.rollback();

        console.error('Error creating booking:', error);
        res.status(500).send('Failed to create booking.');
    } finally {
        // Release the connection back to the pool
        connection.release();
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

