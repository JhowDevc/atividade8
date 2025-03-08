import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React from 'react';
import pet1 from '../../assets/pet1.webp'; // Caminho para a imagem da logo
import pet2 from '../../assets/pet2.webp'; 
import pet3 from '../../assets/pet-3.png'; 
import './hero.css';

function HeroSection() {
return (

  <div className='tema-hero'>
  <section className="container hero py-5" >
   
      
    
  <div className='row'>
    
  <div className="hero-content text-align-center text-center justify-content-center">

    <div className='texts pb-3'>
    <h2>Conectando Animais Perdidos aos Seus Donos</h2>
    <p>Com a ajuda da IA, encontramos seu amigo de forma mais rápida e eficiente.</p>
    </div>

    <div className="imagens-hero d-flex justify-content-between ">
  <img className="hero-ims  float-start img-fluid" src={pet1} alt="Imagem 1" />
  <img className="hero-ims  float-start img-fluid" src={pet2} alt="Imagem 2" />
  <img className="hero-ims  float-start img-fluid" src={pet3} alt="Imagem 3" />
</div>
    <div className="hero-buttons mt-5 ">
      <button className="btn-primary py-2 px-3 ">Encontrei um Pet</button>
      <button className="btn-primary py-2 px-3 mx-3">Procuro Meu Pet</button>
    </div>
  </div>

  </div>
  </section>
  </div>
  );
}




export default HeroSection;
