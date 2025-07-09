import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Contacto = () => {
  return (
    <div>
      <Header />
      <main className="form-content">
        <h2>Contáctanos</h2>
        <p>📧 soporte@mundoanimal.com</p>
        <p>📞 +56976739599</p>
        <p>¡Estamos para ayudarte!</p>
      </main>
      <Footer />
    </div>
  );
};

export default Contacto;