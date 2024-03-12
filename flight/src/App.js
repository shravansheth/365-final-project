import logo from './logo.svg';
import './App.css';

fetch('http://localhost:3001/data')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));


function App() {
  return (
    <div className="App">
      <header className="bg-blue-500 text-white p-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">FlightBuddy</h1>
        </div>
      </header>
      <main>
        {/* Content and components will go here */}
        <p className="mt-4 text-center">
          Welcome to FlightBuddy. Your journey starts here.
        </p>
      </main>
    </div>
  );
}

export default App;
