import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import carrusel1 from '../assets/carrusel/carrusel1.png';
import carrusel2 from '../assets/carrusel/carrusel2.png';
import carrusel3 from '../assets/carrusel/carrusel3.png';

const Carrusel = () => {
  return (
    <div style={{ Width: '100%',maxWidth:'900'}}>
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        interval={3000}
        axis="horizontal"
      >
        <div>
          <img src={carrusel1} alt="Imagen 1" />
        </div>
        <div>
          <img src={carrusel2} alt="Imagen 2" />
        </div>
        <div>
          <img src={carrusel3} alt="Imagen 3" />
        </div>
      </Carousel>
    </div>
  );
};

export default Carrusel;
