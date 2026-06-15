import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './Hero.css';

interface HeroProps {
  images: string[];
}

// Layer definitions: depth (translateZ), position, size, parallax strength
const LAYERS = [
  { depth: -120, top: '12%', left: '8%', w: 220, h: 280, factor: 1.6, rot: -6 },
  { depth: -60, top: '55%', left: '4%', w: 170, h: 220, factor: 1.2, rot: 4 },
  { depth: -200, top: '8%', left: '78%', w: 240, h: 300, factor: 2.0, rot: 5 },
  { depth: -40, top: '60%', left: '74%', w: 190, h: 240, factor: 1.0, rot: -4 },
  { depth: -160, top: '38%', left: '42%', w: 150, h: 190, factor: 1.8, rot: 2 },
];

const Hero: React.FC<HeroProps> = ({ images }) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 600], [0, 140]);
  const sceneY = useTransform(scrollY, [0, 600], [0, 80]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setMouse({ x, y });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const pool = images.length > 0 ? images : [];

  return (
    <section className="hero" id="top">
      <motion.div className="hero-scene perspective" ref={sceneRef} style={{ y: sceneY, opacity }}>
        <div
          className="hero-3d preserve-3d"
          style={{
            transform: `rotateY(${mouse.x * 8}deg) rotateX(${-mouse.y * 8}deg)`,
          }}
        >
          {pool.length > 0 && LAYERS.map((layer, i) => (
            <motion.div
              key={i}
              className="hero-layer"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              style={{
                top: layer.top,
                left: layer.left,
                width: layer.w,
                height: layer.h,
                transform: `translateZ(${layer.depth}px) translate(${mouse.x * layer.factor * -40}px, ${mouse.y * layer.factor * -40}px) rotate(${layer.rot}deg)`,
              }}
            >
              <img src={pool[i % pool.length]} alt="" loading="lazy" />
            </motion.div>
          ))}

          <div className="hero-text" style={{ transform: 'translateZ(40px)' }}>
            <motion.p
              className="eyebrow hero-eyebrow"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Photographer · London
            </motion.p>
            <motion.h1
              className="hero-title"
              style={{ y: titleY }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              Antony Hyson<br /><span className="hero-title-accent">Seltran</span>
            </motion.h1>
            <motion.p
              className="hero-sub"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.7 }}
            >
              Six years behind the lens — capturing moments across London
              and beyond, one frame at a time.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
            >
              <a href="#portfolio" className="btn cursor-hover">View the work →</a>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="hero-scroll-cue"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <span className="hero-scroll-line" />
        <span>scroll</span>
      </motion.div>
    </section>
  );
};

export default Hero;
