import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import SearchFlightModal from "./SearchFlight.js";
import BookFlightModal from "./BookFlight.js";
import banner from "./flights2.jpg";
import ShowFlights from "./ShowAllFlights";
import FlightSearch from "./FlightSearch.js";
import BookFlightForm from "./BookFlightForm";

function NavigationButtons() {
  let navigate = useNavigate();


  return (
    <div className="flex space-x-4 mt-4 items-center justify-center">
      <button onClick={() => navigate('/')} 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Home
      </button>
      <button onClick={() => navigate('/search-flights')} 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Search Flights
      </button>
      <button onClick={() => navigate('/book-flight')} 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
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
          <img src={banner} alt="FlightBuddy Banner" className="w-screen h-auto mb-4" />
          <NavigationButtons />
          <div className="text-center mt-8 px-4">
            <h2 className="text-2xl font-semibold">Welcome to FlightBuddy!</h2>
            <p className="mt-4 text-lg">
              Your one-stop destination to check, book, and search flights. Whether you're planning a business trip or an adventure, FlightBuddy makes it easy to find the perfect flight.
            </p>
            <p className="mt-4 font-medium">This app is crafted with a React frontend and SQL backend, showcasing the seamless integration of modern web technologies.</p>
          </div>
        </main>
        <Routes>
          <Route path="/search-flights" element={<FlightSearch />} />
          <Route path="/book-flight" element={<BookFlightForm />} />
          <Route path="/show-flights" element={<ShowFlights />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

