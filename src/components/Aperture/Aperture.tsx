import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './Aperture.css';

const EASE = [0.76, 0, 0.24, 1] as const;

const Aperture: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    const openTimer = setTimeout(() => setOpening(true), 1000);
    const doneTimer = setTimeout(onDone, 1000 + 750);
    return () => {
      clearTimeout(openTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <motion.div
      className="aperture"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ pointerEvents: opening ? 'none' : 'auto' }}
    >
      <motion.div
        className="aperture-blade aperture-blade--top"
        animate={{ scaleY: opening ? 0 : 1 }}
        transition={{ duration: 0.7, ease: EASE }}
      />
      <motion.div
        className="aperture-blade aperture-blade--bottom"
        animate={{ scaleY: opening ? 0 : 1 }}
        transition={{ duration: 0.7, ease: EASE }}
      />
      <motion.span
        className="aperture-mark"
        initial={{ opacity: 0, letterSpacing: '0.4em' }}
        animate={{
          opacity: opening ? 0 : 1,
          letterSpacing: opening ? '0.4em' : '0.15em',
          scale: opening ? 0.92 : 1,
        }}
        transition={{ duration: opening ? 0.4 : 0.6 }}
      >
        A · H · S
      </motion.span>
    </motion.div>
  );
};

export default Aperture;
