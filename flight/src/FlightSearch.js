import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function SearchFlightForm() {
  const [SearchFlight, setSearchFlight] = useState({
      departureCity: "",
      destinationCity: "",
      date: new Date(),
  });
  const [searchResults, setSearchResults] = useState([]);

  const handleChange = (event) => {
      const { name, value } = event.target;
      setSearchFlight(prevState => ({
          ...prevState,
          [name]: value,
      }));
  };

  const handleDateChange = (date) => {
      setSearchFlight(prevState => ({
          ...prevState,
          date,
      }));
  };

  const submitForm = (event) => {
      event.preventDefault();

      const date = new Date(SearchFlight.date.setHours(0, 0, 0, 0));
    const adjustedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));

      const queryParams = new URLSearchParams({
          departureCity: SearchFlight.departureCity,
          destinationCity: SearchFlight.destinationCity,
          date: adjustedDate.toISOString().split('T')[0],
      });

      fetch(`http://localhost:3001/search-flights?${queryParams}`)
          .then(response => response.json())
          .then(data => {
              setSearchResults(data);
          })
          .catch(error => {
              console.error('Error:', error);
              // Handle error appropriately
          });
  };

  return (
      <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">Search Flights</h1>
          {/* Form */}
          <form className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg px-8 pt-6 pb-8" onSubmit={submitForm}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input fields with a two-column layout on medium screens and above */}
        <div className="mb-4">
          <label
            htmlFor="departureCity"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Departure City
          </label>
          <input
            type="text"
            name="departureCity"
            id="departureCity"
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="destinationCity"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Destination City
          </label>
          <input
            type="text"
            name="destinationCity"
            id="destinationCity"
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label
            htmlFor="date"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Date
          </label>
          <DatePicker
            selected={SearchFlight.date}
            onChange={handleDateChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            dateFormat="MMMM d, yyyy"
            required
          />
        </div>
      </div>
      <div className="flex justify-center mt-6">
        <button
          type="submit"
          className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition duration-150 ease-in-out"
        >
          Search
        </button>
      </div>
    </form>
    
          {/* Results Table */}
          {searchResults && (
  <div className="container mx-auto">
    <h1 className="text-3xl font-bold text-center my-6">Flight Search Results</h1>
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
          {searchResults.map((flight, index) => (
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={index}>
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
)}
      </div>
  );
}

export default SearchFlightForm;