import React from 'react';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <div className="navbar-logo">Antony Hyson Seltran</div>
        <div className="navbar-menu">
          <a href="#portfolio">Collections</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;