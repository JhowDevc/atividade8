import React from 'react';
import Header from '../../components/Header/header';
import Footer from '../../components/Footer/footer';
import Banner from '../../components/Banner/banner';
import membro from '../../assets/time1.webp';
import membro1 from '../../assets/time2.png';
import membro2 from '../../assets/time3.png';
import './about.css';

// Certifique-se de ter o Font Awesome incluído no projeto
// Adicione no index.html: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

const About = () => {
  return (
    <>
      <Header />
      <Banner />
      <div className="container py-5">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-dark">
            <i className="fas fa-paw me-2 text-primary"></i>Sobre Nós
          </h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '800px' }}>
            A ideia do projeto surgiu durante as enchentes no Rio Grande do Sul, onde 
            presenciamos a dificuldade de donos e animais perdidos em se reencontrarem. 
            Essa experiência nos motivou a criar uma solução que utilizasse tecnologia 
            avançada e empatia para conectar aqueles que perderam seus pets com pessoas 
            dispostas a ajudar. Assim nasceu nossa plataforma, que busca transformar um 
            momento de angústia em uma jornada de reencontros e solidariedade.
          </p>
        </div>

        {/* Missão, Visão e Valores */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="card h-100 text-center shadow-sm border-0 about-card about-mission-card">
              <div className="card-body p-4">
                <i className="fas fa-bullseye fa-3x text-primary mb-3"></i>
                <h5 className="card-title fw-bold text-primary">Nossa Missão</h5>
                <p className="card-text text-muted">
                  Ajudar a reunir animais perdidos com seus donos, promovendo
                  conexões e solidariedade através de tecnologia e colaboração.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 text-center shadow-sm border-0 about-card about-vision-card">
              <div className="card-body p-4">
                <i className="fas fa-eye fa-3x text-success mb-3"></i>
                <h5 className="card-title fw-bold text-success">Nossa Visão</h5>
                <p className="card-text text-muted">
                  Ser a principal plataforma de apoio para encontrar animais
                  perdidos, criando uma comunidade engajada e conectada.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 text-center shadow-sm border-0 about-card about-values-card">
              <div className="card-body p-4">
                <i className="fas fa-heart fa-3x text-warning mb-3"></i>
                <h5 className="card-title fw-bold text-warning">Nossos Valores</h5>
                <p className="card-text text-muted">
                  Compromisso, empatia, colaboração e inovação são os pilares que
                  sustentam nosso trabalho.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Equipe */}
        <div className="mt-5">
          <h2 className="text-center mb-5 fw-bold">
            <i className="fas fa-users me-2 text-primary"></i>Nossa Equipe
          </h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card text-center h-100 shadow-sm border-0 about-card">
                <img
                  src={membro}
                  className="card-img-top rounded-circle p-3 mx-auto"
                  alt="Luiz Silva"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <i className="fas fa-code fa-2x text-primary mb-3"></i>
                  <h5 className="card-title fw-bold">Luiz Silva</h5>
                  <p className="card-text text-muted mb-0">Desenvolvedor Full Stack</p>
                  <div className="mt-2">
                    <a href="#" className="text-muted me-2"><i className="fab fa-linkedin"></i></a>
                    <a href="#" className="text-muted"><i className="fab fa-github"></i></a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center h-100 shadow-sm border-0 about-card">
                <img
                  src={membro1}
                  className="card-img-top rounded-circle p-3 mx-auto"
                  alt="Ana Silva"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <i className="fas fa-tasks fa-2x text-success mb-3"></i>
                  <h5 className="card-title fw-bold">Ana Silva</h5>
                  <p className="card-text text-muted mb-0">Gerente de Projetos</p>
                  <div className="mt-2">
                    <a href="#" className="text-muted me-2"><i className="fab fa-linkedin"></i></a>
                    <a href="#" className="text-muted"><i className="fab fa-twitter"></i></a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center h-100 shadow-sm border-0 about-card">
                <img
                  src={membro2}
                  className="card-img-top rounded-circle p-3 mx-auto"
                  alt="Carlos Mendes"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <i className="fas fa-brain fa-2x text-warning mb-3"></i>
                  <h5 className="card-title fw-bold">Carlos Mendes</h5>
                  <p className="card-text text-muted mb-0">Especialista em IA</p>
                  <div className="mt-2">
                    <a href="#" className="text-muted me-2"><i className="fab fa-linkedin"></i></a>
                    <a href="#" className="text-muted"><i className="fab fa-researchgate"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-5 py-5 rounded">
          <h3 className="fw-bold">
            <i className="fas fa-question-circle me-2 text-primary"></i>Quer saber mais?
          </h3>
          <p className="text-muted mb-4">
            Entre em contato conosco e descubra como podemos ajudar!
          </p>
         <a  href="/contato"> <button className="btn btn-primary btn-lg">
            <i className="fas fa-envelope me-2"></i>Entre em Contato
          </button></a>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;
