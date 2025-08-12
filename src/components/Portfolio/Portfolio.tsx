// src/components/Portfolio/Portfolio.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './Portfolio.css';

interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
  };
  alt_description: string;
}

const Portfolio: React.FC = () => {
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  
  // --- IMPORTANT ---
  // 1. Replace with the Collection ID you copied from the Unsplash URL.
  const UNSPLASH_COLLECTION_ID = 'F4Qu2ZHdmyc'; 
  
  // 2. Replace with your Unsplash Access Key.
  const UNSPLASH_ACCESS_KEY = 'X65u9D0iRGgWD8QDsyJXfeTlbySJZq3eJ-OiZC64dIE';

  useEffect(() => {
    if (!UNSPLASH_COLLECTION_ID || !UNSPLASH_ACCESS_KEY) return;

    const fetchCollectionPhotos = async () => {
      try {
        const response = await axios.get(
          `https://api.unsplash.com/collections/${UNSPLASH_COLLECTION_ID}/photos`,
          {
            params: { per_page: 30 }, // You can show up to 30 photos
            headers: {
              Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
            },
          }
        );
        setPhotos(response.data);
      } catch (error) {
        console.error('Error fetching collection photos from Unsplash:', error);
      }
    };

    fetchCollectionPhotos();
  }, [UNSPLASH_COLLECTION_ID, UNSPLASH_ACCESS_KEY]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="portfolio" className="portfolio section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Portfolio</h2>
        </div>
        <motion.div
          className="portfolio-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {photos.map((photo) => (
            <motion.div
              key={photo.id}
              className="photo-card"
              variants={itemVariants}
              layout
            >
              <img src={photo.urls.regular} alt={photo.alt_description} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;