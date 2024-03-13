import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface SearchFlightModalProps {
    isOpen: boolean;
    setShowModal: (isOpen: boolean) => void;
    onSearchResults: (results: any) => void;
}

const SearchFlightModal: React.FC<SearchFlightModalProps> = ({
    isOpen,
    setShowModal,
    onSearchResults
}) => {
    const [flightSearch, setFlightSearch] = useState({
        departureCity: "",
        destinationCity: "",
        date: new Date(),
    });

    const [searchResult, setSearchResult] = useState([]);
    

    if (!isOpen) return null;

    function handleChange(event) {
        const { name, value } = event.target;
        setFlightSearch(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }

    function handleDateChange(date: Date) {
        setFlightSearch(prevState => ({
            ...prevState,
            date,
        }));
    }

    // async function submitForm(event) {
    //     event.preventDefault();
    //     console.log(flightSearch);
    //     setShowModal(false);
    // }

    function submitForm(event) {
    event.preventDefault();

    const date = new Date(flightSearch.date.setHours(0, 0, 0, 0));
    const adjustedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    
    const queryParams = new URLSearchParams({
        departureCity: flightSearch.departureCity,
        destinationCity: flightSearch.destinationCity,
        date: adjustedDate.toISOString().split('T')[0],
    });

    fetch(`http://localhost:3001/search-flights?${queryParams}`)
        .then(response => {
            console.log(response); // Log the raw response
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Log the data
            if (data.length > 0) {
                setSearchResult(JSON.stringify(data, null, 2));
                onSearchResults(data); // Call the callback with the search results
              } else {
                throw new Error("No such flights found.");
              }
            })
        .catch(error => {
            console.error('Error:', error);
            setSearchResult("Failed to search for flights. Please try again.");
        })
        .finally(() => {
            setShowModal(false);
        });
}



    return (
        <>
            <div
                className="fixed inset-0 bg-black z-40 opacity-75"
                onClick={() => setShowModal(false)}
            ></div>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                    {/* Content */}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {/* Header */}
                        <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                            <h3 className="text-3xl font-semibold">Search Flight</h3>
                            <button
                                className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                onClick={() => setShowModal(false)}
                            >
                                <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
                            </button>
                        </div>
                        {/* Body */}
                        <form className="px-12 py-8" onSubmit={submitForm}>
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
                            <div className="mb-4">
                                <label
                                    htmlFor="date"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Date
                                </label>
                                <DatePicker
                                    selected={flightSearch.date}
                                    onChange={handleDateChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    dateFormat="MMMM d, yyyy"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                            >
                                Search
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            {searchResult && (
            <div
                style={{ position: 'fixed', bottom: '10px', left: '10px', backgroundColor: 'white', padding: '10px', border: '1px solid black' }}
            >
                <p>Search Results:</p>
                <pre>{JSON.stringify(searchResult, null, 2)}</pre>
            </div>
        )}
        </>
    );
};

export default SearchFlightModal;
