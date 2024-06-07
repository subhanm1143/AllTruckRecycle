import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './shippingPage.css';

function Shipping() {
  const [sales, setSales] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [salesPerPage] = useState(10);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await axios.get('https://alltruckrecycle.onrender.com/api/sold');
        const sortedSales = response.data.sort((a, b) => (a.shipped === b.shipped ? 0 : a.shipped ? 1 : -1));
        setSales(sortedSales);
      } catch (error) {
        console.error('Error fetching sales:', error);
      }
    };

    fetchSales();
  }, []);

  const handleMarkAsShipped = async (saleId) => {
    try {
      // Make a PUT request to update the sale with the shipped status
      await axios.put(`https://alltruckrecycle.onrender.com/api/sold/${saleId}`, { shipped: true });
      
      // Update the local state to reflect the change
      setSales(prevSales => {
        return prevSales.map(sale => {
          if (sale._id === saleId) {
            return { ...sale, shipped: true };
          }
          return sale;
        });
      });
  
      console.log(`Sale ${saleId} marked as shipped.`);
    } catch (error) {
      console.error(`Error marking sale ${saleId} as shipped:`, error);
    }
  };

  // Pagination
  const indexOfLastSale = currentPage * salesPerPage;
  const indexOfFirstSale = indexOfLastSale - salesPerPage;
  const currentSales = sales.slice(indexOfFirstSale, indexOfLastSale);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <header>
        <h1>Shipping Page</h1>
      </header>

      {currentSales.map((sale, index) => (
        <div
          key={index}
          className={`sale-section ${sale.shipped ? 'shipped' : 'not-shipped'}`}
        >
          <div className="sale-details">
            <div className="address-details">
              <p>Address: {sale.address}</p>
              <p>Email: {sale.email}</p>
            </div>
            <button className="shipped-button" onClick={() => handleMarkAsShipped(sale._id)}>Mark as Shipped</button>
          </div>
          <div className="sale-items">
            {sale.itemsArray.map((item, i) => (
              <div key={i} className="shippeditems">
                <h3>{item.carYear} {item.carMake} {item.carModel} {item.name}</h3>
                <p>Price: ${item.price}, Part Number: {item.partNumber}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="pagination">
        {Array.from({ length: Math.ceil(sales.length / salesPerPage) }, (_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            disabled={currentPage === index + 1}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <p className="footer-nav-bar">
        <a href="/">Home</a>
      </p>
    </div>
  );
}

export default Shipping;
