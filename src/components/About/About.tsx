import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './About.css';

const STATS = [
  { value: '6+', label: 'Years shooting' },
  { value: '2', label: 'Continents covered' },
  { value: '∞', label: 'Frames & counting' },
];

const About: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

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
    <section className="about section" id="about">
      <div className="container about-grid">
        <motion.div
          className="about-copy"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <span className="eyebrow">About</span>
          <h2 className="section-title about-title">
            Light, framed<br /><span className="about-title-accent">with intention.</span>
          </h2>
          <p className="about-body">
            Photography started as a way to slow down — to notice the way
            light falls across a street, a face, a skyline. Over the past
            six years I've shot everything from sports and street scenes
            in Chennai to quiet corners of London, always chasing the
            same thing: a frame that feels true.
          </p>
          <p className="about-body">
            When I'm not behind the camera, I work in cybersecurity
            compliance — two disciplines that, surprisingly, share a lot:
            patience, attention to detail, and a habit of looking for
            what's just outside the frame.
          </p>
          <a href="#contact" className="btn btn-outline cursor-hover">Let's work together</a>
        </motion.div>

        <motion.div
          className="about-visual perspective"
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            ref={cardRef}
            className="about-card preserve-3d cursor-hover"
            onMouseMove={handleMove}
            onMouseLeave={reset}
            style={{
              transform: `rotateY(${tilt.x * 14}deg) rotateX(${-tilt.y * 14}deg)`,
            }}
          >
            <div className="about-card-ring" style={{ transform: 'translateZ(20px)' }} />
            <div className="about-card-inner" style={{ transform: 'translateZ(60px)' }}>
              <span className="about-card-label">Based in</span>
              <span className="about-card-value">London, UK</span>
              <div className="about-stats">
                {STATS.map((s, i) => (
                  <div key={i} className="about-stat">
                    <span className="about-stat-value">{s.value}</span>
                    <span className="about-stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
