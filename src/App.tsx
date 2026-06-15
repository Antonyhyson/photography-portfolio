import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Gallery from './components/Gallery/Gallery';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import Aperture from './components/Aperture/Aperture';
import CustomCursor from './components/CustomCursor/CustomCursor';
import Grain from './components/Grain/Grain';
import ScrollProgress from './components/ScrollProgress/ScrollProgress';
import ToTop from './components/ToTop/ToTop';

// --- Interfaces ---
export interface UnsplashCollection {
  id: string;
  title: string;
  total_photos: number;
  preview_photos: {
    id: string;
    urls: {
      regular: string;
    };
  }[];
}

export interface UnsplashPhoto {
  id: string;
  urls: {
    full: string;
  };
  alt_description: string;
}

const App: React.FC = () => {
  const [collections, setCollections] = useState<UnsplashCollection[]>([]);
  const [introDone, setIntroDone] = useState(false);

  // --- CONFIGURATION ---
  const UNSPLASH_USERNAME = 'hyson'; // Your Unsplash username
  const UNSPLASH_ACCESS_KEY = 'X65u9D0iRGgWD8QDsyJXfeTlbySJZq3eJ-OiZC64dIE'; // Your Unsplash Access Key

  useEffect(() => {
    if (!UNSPLASH_USERNAME || !UNSPLASH_ACCESS_KEY) return;

    const fetchUserCollections = async () => {
      try {
        const response = await axios.get(
          `https://api.unsplash.com/users/${UNSPLASH_USERNAME}/collections`,
          {
            params: { per_page: 30 },
            headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
          }
        );
        setCollections(response.data.filter((col: UnsplashCollection) => col.preview_photos && col.preview_photos.length > 1));
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };

    fetchUserCollections();
  }, []);

  // Flatten preview photos across collections for the Hero's floating 3D layers
  const heroImages = collections
    .flatMap(c => c.preview_photos.map(p => p.urls.regular))
    .slice(0, 12);

  return (
    <div className="app">
      <Grain />
      <CustomCursor />
      <ScrollProgress />

      <AnimatePresence>
        {!introDone && <Aperture onDone={() => setIntroDone(true)} />}
      </AnimatePresence>

      <Navbar />
      <main>
        <Hero images={heroImages} />
        <About />
        <Gallery collections={collections} accessKey={UNSPLASH_ACCESS_KEY} />
        <Contact />
      </main>
      <Footer />
      <ToTop />
    </div>
  );
};

export default App;
