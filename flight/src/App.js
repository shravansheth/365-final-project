import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import SearchFlightModal from "./SearchFlight.js";
import BookFlightModal from "./BookFlight.js";
import banner from "./flights.jpg";
import ShowFlights from "./ShowAllFlights";
import FlightSearch from "./FlightSearch.js";

// fetch('http://localhost:3001/data')
//     .then(response => response.json())
//     .then(data => console.log(data))
//     .catch(error => console.error('Error:', error));

// Dummy components for route targets
const SearchFlights = () => 
<div className="container mx-auto">
<h1 className="text-3xl font-bold">Search Flights</h1>
</div>;
const BookFlights = () => 
<div className="container mx-auto">
<h1 className="text-3xl font-bold text-center my-6">Book Flight</h1>

</div>;
{/*  const ShowFlights = () => <div className="container mx-auto">
 <h1 className="text-3xl font-bold">Show All Flights</h1>
 </div>;; */}

function NavigationButtons() {
  let navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  // const [searchResults, setSearchResults] = useState([]);


  return (
    <div className="flex space-x-4 mt-4 items-center justify-center">
      {/* <SearchFlightModal isOpen={showModal} setShowModal={setShowModal}/> */}
      <BookFlightModal isOpen={showBookModal} setShowBookModal={setShowBookModal}/>
      {/* <button
                            type="button"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => {
                                setShowModal(true);
                            }}
                        >
                          Search Flight
                        </button> */}
      <button onClick={() => navigate('/search-flights')} 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Search Flights
      </button>
      <button
                            type="button"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => {
                                setShowBookModal(true);
                            }}
                        >
                          Book Flight
                        </button>

      <button onClick={() => navigate('/show-flights')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Show All Flights
      </button>
    </div>
  );
}
    
function App() {

  const [searchResult, setSearchResult] = useState(null);

  const handleSearchResult = (results) => {
    setSearchResult(results);
  };
  
  return (
    
    <Router>
      <div className="App">
        <header className="bg-gray-500 text-white p-6">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold">FlightBuddy</h1>
            <p className="mt-4 text-white text-center">
            Welcome to FlightBuddy. Your journey starts here.
          </p>
          </div>
        </header>
        <main>
        <img src={banner} alt="FlightBuddy Banner" className="w-auto h-full mb-4" />
          
          <NavigationButtons />

        {searchResult && (
        <div className="container mx-auto">
          <SearchFlightModal onSearchResults={handleSearchResult} />
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
                {searchResult.map((flight, index) => (
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
        </main>
        <Routes>
          <Route path="/search-flights" element={<FlightSearch />} />
          <Route path="/book-flights" element={<BookFlights />} />
          <Route path="/show-flights" element={<ShowFlights />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

