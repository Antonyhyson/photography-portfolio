import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { UnsplashCollection, UnsplashPhoto } from '../../App';
import './Gallery.css';

interface GalleryProps {
  collections: UnsplashCollection[];
  accessKey: string;
}

// ── 3D Tilt Card ─────────────────────────────────────────────────────────────
const TiltCard: React.FC<{ collection: UnsplashCollection; onClick: () => void }> = ({ collection, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (collection.preview_photos.length < 2) return;
    const t = setInterval(() => {
      setIndex(i => (i + 1) % collection.preview_photos.length);
    }, 3500);
    return () => clearInterval(t);
  }, [collection.preview_photos.length]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: px, y: py });
  };

  const reset = () => setTilt({ x: 0, y: 0 });
  const photo = collection.preview_photos[index];

  return (
    <motion.div
      className="tilt-wrap perspective"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        ref={ref}
        className="tilt-card preserve-3d cursor-hover"
        onMouseMove={handleMove}
        onMouseLeave={reset}
        onClick={onClick}
        style={{ transform: `rotateY(${tilt.x * 10}deg) rotateX(${-tilt.y * 10}deg) scale(${tilt.x || tilt.y ? 1.02 : 1})` }}
      >
        <div className="tilt-image" style={{ transform: 'translateZ(20px)' }}>
          <AnimatePresence mode="wait">
            <motion.img
              key={photo?.id}
              src={photo?.urls.regular}
              alt={collection.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9 }}
              loading="lazy"
            />
          </AnimatePresence>
        </div>
        <div
          className="tilt-glare"
          style={{
            background: `radial-gradient(circle at ${50 + tilt.x * 100}% ${50 + tilt.y * 100}%, rgba(255,255,255,0.18), transparent 60%)`,
          }}
        />
        <div className="tilt-info" style={{ transform: 'translateZ(40px)' }}>
          <span className="tilt-count">{collection.total_photos} photos</span>
          <h3 className="tilt-title">{collection.title}</h3>
        </div>
      </div>
    </motion.div>
  );
};

// ── Lightbox ─────────────────────────────────────────────────────────────────
const Lightbox: React.FC<{ collection: UnsplashCollection; accessKey: string; onClose: () => void }> = ({ collection, accessKey, onClose }) => {
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await axios.get(`https://api.unsplash.com/collections/${collection.id}/photos`, {
          params: { per_page: 30 },
          headers: { Authorization: `Client-ID ${accessKey}` },
        });
        setPhotos(res.data);
      } catch {
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, [collection.id, accessKey]);

  const next = useCallback(() => setIndex(i => (i + 1) % Math.max(photos.length, 1)), [photos.length]);
  const prev = useCallback(() => setIndex(i => (i - 1 + Math.max(photos.length, 1)) % Math.max(photos.length, 1)), [photos.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, next, prev]);

  return (
    <motion.div
      className="lightbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <button className="lightbox-close cursor-hover" onClick={onClose} aria-label="Close">
        <X size={28} />
      </button>

      {loading && <div className="lightbox-loading">Loading…</div>}

      {!loading && photos.length > 0 && (
        <div className="lightbox-stage perspective" onClick={e => e.stopPropagation()}>
          <button className="lightbox-nav cursor-hover" onClick={prev} aria-label="Previous">
            <ChevronLeft size={28} />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={photos[index].id}
              className="lightbox-img-wrap preserve-3d"
              initial={{ opacity: 0, rotateY: 15, scale: 0.96 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: -15, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <img src={photos[index].urls.full} alt={photos[index].alt_description || collection.title} />
            </motion.div>
          </AnimatePresence>

          <button className="lightbox-nav cursor-hover" onClick={next} aria-label="Next">
            <ChevronRight size={28} />
          </button>
        </div>
      )}

      {!loading && photos.length === 0 && (
        <div className="lightbox-loading">No photos found in this collection.</div>
      )}

      <div className="lightbox-footer">
        <span className="lightbox-title">{collection.title}</span>
        {photos.length > 0 && <span className="lightbox-counter">{index + 1} / {photos.length}</span>}
      </div>
    </motion.div>
  );
};

// ── Gallery Section ────────────────────────────────────────────────────────
const Gallery: React.FC<GalleryProps> = ({ collections, accessKey }) => {
  const [selected, setSelected] = useState<UnsplashCollection | null>(null);

  return (
    <section className="gallery section" id="portfolio">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Selected work</span>
          <h2 className="section-title">A collection<br /><span className="gallery-title-accent">of moments.</span></h2>
          <p className="section-subtitle">
            A curated set of collections — click through to explore each one in full.
          </p>
        </div>

        {collections.length === 0 && (
          <div className="gallery-empty">
            <p>Collections are loading or unavailable right now — check back shortly.</p>
          </div>
        )}

        <div className="gallery-grid">
          {collections.map(c => (
            <TiltCard key={c.id} collection={c} onClick={() => setSelected(c)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <Lightbox collection={selected} accessKey={accessKey} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
