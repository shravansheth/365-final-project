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

// // Search Flights
// app.get('/search-flights', async (req, res) => {
//     const { departureCity, destinationCity, date } = req.query;

//     // Format date to match SQL's DATE format (YYYY-MM-DD)
//     const formattedDate = new Date(date).toISOString().split('T')[0];

//     // Assuming you're using a library like mysql2 or similar for SQL operations
//     const query = `
//     SELECT 
//     Flight.flight_id AS FlightID,
//     Airline.airline_name AS AirlineName,
//     DepartureAirport.airport_city AS DepartureCity,
//     DestinationAirport.airport_city AS DestinationCity,
//     Flight.scheduled_departure_time AS ScheduledDepartureTime,
//     Flight.scheduled_arrival_time AS ScheduledArrivalTime,
//     Flight.flight_status AS FlightStatus
// FROM 
//     Flight
// JOIN 
//     Airline ON Flight.airline_id = Airline.airline_id
// JOIN 
//     Airport AS DepartureAirport ON Flight.departure_airport_id = DepartureAirport.airport_id
// JOIN 
//     Airport AS DestinationAirport ON Flight.destination_airport_id = DestinationAirport.airport_id
// WHERE DepartureAirport.airport_city = ?
//     AND DestinationAirport.airport_city = ?
//     AND DATE(Flight.scheduled_departure_time) = ?;
//     `;
//     //console.log(formattedDate);
//     db.query(query, [departureCity, destinationCity, formattedDate],
//         (err, result) => {
//         console.log(result)
//         if (err) throw err;
//         res.send(result);
        
//     });
// });

