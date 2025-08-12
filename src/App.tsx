import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar/Navbar';
import { PortfolioExplorer } from './components/Portfolio/Portfolio';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';

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
            params: { per_page: 30 }, // Fetch up to 30 collections
            headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
          }
        );
        // Filter out collections that might not have enough preview photos for the cycling effect
        setCollections(response.data.filter((col: UnsplashCollection) => col.preview_photos && col.preview_photos.length > 1));
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };

    fetchUserCollections();
  }, []);

  return (
    <div className="app">
      <Navbar />
      <main>
        {collections.length > 0 && (
          <PortfolioExplorer
            collections={collections}
            accessKey={UNSPLASH_ACCESS_KEY}
          />
        )}
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default App;