import React from 'react';
import './Navbar.css';

const Navbar: React.FC = () => {
  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <div className="navbar-logo">Antony Hyson Seltran</div>
        <div className="navbar-menu">
          <a href="#portfolio" onClick={() => handleNavClick('#portfolio')}>Portfolio</a>
          <a href="#contact" onClick={() => handleNavClick('#contact')}>Contact</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;