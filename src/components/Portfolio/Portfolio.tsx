import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { UnsplashCollection, UnsplashPhoto } from '../../App';
import './Portfolio.css';

interface ExplorerProps {
  collections: UnsplashCollection[];
  accessKey: string;
}

const CollectionCard: React.FC<{ collection: UnsplashCollection; onClick: () => void; }> = ({ collection, onClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % collection.preview_photos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [collection.preview_photos.length]);

  return (
    <motion.div
      className="collection-card"
      onClick={onClick}
      layoutId={`card-${collection.id}`}
      whileHover={{ scale: 1.03 }}
    >
      <AnimatePresence>
        <motion.img
          key={collection.preview_photos[currentIndex].id}
          src={collection.preview_photos[currentIndex].urls.regular}
          alt={collection.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        />
      </AnimatePresence>
      <div className="collection-overlay">
        <div className="collection-title">{collection.title}</div>
      </div>
    </motion.div>
  );
};

export const PortfolioExplorer: React.FC<ExplorerProps> = ({ collections, accessKey }) => {
  const [selectedCollection, setSelectedCollection] = useState<UnsplashCollection | null>(null);

  return (
    <>
      <div className="portfolio-hero">
        {/* The div below will now have its background styled by the CSS file */}
        <div className="hero-background"></div>
        <div className="hero-content">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            A Collection of Moments
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            Explore a curated selection of my photographic work.
          </motion.p>
        </div>
      </div>

      <section id="portfolio" className="portfolio-explorer section">
        <div className="container">
          <div className="collection-grid">
            {collections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                onClick={() => setSelectedCollection(collection)}
              />
            ))}
          </div>
        </div>

        <AnimatePresence>
          {selectedCollection && (
            <Lightbox
              collection={selectedCollection}
              accessKey={accessKey}
              onClose={() => setSelectedCollection(null)}
            />
          )}
        </AnimatePresence>
      </section>
    </>
  );
};

const Lightbox: React.FC<{ collection: UnsplashCollection; accessKey: string; onClose: () => void; }> = ({ collection, accessKey, onClose }) => {
    const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchPhotos = async () => {
            const response = await axios.get(`https://api.unsplash.com/collections/${collection.id}/photos`, {
                params: { per_page: 30 },
                headers: { Authorization: `Client-ID ${accessKey}` },
            });
            setPhotos(response.data);
        };
        fetchPhotos();
    }, [collection.id, accessKey]);

    const handleNext = () => setCurrentIndex((prev) => (prev + 1) % photos.length);
    const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);

    return (
        <motion.div className="lightbox-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button className="lightbox-close" onClick={onClose}><X size={32} /></button>
            {photos.length > 0 && (
                <div className="lightbox-content">
                    <button className="lightbox-nav prev" onClick={handlePrev}>‹</button>
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={photos[currentIndex].id}
                            src={photos[currentIndex].urls.full}
                            alt={photos[currentIndex].alt_description}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4 }}
                        />
                    </AnimatePresence>
                    <button className="lightbox-nav next" onClick={handleNext}>›</button>
                </div>
            )}
            <div className="lightbox-title">{collection.title}</div>
        </motion.div>
    );
};
