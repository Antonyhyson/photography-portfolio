import React from 'react';
import { Mail, Linkedin, Github } from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-mark">
          <span className="footer-mark-glyph">A · H · S</span>
          <span className="footer-mark-sub">Photography — London, UK</span>
        </div>

        <div className="footer-links">
          <a href="mailto:work.antonyhyson@gmail.com" className="footer-link cursor-hover" aria-label="Email">
            <Mail size={16} />
          </a>
          <a href="https://www.linkedin.com/in/antonyhysonseltran" target="_blank" rel="noopener noreferrer" className="footer-link cursor-hover" aria-label="LinkedIn">
            <Linkedin size={16} />
          </a>
          <a href="https://github.com/Antonyhyson" target="_blank" rel="noopener noreferrer" className="footer-link cursor-hover" aria-label="GitHub">
            <Github size={16} />
          </a>
        </div>

        <p className="footer-copy">© 2025 Antony Hyson Seltran. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
