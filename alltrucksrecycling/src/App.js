import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import CarPartCard from './CarPartCard';
import Slider from './slider.js'; 

function App() {
  const [items, setParts] = useState([]);
  const [makesArray, setMakes] = useState([]);
  const [modelsArray, setModels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://alltruckrecycle.onrender.com/api/items")
      .then(response => {
        setParts(response.data);
      })
      .catch(error => console.error(error));

    axios.get("https://alltruckrecycle.onrender.com/api/carsearch")
      .then(response => {
        const makesArray = Object.values(response.data);
        setMakes(makesArray);
      })
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    if (selectedMake) {
      const selectedMakeObj = makesArray.find(makeObj => makeObj.make === selectedMake);
      if (selectedMakeObj) {
        setModels(selectedMakeObj.models);
      }
    } else {
      setModels([]);
    }
  }, [selectedMake, makesArray]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert("Please enter a search query");
    } else {
      navigate(`/search/${searchQuery}`);
    }
  };

  const handleSearchPart = () => {
    if (!searchQuery.trim()) {
      alert("Please enter a search query");
    } else {
      navigate(`/search/PartNumber${searchQuery}`);
    }
  };

  const handleMakeChange = (e) => {
    setSelectedMake(e.target.value);
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleSearchDrop = () => {
    if (!selectedMake || !selectedYear || !selectedModel) {
      alert("Please select Year, Make, and Model");
      return;
    }

    const searchUrl = `/search/${selectedYear} ${selectedMake} ${selectedModel}`;
    navigate(searchUrl);
  };

  const years = Array.from({ length: 25 }, (_, index) => 2024 - index);
  const newestParts = items.slice(-8);

  // Functions for Login
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
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedEmail = localStorage.getItem('email');
    if (token && storedEmail) {
      setIsLoggedIn(true);
      setEmail(storedEmail);
    }
  }, []);
  

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://alltruckrecycle.onrender.com/api/users/login", { email, password });
      console.log("Response from server:", response); // Log the entire response object
  
      if (response.status === 200) {
        setIsLoggedIn(true);
        localStorage.setItem('email', email);

        
        if (email === 'admin@gmail.com') {
          const token = response.data.user; // Correctly access the token
          localStorage.setItem('token', token);
          console.log("Token:", token); // Log the token after it's defined
          navigate('/admin');
        } else {
          openDialog('profileDialog');
          closeDialog('profileDialog');
        }
      } else {
        console.log("Login failed");
        openDialog('errorDialogLogin');
      }
    } catch (error) {
      console.error("Error during login:", error);
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
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      axios.post('https://alltruckrecycle.onrender.com/api/authenticate', { token: storedToken })
        .then(response => {
          if (response.data.success) {
            setIsAdmin(true);
          }
        })
        .catch(error => {
          console.error('Authentication failed:', error);
        });
    }
  }, []);


  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
    closeDialog('profileDialog');
    localStorage.removeItem('token');
    setIsAdmin(false);
  };
  

  return (
    <div className="App">
      <div className="Header">
      <Link to="/About" className="nav-bar-link">
          <p className="logo">
            <img className="logo" src="img/Logo.png" alt="Logo" />
          </p>
        </Link>
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
        {isAdmin && (
        <div>
          <div className='Admin'>
          <Link to="/Admin">
              <p>
                Admin
              </p>
            </Link>
          </div>
          <div className='Admin'>
          <Link to="/shippingPage">
            <p>
              Shipping
            </p>
          </Link>
        </div>
        </div>
        )}
          <div className='Profile'>
            <p onClick={() => openDialog('profileDialog')}>
              <img className="logo" src="img/profile.png" alt="Profile" />
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
      <Slider></Slider>
      <div className="secondsearch">
        <h1>Enter Car Information</h1>
        <div className="Info">
          <div className="search-container">
            <div className="search-item">
            <select name="make" value={selectedMake} onChange={handleMakeChange}>
              <option value="">Select Make</option>
              {makesArray.map(makeObj => (
                <option key={makeObj.make} value={makeObj.make}>{makeObj.make}</option>
              ))}
            </select>

            <select name="model" value={selectedModel} onChange={handleModelChange}>
              <option value="">Select Model</option>
              {modelsArray.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>

            <select name="year" value={selectedYear} onChange={handleYearChange}>
              <option value="">Select Year</option>
              {years.map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            </div>
            <div className="search-item">
              <button type="search" onClick={handleSearchDrop}>Search</button>
            </div>
          </div>
        </div>
      </div>
      <div className="partnumber">
        <h1>Search by Part Number</h1>
        <div className="search-container">
          <button type="search" onClick={handleSearchPart}>Search</button>
          <input
            type="text"
            placeholder="Seach by Part Number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="new">
        <h1>NEW INVENTORY</h1>
      </div>
      <div className="items">
        {newestParts.map((part) => (
          <CarPartCard key={part._id} part={part} />
        ))}
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
                <img src="Icons\IconsGoogle.png" alt="Google" />
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

export default App;
