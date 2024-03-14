import React, { useState } from 'react';

function BookFlightForm() {
  const [bookingDetails, setBookingDetails] = useState({
      flightId: '',
      passengerName: '',
      fareClass: 'Economy', // Default to Economy
  });
  const [bookingConfirmation, setBookingConfirmation] = useState(null);

  const handleChange = (event) => {
      const { name, value } = event.target;
      setBookingDetails(prevState => ({
          ...prevState,
          [name]: value,
      }));
  };

  const submitForm = (event) => {
      event.preventDefault();

      fetch('http://localhost:3001/book-flight', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingDetails),
      })
      .then(response => response.json())
      .then(data => {
          setBookingConfirmation(data); // Assuming your backend sends back some confirmation details
      })
      .catch(error => {
          console.error('Error:', error);
          setBookingConfirmation({ error: "Failed to book flight. Please try again." });
      });
  };

  return (
    <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-8 text-center">Book Flight</h1>
    <form className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 max-w-3xl mx-auto" onSubmit={submitForm}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Splitting into two columns on medium screens and above */}
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="flightId">
                    Flight ID
                </label>
                <input
                    type="text"
                    name="flightId"
                    id="flightId"
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                />
            </div>
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="passengerName">
                    Passenger Name
                </label>
                <input
                    type="text"
                    name="passengerName"
                    id="passengerName"
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                />
            </div>
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fareClass">
                    Fare Class
                </label>
                <select
                    name="fareClass"
                    id="fareClass"
                    onChange={handleChange}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="Economy">Economy</option>
                    <option value="Business">Business</option>
                </select>
            </div>
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="baggageType">
                    Baggage Type
                </label>
                <select
                    name="baggageType"
                    id="baggageType"
                    onChange={handleChange}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    required
                >
                    <option value="">Select Baggage Type</option>
                    <option value="Carry-On">Carry-On</option>
                    <option value="Checked">Checked</option>
                </select>
            </div>
            <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numBags">
                    Number of Bags
                </label>
                <input
                    type="number"
                    name="numBags"
                    id="numBags"
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full md:w-1/2 lg:w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={bookingDetails.numBags}
                    min="1"
                    required
                />
            </div>
        </div>
        <div className="flex justify-center mt-6">
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
            >
                Book
            </button>
        </div>
    </form>

    {bookingConfirmation && (
        <div className="mt-4 text-center">
            {bookingConfirmation.error ? (
                <p className="text-red-500">{bookingConfirmation.error}</p>
            ) : (
                <p className="text-green-500">Booking confirmed!</p>
            )}
        </div>
    )}
</div>
  );
}

export default BookFlightForm;
