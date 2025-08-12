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
  // Replace with your Unsplash username and Access Key
  const UNSPLASH_USERNAME = 'Antony Hyson Seltran';
  const UNSPLASH_ACCESS_KEY = 'X65u9D0iRGgWD8QDsyJXfeTlbySJZq3eJ-OiZC64dIE';

  useEffect(() => {
    if (!UNSPLASH_USERNAME || !UNSPLASH_ACCESS_KEY) return;

    const fetchPhotos = async () => {
      try {
        const response = await axios.get(
          `https://api.unsplash.com/users/${UNSPLASH_USERNAME}/photos`,
          {
            params: { per_page: 30 },
            headers: {
              Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
            },
          }
        );
        setPhotos(response.data);
      } catch (error) {
        console.error('Error fetching photos from Unsplash:', error);
      }
    };

    fetchPhotos();
  }, [UNSPLASH_USERNAME, UNSPLASH_ACCESS_KEY]);

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