import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './success.css'; // Import the CSS file

function Success() {
  const [soldItems, setSoldItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Function to fetch data from local storage
    const fetchDataFromLocalStorage = () => {
      const storedSoldItems = localStorage.getItem('cart');
      const storedAddress = localStorage.getItem('fullAddress');
      const storedEmail = localStorage.getItem('email');

      if (storedSoldItems && storedAddress && storedEmail) {
        setSoldItems(JSON.parse(storedSoldItems));
        setShippingAddress(storedAddress);
        setEmail(storedEmail);
        return { storedSoldItems, storedAddress, storedEmail };
      } else {
        console.error('Error: Data not found in local storage');
        return null;
      }
    };

    // Function to save sold items to the database
    const saveSoldItems = async (data) => {
      if (!data) return;

      try {
        const { storedSoldItems, storedAddress, storedEmail } = data;
        const response = await axios.post('https://alltruckrecycle.onrender.com/api/solditems', {
          itemsArray: JSON.parse(storedSoldItems),
          address: storedAddress,
          email: storedEmail
        });

        console.log(response.data);

        // Function to delete sold items from the items database
        const deleteSoldItems = async () => {
          const items = JSON.parse(storedSoldItems);
          for (const item of items) {
            try {
              await axios.delete(`https://alltruckrecycle.onrender.com/api/items/${item._id}`);
            } catch (error) {
              console.error(`Error deleting item ${item._id}:`, error);
            }
          }
        };

        // Delete the sold items from the items database
        deleteSoldItems();

        // Clear local storage after successful save
        localStorage.removeItem('cart');
        localStorage.removeItem('fullAddress');
        localStorage.removeItem('email');
      } catch (error) {
        console.error('Error saving sold items:', error);
      }
    };

    const data = fetchDataFromLocalStorage();
    saveSoldItems(data);
  }, []);

  return (
    <div className="back">
      <div className="Success-container">
        <h1 className="Success-heading">Payment Successful!</h1>
        <p className="Success-message">Your payment was successful. Thank you for your purchase!</p>
        <h2>Sold Items:</h2>
        <ul className="SoldItems-list">
          {soldItems.map((item, index) => (
            <li key={index} className="SoldItems-item">
              <p>{item.name}</p>
              <p>{item.price}</p>
            </li>
          ))}
        </ul>
        <div className="ShippingAddress">
          <h2 className="ShippingAddress-heading">Shipping Address:</h2>
          <p className="ShippingAddress-details">{shippingAddress}</p>
        </div>
        <div className="Email">
          <h2 className="Email-heading">Email:</h2>
          <p className="Email-details">{email}</p>
        </div>
        <a href="/" className="BackHome-link">Back Home</a>
      </div>
    </div>
  );
}

export default Success;
