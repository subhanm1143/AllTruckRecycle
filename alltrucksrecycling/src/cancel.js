import React from 'react';
import './cancel.css'; // Import the CSS file

function Cancel() {
  return (
    <div className="cancel-container">
      <div className="cancel-content">
        <h1>Payment Cancelled</h1>
        <p>Your payment was cancelled. You can continue shopping or try again later.</p>
        <button className="continue-shopping-btn" onClick={() => window.location.href = '/'}>Continue Shopping</button>
      </div>
    </div>
  );
}

export default Cancel;