app.get('/search-flights', (req, res) => {
    const { departureCity, destinationCity, date } = req.query;

    // Format date to match SQL's DATE format (YYYY-MM-DD)
    const formattedDate = new Date(date).toISOString().split('T')[0];

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
    WHERE 
        DepartureAirport.airport_city = ?
        AND DestinationAirport.airport_city = ?
        AND DATE(Flight.scheduled_departure_time) = ?;
    `;

    db.query(query, [departureCity, destinationCity, formattedDate], (err, results) => {
        if (err) {
            console.error('Error fetching flights:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length === 0) {
            // No flights found
            return res.json({ message: "No such flights found." });
        }

        // Flights found
        res.json(results);
    });
});

// //book flight, intserts into booking, baggage, and tickets
// app.post('/book-flight', async (req, res) => {
//     const { flightId, passengerName, fareClass, baggageType, numBags } = req.body;

//     // Start a transaction
//     const connection = await db.getConnection();
//     await connection.beginTransaction();

//     try {
//         // Step 1: Insert into Bookings Table
//         const bookingQuery = `
//             INSERT INTO Bookings (num_tickets, date_of_booking)
//             VALUES (?, CURDATE());
//         `;
//         const [bookingResult] = await connection.query(bookingQuery, [1]); // Assuming 1 ticket per booking for simplicity
//         const bookingId = bookingResult.insertId;

//         // Step 2: Insert into Baggage Table - Adjusted to include baggageType and numBags
//         const baggageQuery = `
//             INSERT INTO Baggage (baggage_type, num_bags)
//             VALUES (?, ?);
//         `;
//         const [baggageResult] = await connection.query(baggageQuery, [baggageType, numBags]);
//         const baggageId = baggageResult.insertId;

//         // Step 3: Insert into Tickets Table - Adjusted to include all required details
//         // Ensure to retrieve the airlineId from the Flight table based on flightId
//         const ticketQuery = `
//             INSERT INTO Tickets (flight_id, airline_id, booking_id, baggage_id, passenger_name, fare_class)
//             SELECT F.flight_id, F.airline_id, ?, ?, ?, ?
//             FROM Flight F
//             WHERE F.flight_id = ?;
//         `;
//         await connection.query(ticketQuery, [bookingId, baggageId, passengerName, fareClass, flightId]);

//         // Commit the transaction
//         await connection.commit();

//         res.json({ success: true, message: "Booking successfully created.", bookingId, baggageId });
//     } catch (error) {
//         // Rollback the transaction in case of an error
//         await connection.rollback();

//         console.error('Error creating booking:', error);
//         res.status(500).send('Failed to create booking.');
//     } finally {
//         // Release the connection back to the pool
//         connection.release();
//     }
// });

// app.post('/book-flight', (req, res) => {
//     const { flightId, passengerName, fareClass, baggageType, numBags } = req.body;
//     console.log(req.body);

//     db.beginTransaction((err) => {
//         if (err) { throw err; }

//         // Step 1: Insert into Bookings Table
//         db.query(
//             'INSERT INTO Booking (num_tickets, date_of_booking) VALUES (?, CURDATE())', 
//             [1], 
//             (err, bookingResult) => {
//                 if (err) {
//                     return db.rollback(() => { throw err; });
//                 }

//                 const bookingId = bookingResult.insertId;

//                 // Step 2: Insert into Baggage Table
//                 db.query(
//                     'INSERT INTO Baggage (baggage_type, num_of_bags) VALUES (?, ?)', 
//                     [baggageType, numBags], 
//                     (err, baggageResult) => {
//                         if (err) {
//                             return db.rollback(() => { throw err; });
//                         }

//                         const baggageId = baggageResult.insertId;

//                         // Step 3: Insert into Tickets Table
//                         db.query(
//                             `INSERT INTO Tickets (flight_id, booking_id, baggage_id, passenger_name, fare_class) 
//                             SELECT ?, ?, ?, ?, ? FROM Flight F WHERE flight_id = ?`, 
//                             [flightId, bookingId, baggageId, passengerName, fareClass, flightId], 
//                             (err, ticketResult) => {
//                                 if (err) {
//                                     return db.rollback(() => { throw err; });
//                                 }

//                                 db.commit((err) => {
//                                     if (err) {
//                                         return db.rollback(() => { throw err; });
//                                     }

//                                     //res.json({ success: true, message: "Booking successfully created." });
//                                     res.json({ success: true, message: "Booking successfully created.", bookingId, baggageId });
//                                 });
//                             }
//                         );
//                     }
//                 );
//             }
//         );
//     });
// });

app.post('/book-flight', (req, res) => {
    const { flightId, passengerName, fareClass, baggageType, numBags } = req.body;

    db.beginTransaction((err) => {
        if (err) { throw err; }

        // Preliminary check: Verify flightId exists in Flight table
        db.query('SELECT flight_id FROM Flight WHERE flight_id = ?', [flightId], (err, flightResults) => {
            if (err) {
                return db.rollback(() => { throw err; });
            }

            // If flightId does not exist, end transaction and return error
            if (flightResults.length === 0) {
                db.rollback(() => {
                    res.status(400).json({ success: false, message: "Invalid flight ID." });
                });
                return; // Exit the transaction flow
            }

            // Proceed with the rest of the booking process since flightId is valid

            // Step 1: Insert into Booking Table
            db.query('INSERT INTO Booking (num_tickets, date_of_booking) VALUES (?, CURDATE())', [1], (err, bookingResult) => {
                if (err) {
                    return db.rollback(() => { throw err; });
                }

                const bookingId = bookingResult.insertId;

                // Step 2: Insert into Baggage Table
                db.query('INSERT INTO Baggage (baggage_type, num_of_bags) VALUES (?, ?)', [baggageType, numBags], (err, baggageResult) => {
                    if (err) {
                        return db.rollback(() => { throw err; });
                    }

                    const baggageId = baggageResult.insertId;

                    // Step 3: Insert into Tickets Table
                    db.query(`INSERT INTO Tickets (flight_id, booking_id, baggage_id, passenger_name, fare_class) 
                              SELECT ?, ?, ?, ?, ? FROM Flight WHERE flight_id = ?`,
                    [flightId, bookingId, baggageId, passengerName, fareClass, flightId], (err, ticketResult) => {
                        if (err) {
                            return db.rollback(() => { throw err; });
                        }

                        db.commit((err) => {
                            if (err) {
                                return db.rollback(() => { throw err; });
                            }

                            res.json({ success: true, message: "Booking successfully created.", bookingId, baggageId });
                        });
                    });
                });
            });
        });
    });
});



app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

