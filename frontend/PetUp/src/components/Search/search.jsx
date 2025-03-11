import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React from 'react';
import './search.css';

function Search() {
  return (
    <div className="search-wrapper">
      <section className="container search py-5 text-align-center text-center justify-content-center">
        <div className="row">
         

          {/* Seção "Conheça o Projeto" sem fundo colorido e com tamanhos de fonte consistentes */}
          <div className="about-project-section mt-5">
            <h2 className="about-project-title animate-slide-in">
              Conheça Mais Sobre o Nosso Projeto
            </h2>
            <p className="about-project-text animate-slide-in">
              O <strong>PetUp</strong> é um projeto inovador que utiliza <strong>inteligência artificial</strong> para
              buscar pets perdidos e ajudar esses animais a reencontrarem seus donos. Nossa tecnologia analisa
              características como cor, tamanho e raça para identificar pets em tempo real, conectando tutores
              desesperados com seus melhores amigos. Além disso, criamos uma plataforma que une uma comunidade
              apaixonada por animais, oferecendo suporte e esperança em momentos difíceis.
            </p>
            <div className="about-project-highlights animate-slide-in">
              <div className="highlight-item">
                <i className="bi bi-search-heart me-2"></i>
                <span>Busca avançada com IA para localizar pets perdidos</span>
              </div>
              <div className="highlight-item">
                <i className="bi bi-house-heart me-2"></i>
                <span>Reencontros emocionantes entre pets e seus tutores</span>
              </div>
              <div className="highlight-item">
                <i className="bi bi-people me-2"></i>
                <span>Comunidade solidária para apoiar e compartilhar histórias</span>
              </div>
            </div>
            <p className="about-project-footer animate-slide-in">
              Desde o início, o PetUp já ajudou dezenas de famílias a se reunirem com seus pets. Faça parte
              dessa missão e descubra como nossa tecnologia e dedicação estão transformando vidas – uma patinha
              de cada vez!
            </p>
            <a href="/sobre" className="btn btn-primary px-3 py-2">
              Saiba Mais
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Search;