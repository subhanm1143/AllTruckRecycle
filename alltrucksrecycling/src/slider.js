import React, { useEffect, useState } from "react";
import axios from "axios";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import CarPartCard from "./CarPartCard";
import "./slider.css";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 1 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 3,
    slidesToSlide: 3 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 767, min: 464 },
    items: 2,
    slidesToSlide: 1 // optional, default to 1.
  }
};

const Slider = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/items")
      .then(response => {
        setItems(response.data);
      })
      .catch(error => console.error(error));
  }, []);

  const newestParts = items.slice(-8);

  return (
    <div className="parent">
        <h1>Welcome to All Trucks Recycling</h1>
      <Carousel
        responsive={responsive}
        autoPlay={true}
        swipeable={true}
        draggable={true}
        showDots={false}
        infinite={true}
        partialVisible={false}
      >
         {newestParts.map((part) => (
            <div className="slider">
               <div className="card-wrapper">
                <CarPartCard part={part} />
              </div>
            </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Slider;
