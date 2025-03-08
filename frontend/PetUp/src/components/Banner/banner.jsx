import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React from 'react';
import pet1 from '../../assets/pet1.webp'; // Caminho para a imagem da logo
import pet2 from '../../assets/pet2.webp'; 
import pet3 from '../../assets/pet-3.png'; 
import './banner.css';

function Banner() {
return (

 
    <section className="container-fluid banner d-flex align-items-center justify-content-center text-center">
        <div className='container'>
    <div className="row">
      <div className="col-12 col-md-8 col-lg-12 text-center text-banner px-4">
        <h1 className='py-3'>
          Conecte-se com a comunidade e ajude a <br></br> encontrar animais perdidos.
        </h1>
        <p>
          Nosso objetivo é conectar pessoas que encontraram animais perdidos com seus donos. Através da nossa plataforma, você pode ajudar a reunir os pets com suas famílias, compartilhando informações e imagens. Junte-se à nossa comunidade e faça a diferença na vida desses animais e seus donos!
        </p>
      </div>
      </div>
    </div>
  </section>
  

  );
}






export default Banner;
