import React, { useState } from "react";

interface BookFlightModalProps {
    isOpen: boolean;
    setShowBookModal: (isOpen: boolean) => void;
}

const BookFlightModal: React.FC<BookFlightModalProps> = ({
    isOpen,
    setShowBookModal,
}) => {
    const [flightBook, setFlightBook] = useState({
        flightid: "",
        passengername: "",
        farclass: "",
    });

    if (!isOpen) return null;

    function handleChange(event) {
        const { name, value } = event.target;
        setFlightBook(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }

    async function submitForm(event) {
        
        event.preventDefault();
        console.log(flightBook);
        // Here, you would usually make a fetch/axios request to your backend to Book for flights.
    }

    return (
        <>
            <div
                className="fixed inset-0 bg-black z-40 opacity-75"
                onClick={() => setShowBookModal(false)}
            ></div>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                    {/* Content */}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {/* Header */}
                        <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                            <h3 className="text-3xl font-semibold">Book Flight</h3>
                            <button
                                className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                onClick={() => setShowBookModal(false)}
                            >
                                <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
                            </button>
                        </div>
                        {/* Body */}
                        <form className="px-12 py-8" onSubmit={submitForm}>
                            <div className="mb-4">
                                <label
                                    htmlFor="flightid"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Flight ID
                                </label>
                                <input
                                    type="text"
                                    name="flightId"
                                    id="flightid"
                                    onChange={handleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="passengername"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Passenger Name
                                </label>
                                <input
                                    type="text"
                                    name="passengername"
                                    id="passengername"
                                    onChange={handleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="fareclass"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Fare Class
                                </label>
                                <input
                                    type="text"
                                    name="fareclass"
                                    id="fareclass"
                                    onChange={handleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                            >
                                Book
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookFlightModal;
