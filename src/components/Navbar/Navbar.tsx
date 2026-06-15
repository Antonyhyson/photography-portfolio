import React, { useState, useEffect } from 'react';
import './Navbar.css';

const NAV_ITEMS = [
  { label: 'Work', href: '#portfolio' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar-container container">
        <a href="#top" className="navbar-logo">
          Antony Hyson Seltran
        </a>

        <div className="navbar-menu">
          {NAV_ITEMS.map(item => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </div>

        <a
          href="https://antonyhyson.github.io/antony-hyson-seltran/"
          target="_blank"
          rel="noopener noreferrer"
          className="navbar-bridge"
        >
          <span className="navbar-bridge-dot" />
          cybersecurity
        </a>

        <button className="navbar-burger" onClick={() => setOpen(o => !o)} aria-label="menu">
          <span className={open ? 'open' : ''} />
          <span className={open ? 'open' : ''} />
        </button>
      </div>

      {open && (
        <div className="navbar-mobile">
          {NAV_ITEMS.map(item => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</a>
          ))}
          <a
            href="https://antonyhyson.github.io/antony-hyson-seltran/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
          >
            Cybersecurity portfolio ↗
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
