import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useParams } from 'react-router-dom';
import './part.css';

function PartDetail() {
  const { id } = useParams();
  const [part, setPart] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isInCart, setIsInCart] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedEmail = localStorage.getItem('email');
    if (token && storedEmail) {
      setIsLoggedIn(true);
      setEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    axios.get(`https://alltruckrecycle.onrender.com/api/items/${id}`)
      .then(response => {
        setPart(response.data);
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
      const partInCart = cartItems.find(item => item._id === id);
      setIsInCart(!!partInCart); // Update isInCart based on whether the part is in the cart

      })
      .catch(error => console.error(error));
  }, [id]);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert("Please enter a search query");
    } else {
      navigate(`/search/${searchQuery}`);
    }
  };

  if (!part) {
    return <div>Loading...</div>;
  }

  const openDialog = (dialogId) => {
    document.getElementById(dialogId).showModal();
  };

  const closeDialog = (dialogId) => {
    document.getElementById(dialogId).close();
  };
  

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://alltruckrecycle.onrender.com/api/users/login", { email, password });
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
      const response = await axios.post("https://alltruckrecycle.onrender.com/api/users", { email, password });
      if (response.status === 201) {
        openDialog('successDialog'); // Open success dialog
        closeDialog('createAccountDialog'); // Close create account dialog
      } else {
        openDialog('errorDialog'); // Open error dialog
      }
    } catch (error) {
      console.error(error);
      openDialog('errorDialog'); // Open error dialog
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
    closeDialog('profileDialog');
    localStorage.removeItem('token');
  };

 
 const addToCart = () => {
  let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  cartItems.push(part);
  localStorage.setItem('cart', JSON.stringify(cartItems));
  setIsInCart(true);
};

const removeFromCart = () => {
  let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  cartItems = cartItems.filter(item => item._id !== id);
  localStorage.setItem('cart', JSON.stringify(cartItems));
  setIsInCart(false);
};

 
  return (
    <div>
      <div className="Header">
        <a className="nav-bar-link" href="/">
        <p className="logo">
            <img className="logo" src="img/Logo.png" alt="Logo" />
          </p>
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
              <img className="logo" src="/img/profile.png" alt="Profile" />
            </p>
          </div>
          <div className='Cart'>
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
      <div className="MainSection">
        <div className="ImageHolder">
        <img src={`https://alltruckrecycling.s3.us-east-2.amazonaws.com/${part.imageUrl}`}  alt={part.name} />
        </div>
        <div className="RightSide">
          <h1>{part.name}</h1>
          <p>Description: {part.description}</p>
          <div className="PriceSection">
            <p>Price: ${part.price}</p>
            <button
              className={`CartButton ${isInCart ? 'RemoveButton' : ''}`}
              onClick={isInCart ? removeFromCart : addToCart}
            >
              {isInCart ? 'Remove from Cart' : 'Add to Cart'}
            </button>
          </div>
        </div>
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
                <img src="\Icons\iconsYelp.png" alt="Yelp" />
              </p>
            </a>
            <a className="nav-bar-link" href="https://www.facebook.com/alltrucksrecycling/">
              <p>
                <img src="\Icons\iconsFacebook.png" alt="Facebook" />
              </p>
            </a>
            <a className="nav-bar-link" href="https://www.google.com/maps/place/All+Trucks+Recycling/@38.5671157,-121.2559699,16z/data=!3m1!4b1!4m6!3m5!1s0x809ae81a3a571c01:0x9506e53facea0ca4!8m2!3d38.5671157!4d-121.253395!16s%2Fg%2F1tcv6krz?entry=ttu">
              <p>
                <img src="\Icons\IconsGoogle.png" alt="Google" />
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

export default PartDetail;
