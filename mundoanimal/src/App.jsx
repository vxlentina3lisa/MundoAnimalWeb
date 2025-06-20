import React from 'react';
import Header from './components/Header';
import Carrusel from './components/Carrusel';
import Nuevos from './components/Nuevos';
import Productos from './components/Productos';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Header />
      <Carrusel />
      <Nuevos />
      <Productos />
      <Footer />
    </div>
  );
}

export default App;
