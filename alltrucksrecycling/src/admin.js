import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useParams } from 'react-router-dom';
import './admin.css';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';

function Admin() {
  const { id } = useParams();
  const [part, setPart] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setParts] = useState([]);
  const [carSearches, setCarSearches] = useState([]);
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedModels, setSelectedModels] = useState([]);
  const [newMake, setNewMake] = useState("");
  const [newModel, setNewModel] = useState("");
  const storedToken = localStorage.getItem('token');
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const partsPerPage = 10;

  const [newPart, setNewPart] = useState({
    name: '',
    partNumber: '',
    carYear: '',
    carModel: '',
    carMake: '',
    description: '',
    price: '',
    imageUrl: ''
  });
  const [searchQueries, setSearchQueries] = useState({
    carYear: '',
    carMake: '',
    carModel: '',
    partNumber: '',
    name: ''
  });
  const [open, setOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [editValues, setEditValues] = useState({
    name: '',
    partNumber: '',
    carYear: '',
    carModel: '',
    carMake: '',
    description: '',
    price: '',
    imageUrl: ''
  });
  useEffect(() => {
    const authenticateUser = async () => {
      try {
        // Send a request to the server to authenticate the user
        const response = await axios.post('http://localhost:5000/api/authenticate', {
          token: storedToken
        });
        
        // If authentication is successful, log a message and continue
        console.log('User is authenticated');
      } catch (error) {
        // If authentication fails, log the error and redirect to the login page
        console.error('Authentication failed:', error);
        navigate('/');
      }
    };

    // Check if token is present
    if (!storedToken) {
      // Redirect user to login page if token is not present
      navigate('/');
    } else {
      // Call the authenticateUser function to authenticate the user with the server
      authenticateUser();
    }
  }, [storedToken, navigate]);


  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/items/${id}`)
        .then(response => {
          setPart(response.data);
        })
        .catch(error => console.error('Error fetching part:', error));
    }
  }, [id]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/items")
      .then(response => {
        setParts(response.data);
      })
      .catch(error => console.error(error));
      const fetchData = async () => {
        try {
          const response = await axios.get("http://localhost:5000/api/carsearch");
          setCarSearches(response.data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
  
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPart({
      ...newPart,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/items', newPart)
      .then(response => {
        alert('Part added successfully!');
        setNewPart({
          name: '',
          partNumber: '',
          carYear: '',
          carModel: '',
          carMake: '',
          description: '',
          price: '',
          imageUrl: ''
        });
        axios.get("http://localhost:5000/api/items")
          .then(response => {
            setParts(response.data);
          })
          .catch(error => console.error(error));
      })
      .catch(error => {
        console.error('There was an error adding the part:', error);
        alert('There was an error adding the part. Please try again.');
      });
  };

  const handleCardClick = (part) => {
    setSelectedPart(part);
    setEditValues(part);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPart(null);
  };

  const handleEdit = () => {
    axios.put(`http://localhost:5000/api/items/${selectedPart._id}`, editValues)
      .then(response => {
        alert('Part updated successfully!');
        setOpen(false);
        setParts(items.map(item => item._id === selectedPart._id ? response.data : item));
      })
      .catch(error => {
        console.error('There was an error updating the part:', error);
        alert('There was an error updating the part. Please try again.');
      });
  };

  const handleDelete = () => {
    axios.delete(`http://localhost:5000/api/items/${selectedPart._id}`)
      .then(response => {
        alert('Part deleted successfully!');
        setParts(items.filter(item => item._id !== selectedPart._id));
        setOpen(false);
      })
      .catch(error => {
        console.error('There was an error deleting the part:', error);
        alert('There was an error deleting the part. Please try again.');
      });
  };

  const handleInputChange = (e, field) => {
    const { value } = e.target;
    setSearchQueries(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  const handleSearchs = () => {
    if (!searchQuery.trim()) {
      alert("Please enter a search query");
    } else {
      navigate(`/search/${searchQuery}`);
    }
  };

  const handleSearch = () => {
    const { carYear, carMake, carModel, partNumber, name } = searchQueries;
    const query = `${carYear} ${carMake} ${carModel} ${partNumber} ${name}`.trim().replace(/\s+/g, '%20');
    navigate(`/search/${query}`);
  };

  const search = (data) => {
    return data.filter((part) => {
      return Object.keys(searchQueries).every((key) => {
        const query = searchQueries[key]?.toLowerCase() || '';
        const partValue = part[key]?.toString().toLowerCase() || '';
        return partValue.includes(query);
      });
    });
  };
  const handleMakeChange = (event) => {
    const make = event.target.value;
    setSelectedMake(make);
    const selectedMakeData = carSearches.find((carSearch) => carSearch.make === make);
    setSelectedModels(selectedMakeData ? selectedMakeData.models : []);
  };

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };
  const handleDeleteMake = (make) => {
    const updatedCarSearches = carSearches.filter((carSearch) => carSearch.make !== make);
    setCarSearches(updatedCarSearches);
    // Clear selected make and models if deleted make matches
    if (selectedMake === make) {
      setSelectedMake('');
      setSelectedModels([]);
      setSelectedModel('');
    }
  };

  // Function to handle deleting a model
const handleDeleteModel = (model) => {
  // Send a DELETE request to delete the specified model from the selected make
  axios.delete(`http://localhost:5000/api/carsearch/${selectedMake}/models/${model}`)
    .then(response => {
      // Handle success
      alert(`Model "${model}" deleted successfully from ${selectedMake}`);
      setSelectedModels(prevModels => prevModels.filter(m => m !== model));
    })
    .catch(error => {
      // Handle error
      console.error('Error deleting model:', error);
      alert('Error deleting model. Please try again.');
    });
};

  const handleAddMake = () => {
    // Check if the new make is not empty
    if (newMake.trim() !== "") {
      // Check if the new make already exists
      if (carSearches.some(carSearch => carSearch.make === newMake)) {
        alert("Make already exists!");
      } else {
        // Add the new make to the list of car searches
        setCarSearches(prevCarSearches => [...prevCarSearches, { make: newMake, models: [] }]);
        setNewMake(""); // Clear the input box after adding the make
        alert(`Make "${newMake}" added successfully!`);
      }
    } else {
      alert("Please enter a valid make.");
    }
  };
  // Function to handle adding a new model
const handleAddModel = () => {
  if (newModel.trim() !== "") {
    // Send a POST request to add the new model to the specified make
    axios.post(`http://localhost:5000/api/carsearch/${selectedMake}/models`, { model: newModel })
      .then(response => {
        // Handle success
        alert(`Model "${newModel}" added successfully to ${selectedMake}`);
        setSelectedModels(prevModels => [...prevModels, newModel]);
        setNewModel(""); // Clear the input box after adding the model
      })
      .catch(error => {
        // Handle error
        console.error('Error adding model:', error);
        alert('Error adding model. Please try again.');
      });
  } else {
    alert("Please enter a valid model.");
  }
};

const startIndex = (currentPage - 1) * partsPerPage;
const endIndex = startIndex + partsPerPage;
const paginatedParts = search(items).slice(startIndex, endIndex);

const handlePageChange = (pageNumber) => {
  setCurrentPage(pageNumber);
};


  
  

  return (
    <div>
      <div className="Header">
        <a className="nav-bar-link" href="/">
          <p><img className="logo" src="img/Logo.png" alt="Logo" /></p>
        </a>
        <div className="search-container-admin">
          <button type="search" onClick={handleSearchs}>Search</button>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="AddParts">
        <h1>Add New Parts</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-grid">
            <input type="text" name="name" placeholder="Name" value={newPart.name} onChange={handleChange} />
            <input type="text" name="partNumber" placeholder="Part Number" value={newPart.partNumber} onChange={handleChange} />
            <input type="text" name="carYear" placeholder="Car Year" value={newPart.carYear} onChange={handleChange} />
            <input type="text" name="carModel" placeholder="Car Model" value={newPart.carModel} onChange={handleChange} />
            <input type="text" name="carMake" placeholder="Car Make" value={newPart.carMake} onChange={handleChange} />
            <input type="text" name="description" placeholder="Description" value={newPart.description} onChange={handleChange} />
            <input type="text" name="price" placeholder="Price" value={newPart.price} onChange={handleChange} />
            <input type="text" name="imageUrl" placeholder="Image" value={newPart.imageUrl} onChange={handleChange} />
          </div>
          <button type="submit">Add Part</button>
        </form>
      </div>
      <div className="makesmodels-container">
        <div>
          <input type="text" placeHolder="Enter Make" className="Makes"value={newMake} onChange={e => setNewMake(e.target.value)} /> {/* Input for new make */}
          <button className="MakesButton" onClick={handleAddMake}>Add Make</button> {/* Button to add new make */}
          <select className="make-dropdown" value={selectedMake} onChange={handleMakeChange}>
            <option value="">Select Make</option>
            {carSearches.map((carSearch) => (
              <option key={carSearch._id} value={carSearch.make}>{carSearch.make}</option>
            ))}
          </select>
          <input type="text" placeHolder="Enter Model" className="Makes"value={newModel} onChange={e => setNewModel(e.target.value)} /> {/* Input for new make */}
          <button className="MakesButton" onClick={handleAddModel}>Add Model</button> {/* Button to add new make */}
        </div>
        <div className="models-container">
          <h3>Add or Remove Models and Makes</h3>
          <ul>
            {selectedModels.map((model, index) => (
              <li key={index}>
                {model}
                <button onClick={() => handleDeleteModel(model)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
        {selectedMake && (
          <button onClick={() => handleDeleteMake(selectedMake)}>Delete {selectedMake}</button>
        )}
      </div>




      <div className="edit">
        <h1>Edit Parts or Delete</h1>
      </div>
      <div className="search-box">
        <button type="button" onClick={handleSearch}>Search</button>
        <input
          className="input-box"
          type="text"
          placeholder="Car Year"
          value={searchQueries.carYear}
          onChange={(e) => handleInputChange(e, 'carYear')}
        />
        <input
          className="input-box"
          type="text"
          placeholder="Car Make"
          value={searchQueries.carMake}
          onChange={(e) => handleInputChange(e, 'carMake')}
        />
        <input
          className="input-box"
          type="text"
          placeholder="Car Model"
          value={searchQueries.carModel}
          onChange={(e) => handleInputChange(e, 'carModel')}
        />
        <input
          className="input-box"
          type="text"
          placeholder="Part Number"
          value={searchQueries.partNumber}
          onChange={(e) => handleInputChange(e, 'partNumber')}
        />
        <input
          className="input-box"
          type="text"
          placeholder="Part Name"
          value={searchQueries.name}
          onChange={(e) => handleInputChange(e, 'name')}
        />
      </div>
      <div className='containerItemsAdmin'>
       <div className="items-admin">
        {paginatedParts.length === 0 ? (
          <h2>Part not found matching description</h2>
        ) : (
          paginatedParts.map((part) => (
            <div key={part._id} className="car-part-card" onClick={() => handleCardClick(part)}>
              <img src={part.imageUrl} alt={part.name} />
              <h2>{part.carYear} {part.carMake} {part.carModel}</h2>
              <h2>{part.name}</h2>
              <p>{part.description}</p>
              <p className="price">Price: ${part.price}</p>
            </div>
          ))
        )}
        </div>
        <div className="pagination">
          {Array.from({ length: Math.ceil(search(items).length / partsPerPage) }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              disabled={currentPage === index + 1}
            >
              {index + 1}
            </button>
          ))}
      </div>
    </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit or Delete Part</DialogTitle>
        <DialogContent>
          {selectedPart && (
            <div>
              <img src={selectedPart.imageUrl} alt={selectedPart.name} style={{ width: '100%' }} />
              <h2>{selectedPart.carYear} {selectedPart.carMake} {selectedPart.carModel}</h2>
              <h2>{selectedPart.name}</h2>
              <p>{selectedPart.description}</p>
              <p>Price: ${selectedPart.price}</p>
              <div className="input-grid">
                <input type="text" id="newName" placeholder="New Name" value={editValues.name} onChange={(e) => setEditValues({...editValues, name: e.target.value})} />
                <input type="text" id="newPartNumber" placeholder="Part Number" value={editValues.partNumber} onChange={(e) => setEditValues({...editValues, partNumber: e.target.value})} />
                <input type="text" id="newCarYear" placeholder="Car Year" value={editValues.carYear} onChange={(e) => setEditValues({...editValues, carYear: e.target.value})} />
                <input type="text" id="newCarModel" placeholder="Car Model" value={editValues.carModel} onChange={(e) => setEditValues({...editValues, carModel: e.target.value})} />
                <input type="text" id="newCarMake" placeholder="Car Make" value={editValues.carMake} onChange={(e) => setEditValues({...editValues, carMake: e.target.value})} />
                <input type="text" id="newDescription" placeholder="Description" value={editValues.description} onChange={(e) => setEditValues({...editValues, description: e.target.value})} />
                <input type="text" id="newPrice" placeholder="Price" value={editValues.price} onChange={(e) => setEditValues({...editValues, price: e.target.value})} />
                <input type="text" id="newImageUrl" placeholder="Image" value={editValues.imageUrl} onChange={(e) => setEditValues({...editValues, imageUrl: e.target.value})} />
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEdit} color="primary">Edit</Button>
          <Button onClick={handleDelete} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
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

export default Admin;
