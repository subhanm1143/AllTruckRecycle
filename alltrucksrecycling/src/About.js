import React from 'react';
import './about.css'; // Import the CSS file


function About() {
  return (
    <div>
      <header>
        <h1>Welcome to All Trucks Recycling</h1>
      </header>

      <section className="mission">
        <h2>Our Mission</h2>
        <p>Our mission at Sacramento Auto Parts & Recycling is twofold: to provide top-notch auto parts for vehicles of all makes and models, and to contribute to environmental sustainability through responsible recycling practices. We believe that by offering reliable parts and promoting eco-friendly solutions, we can make a positive impact on both the automotive industry and the planet.</p>
      </section>

      <section className="history">
        <h2>Our History</h2>
        <p>Founded over [XX] years ago, Sacramento Auto Parts & Recycling has deep roots in the Sacramento community. From our humble beginnings as a small family-owned business, we have grown into a comprehensive auto parts supplier and recycling facility, serving customers throughout the region.</p>
      </section>

      <section className="quality">
        <h2>Commitment to Quality</h2>
        <p>Quality is at the core of everything we do. Whether you're in need of a critical engine component, a replacement body panel, or an accessory to enhance your vehicle's performance, you can trust that Sacramento Auto Parts & Recycling delivers only the highest quality products. We carefully inspect and test all parts to ensure they meet our rigorous standards for reliability and durability.</p>
      </section>

      <section className="inventory">
        <h2>Extensive Inventory</h2>
        <p>With one of the largest inventories of new, used, and remanufactured auto parts in the Sacramento area, we're confident that we have the part you need, no matter how rare or hard-to-find. Our comprehensive selection includes parts for cars, trucks, SUVs, and commercial vehicles, covering virtually every aspect of automotive repair and maintenance.</p>
      </section>

      <section className="eco-friendly">
        <h2>Eco-Friendly Solutions</h2>
        <p>At Sacramento Auto Parts & Recycling, we're passionate about preserving the environment for future generations. That's why we're committed to sustainable recycling practices that minimize waste and reduce our carbon footprint. Through our state-of-the-art recycling facility, we responsibly process end-of-life vehicles, salvaging usable parts and materials while safely disposing of hazardous substances.</p>
      </section>

      <section className="expertise">
        <h2>Expertise and Customer Service</h2>
        <p>Our team of automotive experts is here to assist you every step of the way. Whether you're searching for a specific part, need advice on installation, or have questions about our recycling process, we're dedicated to providing personalized service and expert guidance. We strive to exceed your expectations and ensure your complete satisfaction with every interaction.</p>
      </section>

      <section className="thanks">
        <h2>Thank You for Choosing Us</h2>
        <p>We're grateful for the opportunity to serve the Sacramento community and beyond. Thank you for choosing Sacramento Auto Parts & Recycling as your trusted partner for all your auto parts and recycling needs. Together, we can drive towards a greener, more sustainable future while keeping your vehicles running smoothly on the road.</p>
      </section>
      <p className="footer-nav-bar">
                <a href="/">Home</a>
              </p>
    </div>
    
  );
}

export default About;
