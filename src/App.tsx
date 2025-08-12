import React from 'react';
import Navbar from './components/Navbar/Navbar';
import Portfolio from './components/Portfolio/Portfolio';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';

const App: React.FC = () => {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Portfolio />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default App;