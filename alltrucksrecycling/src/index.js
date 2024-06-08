import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import About from './About';
import Part from './part'; // Import the Part component
import Search from './search';
import Admin from './admin';
import Cart from './Cart';
import Success from './success';
import Cancel from './cancel';
import Ship from './shippingPage';
import {
  BrowserRouter as Router, // Import BrowserRouter and alias it as Router
  Route,
  Routes
} from "react-router-dom";

const router = (
  <Router> {/* Wrap your routes in the Router component */}
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/About" element={<About />} />
      <Route path="/part/:id" element={<Part />} /> {/* Route for the Part component */}
      <Route path="/search/:input" element={<Search />} /> {/* Route for the Part component */}
      <Route path="/admin" element={<Admin />} />
      <Route path="/shippingPage" element={<Ship />} />
      <Route path="/Cart" element={<Cart />} />
      <Route path="/success" element={<Success />} />
      <Route path="/cancel" element={<Cancel />} />
    </Routes>
  </Router>
);

ReactDOM.render(
  <React.StrictMode>
    {router} {/* Render the router */}
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
