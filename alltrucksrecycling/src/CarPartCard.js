import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function CarPartCard({ part }) {
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const partInCart = cart.find(cartItem => cartItem._id === part._id);
    if (partInCart) {
      setIsInCart(true);
    }

  }, [part]);

  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(part);
    localStorage.setItem('cart', JSON.stringify(cart));
    setIsInCart(true);
  };

  const removeFromCart = () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(cartItem => cartItem._id !== part._id);
    localStorage.setItem('cart', JSON.stringify(cart));
    setIsInCart(false);
  };

  return (
    <div className="car-part-card">
      <Link to={`/part/${part._id}`}>
        <img src={`https://alltruckrecycling.s3.us-east-2.amazonaws.com/${part.imageUrl}`}  alt={part.name} />
        <h2>{part.carYear} {part.carMake} {part.carModel}</h2>
        <h2>{part.name}</h2>
        <p>{part.description}</p>
        <p>Price: ${part.price}</p>
      </Link>
      {isInCart ? (
        <button 
          onClick={removeFromCart} 
          className="remove-from-cart-button"
        >
          Remove from Cart
        </button>
      ) : (
        <button 
          onClick={addToCart} 
          className="add-to-cart-button"
        >
          Add to Cart
        </button>
      )}
    </div>
  );
}

export default CarPartCard;
