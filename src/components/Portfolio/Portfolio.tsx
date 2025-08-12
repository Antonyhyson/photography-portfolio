import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Square, Columns } from 'lucide-react';
import './Portfolio.css';

// --- Interfaces ---
interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
    full: string;
  };
  alt_description: string;
  user: {
    name: string;
  };
}

type LayoutType = 'grid' | 'slides' | 'cards';

// --- Main Portfolio Component ---
const Portfolio: React.FC = () => {
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [layout, setLayout] = useState<LayoutType>('grid');

  // --- CONFIGURATION ---
  // 1. Paste your chosen Photo IDs here
  const YOUR_PHOTO_IDS = [
    "a-w-l-E-d-S-c-E",
    "q-E-d-A-p-B-o",
    "f-Z-y-h-G-w-k-k",
    "a-C-n-A-m-I-n-g-o",
    // Add more photo IDs as strings here
  ];
  
  // 2. Replace with your Unsplash Access Key
  const UNSPLASH_ACCESS_KEY = 'X65u9D0iRGgWD8QDsyJXfeTlbySJZq3eJ-OiZC64dIE';

  useEffect(() => {
    if (!UNSPLASH_ACCESS_KEY || YOUR_PHOTO_IDS.length === 0) return;

    const fetchPhotosByIds = async () => {
      try {
        const photoRequests = YOUR_PHOTO_IDS.map(id =>
          axios.get(`https://api.unsplash.com/photos/${id}`, {
            headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
          })
        );
        const photoResponses = await Promise.all(photoRequests);
        const fetchedPhotos = photoResponses.map(res => res.data);
        setPhotos(fetchedPhotos);
      } catch (error) {
        console.error('Error fetching photos from Unsplash:', error);
      }
    };

    fetchPhotosByIds();
  }, []);

  return (
    <section id="portfolio" className="portfolio section">
      <div className="container">
        <div className="portfolio-header">
          <h2 className="section-title">Portfolio</h2>
          <div className="layout-switcher">
            <button onClick={() => setLayout('grid')} className={layout === 'grid' ? 'active' : ''}><LayoutGrid size={20} /></button>
            <button onClick={() => setLayout('slides')} className={layout === 'slides' ? 'active' : ''}><Square size={20} /></button>
            <button onClick={() => setLayout('cards')} className={layout === 'cards' ? 'active' : ''}><Columns size={20} /></button>
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          {layout === 'grid' && <GridLayout photos={photos} />}
          {layout === 'slides' && <SlidesLayout photos={photos} />}
          {layout === 'cards' && <CardsLayout photos={photos} />}
        </AnimatePresence>
      </div>
    </section>
  );
};

// --- Layout Components ---

const GridLayout = ({ photos }: { photos: UnsplashPhoto[] }) => (
  <motion.div
    key="grid"
    className="portfolio-grid"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    {photos.map((photo) => (
      <motion.div key={photo.id} className="photo-card-grid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.random() * 0.5 }}>
        <img src={photo.urls.regular} alt={photo.alt_description} />
      </motion.div>
    ))}
  </motion.div>
);

const SlidesLayout = ({ photos }: { photos: UnsplashPhoto[] }) => {
  const [index, setIndex] = useState(0);

  const handleNext = () => setIndex((prev) => (prev + 1) % photos.length);
  const handlePrev = () => setIndex((prev) => (prev - 1 + photos.length) % photos.length);

  return (
    <motion.div
      key="slides"
      className="portfolio-slides"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.img
          key={index}
          src={photos[index]?.urls.full}
          alt={photos[index]?.alt_description}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.4 }}
        />
      </AnimatePresence>
      <button className="slide-nav prev" onClick={handlePrev}>‹</button>
      <button className="slide-nav next" onClick={handleNext}>›</button>
    </motion.div>
  );
};

const CardsLayout = ({ photos }: { photos: UnsplashPhoto[] }) => (
  <motion.div
    key="cards"
    className="portfolio-cards"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {photos.map((photo, i) => (
      <motion.div
        key={photo.id}
        className="photo-card-single"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: i * 0.1 }}
      >
        <img src={photo.urls.regular} alt={photo.alt_description} />
        <div className="card-caption">Photo by {photo.user.name}</div>
      </motion.div>
    ))}
  </motion.div>
);

export default Portfolio;