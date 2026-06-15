import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Linkedin, MapPin } from 'lucide-react';
import './Contact.css';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xvgqlwdl';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setStatus('sent');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: px, y: py });
  };

  const reset = () => setTilt({ x: 0, y: 0 });

  return (
    <section className="contact section" id="contact">
      <div className="container contact-grid">
        <motion.div
          className="contact-copy"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <span className="eyebrow">Get in touch</span>
          <h2 className="section-title contact-title">
            Have a shoot<br /><span className="contact-title-accent">in mind?</span>
          </h2>
          <p className="contact-body">
            Whether it's a portrait session, an event, or something
            experimental — I'd love to hear about it. Drop a message
            and I'll get back to you within a couple of days.
          </p>
          <div className="contact-info">
            <a href="mailto:work.antonyhyson@gmail.com" className="contact-info-row cursor-hover">
              <Mail size={16} />
              <span>work.antonyhyson@gmail.com</span>
            </a>
            <div className="contact-info-row">
              <MapPin size={16} />
              <span>London, United Kingdom</span>
            </div>
            <a href="https://www.linkedin.com/in/antonyhysonseltran" target="_blank" rel="noopener noreferrer" className="contact-info-row cursor-hover">
              <Linkedin size={16} />
              <span>antonyhysonseltran ↗</span>
            </a>
          </div>
        </motion.div>

        <motion.div
          className="contact-form-wrap perspective"
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            ref={cardRef}
            className="contact-card preserve-3d"
            onMouseMove={handleMove}
            onMouseLeave={reset}
            style={{ transform: `rotateY(${tilt.x * 6}deg) rotateX(${-tilt.y * 6}deg)` }}
          >
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label>Name</label>
                <input type="text" name="name" placeholder="Your name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="form-row">
                <label>Email</label>
                <input type="email" name="email" placeholder="your@email.com" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="form-row">
                <label>Message</label>
                <textarea name="message" placeholder="Tell me about your project..." rows={5} value={formData.message} onChange={handleInputChange} required />
              </div>
              <button type="submit" className="btn cursor-hover" disabled={status === 'sending'}>
                <Send size={16} />
                {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Sent ✓' : 'Send message'}
              </button>
              {status === 'error' && <p className="form-status form-status--error">Something went wrong — try emailing directly.</p>}
              {status === 'sent' && <p className="form-status form-status--ok">Thanks — I'll be in touch soon.</p>}
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
