import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useParams } from 'react-router-dom';
import './cart.css';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

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
    checkPartsAvailability(cartItems);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedEmail = localStorage.getItem('email');
    if (token && storedEmail) {
      setIsLoggedIn(true);
      setEmail(storedEmail);
    }
  }, []);

  const checkPartsAvailability = async (cartItems) => {
    try {
      const response = await axios.post('https://alltruckrecycle.onrender.com/api/checkParts', { cartItems });
      const availableParts = response.data.availableParts;
      const updatedCart = cartItems.filter(part => availableParts.includes(part._id));
      
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      calculateTotalPrice(updatedCart);
    } catch (error) {
      console.error('Error checking parts availability:', error);
    }
  };

  const handleRemove = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateTotalPrice(updatedCart);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert('Please enter a search query');
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
      const response = await axios.post('https://alltruckrecycle.onrender.com/api/users/login', { email, password });
      if (response.status === 200) {
        setIsLoggedIn(true);
        console.log('Login successful');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('email', email);
        openDialog('profileDialog');
        closeDialog('profileDialog');
      } else {
        console.log('Login failed');
        openDialog('errorDialogLogin');
      }
    } catch (error) {
      console.error(error);
      openDialog('errorDialogLogin');
    }
  };

  const handleCreateAccount = () => {
    closeDialog('profileDialog');
    openDialog('createAccountDialog');
  };

  const handleAccountCreation = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://alltruckrecycle.onrender.com/api/users', { email, password });
      if (response.status === 201) {
        openDialog('successDialog');
        closeDialog('createAccountDialog');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('email', email);
      } else {
        openDialog('errorDialog');
      }
    } catch (error) {
      console.error(error);
      openDialog('errorDialog');
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
    if (!address.trim() || !city.trim() || !state.trim() || !zipcode.trim()) {
      alert('Please enter all shipping address details.');
      return;
    }

    const fullAddress = `${address}, ${city}, ${state} ${zipcode}`;
    console.log(fullAddress);
    localStorage.setItem('fullAddress', fullAddress);

    if (isLoggedIn) {
      try {
        const stripe = await loadStripe('pk_test_51POOu5DA12VOJZ8ODzkTH9WTd3M3RBa7OUMvQrOXJOIXFuZAl59m5AS9cunxJvyYrO4bgAZATeNvfhBPZAmEvDW300hPWq1Wx2');
        const body = {
          products: cart,
        };
        const headers = {
          'Content-Type': 'application/json',
        };
        const response = await fetch('https://alltruckrecycle.onrender.com/create-checkout-session', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const session = await response.json();
        const result = stripe.redirectToCheckout({
          sessionId: session.id,
        });

        if (result.error) {
          console.log(result.error.message);
        }
      } catch (error) {
        console.error('Error:', error);
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
          <div className="Profile">
            <p onClick={() => openDialog('profileDialog')}>
              <img className="logo" src="img/profile.png" alt="Profile" />
            </p>
          </div>
          <div className="Cart">
            <Link to="/Cart">
              <p>
                <img className="logo" src="/img/cart.png" alt="Cart" />
              </p>
            </Link>
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

      <dialog id="createAccountDialog">
        <h2>Create Account</h2>
        <form className="profile-form" onSubmit={handleAccountCreation}>
          <label htmlFor="createEmail">Email:</label>
          <input
            type="email"
            id="createEmail"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="createPassword">Password:</label>
          <input
            type="password"
            id="createPassword"
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

      <dialog id="errorDialog">
        <h2>Error</h2>
        <p>Email already exists. Please login or use another email.</p>
        <button type="button" onClick={() => closeDialog('errorDialog')}>Close</button>
      </dialog>

      <dialog id="errorDialogLogin">
        <h2>Error</h2>
        <p>Login failed. Please check your credentials and try again.</p>
        <button type="button" onClick={() => closeDialog('errorDialogLogin')}>Close</button>
      </dialog>

      <dialog id="notLoggedDialog">
        <h2>Not Logged In</h2>
        <p>Please log in to complete your purchase.</p>
        <button type="button" onClick={() => closeDialog('notLoggedDialog')}>Close</button>
      </dialog>

      <dialog id="successDialog">
        <h2>Success</h2>
        <p>Account created successfully. You are now logged in.</p>
        <button type="button" onClick={() => closeDialog('successDialog')}>Close</button>
      </dialog>

      <h1>Shopping Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cart.map((part, index) => (
            <div key={index} className="cart-item">
              <div className="part-image">
                <img src={part.image} alt={part.name} />
              </div>
              <div className="part-details">
                <p>{part.name}</p>
                <p>Price: ${part.price}</p>
              </div>
              <button type="button" onClick={() => handleRemove(index)}>
                Remove
              </button>
            </div>
          ))}
          <div className="total-price">Total Price: ${totalPrice}</div>
          <div className="shipping-form">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={address}
              onChange={handleAddressChange}
              required
            />
            <label htmlFor="city">City:</label>
            <input
              type="text"
              id="city"
              name="city"
              value={city}
              onChange={handleCityChange}
              required
            />
            <label htmlFor="state">State:</label>
            <input
              type="text"
              id="state"
              name="state"
              value={state}
              onChange={handleStateChange}
              required
            />
            <label htmlFor="zipcode">Zip Code:</label>
            <input
              type="text"
              id="zipcode"
              name="zipcode"
              value={zipcode}
              onChange={handleZipcodeChange}
              required
            />
          </div>
          <button type="button" onClick={makePayment}>Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
}

export default Cart;
