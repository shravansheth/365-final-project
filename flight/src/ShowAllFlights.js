import React, { useState, useEffect } from 'react';

const ShowFlights = () => {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/data')
      .then((response) => response.json())
      .then((data) => setFlights(data))
      .catch((error) => console.error('Error:', error));
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center my-6">Show All Flights</h1>
      <div className="overflow-x-auto relative">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-6">Flight ID</th>
              <th scope="col" className="py-3 px-6">Airline Name</th>
              <th scope="col" className="py-3 px-6">Departure City</th>
              <th scope="col" className="py-3 px-6">Destination City</th>
              <th scope="col" className="py-3 px-6">Departure Time</th>
              <th scope="col" className="py-3 px-6">Arrival Time</th>
              <th scope="col" className="py-3 px-6">Status</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight) => (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={flight.FlightID}>
                <td className="py-4 px-6">{flight.FlightID}</td>
                <td className="py-4 px-6">{flight.AirlineName}</td>
                <td className="py-4 px-6">{flight.DepartureCity}</td>
                <td className="py-4 px-6">{flight.DestinationCity}</td>
                <td className="py-4 px-6">{new Date(flight.ScheduledDepartureTime).toLocaleString()}</td>
                <td className="py-4 px-6">{new Date(flight.ScheduledArrivalTime).toLocaleString()}</td>
                <td className="py-4 px-6">{flight.FlightStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShowFlights;
