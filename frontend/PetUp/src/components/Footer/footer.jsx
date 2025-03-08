import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React from 'react';
import './footer.css';

function Footer() {
return (

 
    <div className="d-flex flex-column">
    <div className="container flex-grow-1">
      {/* Seu conteúdo principal aqui */}
    </div>
  
    <footer className="py-3 mt-auto">
      <div className="container text-center">
        <p>© 2025 Pet Up. Todos os direitos reservados.</p>
        <nav>
          <a href="#termos" className=" mx-3">Termos de Uso</a>
          <a href="#politica" className=" mx-3">Política de Privacidade</a>
          <a href="#contato" className=" mx-3">Contato</a>
        </nav>
      </div>
    </footer>
  </div>
  

  );
}



export default Footer;
