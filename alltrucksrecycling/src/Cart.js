import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useParams } from 'react-router-dom';
import './cart.css';
import axios from 'axios';
import {loadStripe} from '@stripe/stripe-js';
function Cart() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setZipcode] = useState('');

  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  useEffect(() => {
    setCart(cartItems);
    console.log(cartItems);
    calculateTotalPrice(cartItems);
  }, []);
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedEmail = localStorage.getItem('email');
    if (token && storedEmail) {
      setIsLoggedIn(true);
      setEmail(storedEmail);
    }
  }, []);


  const handleRemove = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateTotalPrice(updatedCart);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert("Please enter a search query");
    } else {
      navigate(`/search/${searchQuery}`);
    }
  };

  const calculateTotalPrice = (cartItems) => {
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);
    setTotalPrice(total);
  };
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const openDialog = (dialogId) => {
    document.getElementById(dialogId).showModal();
  };

  const closeDialog = (dialogId) => {
    document.getElementById(dialogId).close();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/users/login", { email, password });
      if (response.status === 200) {
        setIsLoggedIn(true);
        console.log("Login successful");
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('email', email);
          openDialog('profileDialog');
          closeDialog('profileDialog');
      } else {
        console.log("Login failed");
        openDialog('errorDialogLogin');
      }
    } catch (error) {
      console.error(error);
      openDialog('errorDialogLogin');
    }
  };

  const handleCreateAccount = () => {
    closeDialog('profileDialog'); // Close login dialog
    openDialog('createAccountDialog'); // Open account creation dialog
  };

  const handleAccountCreation = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/users", { email, password });
      if (response.status === 201) {
        openDialog('successDialog'); // Open success dialog
        closeDialog('createAccountDialog'); // Close create account dialog
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('email', email);
      } else {
        openDialog('errorDialog'); // Open error dialog
      }
    } catch (error) {
      console.error(error);
      openDialog('errorDialog'); // Open error dialog
    }
  };
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleStateChange = (e) => {
    setState(e.target.value);
  };

  const handleZipcodeChange = (e) => {
    setZipcode(e.target.value);
  };

  

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
    closeDialog('profileDialog');
    localStorage.removeItem('token');
  };
  const makePayment = async () => {
    // Check if all address components are provided
    if (!address.trim() || !city.trim() || !state.trim() || !zipcode.trim()) {
      alert('Please enter all shipping address details.');
      return; // Stop execution if any component is missing
    }
  
    // Concatenate the address components into one string
    const fullAddress = `${address}, ${city}, ${state} ${zipcode}`;
    console.log(fullAddress);
    // Store the full address in local storage
    localStorage.setItem('fullAddress', fullAddress);
  
    if (isLoggedIn) {
      try {
        const stripe = await loadStripe("pk_test_51POOu5DA12VOJZ8ODzkTH9WTd3M3RBa7OUMvQrOXJOIXFuZAl59m5AS9cunxJvyYrO4bgAZATeNvfhBPZAmEvDW300hPWq1Wx2");
        const body = {
          products: cart // make sure 'cart' contains the items
        };
        const headers = {
          "Content-Type": "application/json"
        };
        const response = await fetch('http://localhost:5000/create-checkout-session', {
          method: "POST",
          headers: headers,
          body: JSON.stringify(body)
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const session = await response.json();
        const result = stripe.redirectToCheckout({
          sessionId: session.id
        });
  
        if (result.error) {
          console.log(result.error.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      openDialog('notLoggedDialog');
    }
  };
  
  
  
  return (
    <div className="cart-page">
      <div className="Header">
        <a className="nav-bar-link" href="/">
          <p><img className="logo" src="\img\Logo.png" alt="Logo" /></p>
        </a>
        <div className="search-container">
          <button type="search" onClick={handleSearch}>Search</button>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="Icons">
          <div className='Profile'>
            <p onClick={() => openDialog('profileDialog')}>
              <img className="logo" src="img/profile.png" alt="Profile" />
            </p>
          </div>
          <div className='Cart'>
            <a href="/Cart">
              <p>
                <img className="logo" src="/img/cart.png" alt="Cart" />
              </p>
            </a>
          </div>
        </div>
      </div>
      
      <dialog id="profileDialog">
        <h2>Profile</h2>
        {isLoggedIn ? (
          <div className="alreadyLoggedin">
            <p>{email}</p>
            <button type="button" onClick={handleLogout}>Sign Out</button>
            <button type="button" onClick={() => closeDialog('profileDialog')}>Close</button>
          </div>
        ) : (
          <form className="profile-form" onSubmit={handleLogin}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
            <button type="button" onClick={handleCreateAccount}>Create Account</button>
            <button type="button" onClick={() => closeDialog('profileDialog')}>Close</button>
          </form>
        )}
        {message && <p>{message}</p>}
      </dialog>
      {/* Account Creation Dialog */}
      <dialog id="createAccountDialog">
        <h2>Create Account</h2>
        <form className="profile-form" onSubmit={handleAccountCreation}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Create Account</button>
          <button type="button" onClick={() => closeDialog('createAccountDialog')}>Close</button>
        </form>
      </dialog>

      {/* Error Dialog */}
      <dialog id="errorDialog">
        <h2>Error</h2>
        <p>Account creation failed.</p>
        <button onClick={() => closeDialog('errorDialog')}>Close</button>
      </dialog>

      {/* Error Dialog for Login */}
      <dialog id="errorDialogLogin">
        <h2>Error</h2>
        <p>Login failed.</p>
        <button onClick={() => closeDialog('errorDialogLogin')}>Close</button>
      </dialog>

      {/* Success Dialog */}
      <dialog id="successDialog">
        <h2>Success</h2>
        <p>Account created successfully.</p>
        <button onClick={() => closeDialog('successDialog')}>Close</button>
      </dialog>
      <dialog id="notLoggedDialog">
        <h2>Not Logged In</h2>
        <p>Log in to Checkout.</p>
        <button onClick={() => closeDialog('notLoggedDialog')}>Close</button>
      </dialog>
      <div className="Cart-section">
        <div className="yourcart">
          <h1>Your Cart</h1>
        </div>
        {cart.length > 0 ? (
          <div className="items">
            {cart.map((part, index) => (
              <div key={index} className="car-part-card">
                 <Link to={`/part/${part._id}`}>
                <img src={part.imageUrl} alt={part.name} />
                <h2>{part.carYear} {part.carMake} {part.carModel}</h2>
                <h2>{part.name}</h2>
                <p>{part.description}</p>
                <p>Price: ${part.price}</p>
                </Link>
                <button onClick={() => handleRemove(index)} className="remove-from-cart-button">Remove</button>
              </div>
            ))}
          </div>
        ) : (
          <p>Your cart is empty</p>
        )}
          <div className="shipping-details">
          <h2>Shipping Details</h2>
          <div className="input-group big">
        <label htmlFor="address">Street Address:</label>
        <input
          type="text"
          id="address"
          name="address"
          value={address}
          onChange={handleAddressChange}
          placeholder="Street Address"
          required
        />
      </div>
      <div className="input-group small">
        <label htmlFor="city">City:</label>
        <input
          type="text"
          id="city"
          name="city"
          value={city}
          onChange={handleCityChange}
          placeholder="City"
          required
        />
      </div>
      <div className="input-group small">
        <label htmlFor="state">State:</label>
        <input
          type="text"
          id="state"
          name="state"
          value={state}
          onChange={handleStateChange}
          placeholder="State"
          required
        />
      </div>
      <div className="input-group small">
        <label htmlFor="zipcode">Zip Code:</label>
        <input
          type="text"
          id="zipcode"
          name="zipcode"
          value={zipcode}
          onChange={handleZipcodeChange}
          placeholder="Zip Code"
          required
        />
      </div>
          <div className="input-group big">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
        </div>
        <button type="submit" onClick={makePayment}>Confirm Payment</button>
      </div>
          

      <footer>
        <div className="container">
          <p>
            11407 Elks Cir, Rancho Cordova, CA 95742
            <br />
            +1(916) 638-3500
            <br />
          </p>
          <div className="footer-right">
            <a className="nav-bar-link" href="https://www.yelp.com/biz/all-trucks-recycling-rancho-cordova">
              <p>
                <img src="Icons\iconsYelp.png" alt="Yelp" />
              </p>
            </a>
            <a className="nav-bar-link" href="https://www.facebook.com/alltrucksrecycling/">
              <p>
                <img src="Icons\iconsFacebook.png" alt="Facebook" />
              </p>
            </a>
            <a className="nav-bar-link" href="https://www.google.com/maps/place/All+Trucks+Recycling/@38.5671157,-121.2559699,16z/data=!3m1!4b1!4m6!3m5!1s0x809ae81a3a571c01:0x9506e53facea0ca4!8m2!3d38.5671157!4d-121.253395!16s%2Fg%2F1tcv6krz?entry=ttu">
              <p>
                <img src="Icons\iconsGoogle.png" alt="Google" />
              </p>
            </a>
          </div>
        </div>
        <footer className="map-footer">
          <div className="container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12478.211261145601!2d-121.26369468261721!3d38.567115699999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x809ae81a3a571c01%3A0x9506e53facea0ca4!2sAll%20Trucks%20Recycling!5e0!3m2!1sen!2sus!4v1716947188439!5m2!1sen!2sus"
              width="900"
              height="200"
              style={{ border: '1px solid #ccc', borderRadius: '10px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="footer-right">
              <p>
                Monday 8:00 am - 5:00 pm
                <br />
                Tuesday 8:00 am - 5:00 pm
                <br />
                Wednesday 8:00 am - 5:00 pm
                <br />
                Thursday 8:00 am - 5:00 pm
                <br />
                Friday 8:00 am - 5:00 pm
                <br />
                Saturday 9:00 am - 4:00 pm
                <br />
                Sunday Closed
              </p>
            </div>
          </div>
        </footer>
      </footer>
    </div>
  );
}

export default Cart;
