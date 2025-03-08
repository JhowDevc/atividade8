import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { checkLoginStatus } from '../../services/api';
import logo from '../../assets/logo.png';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const storedUserName = localStorage.getItem('userName');

    if (token && storedUserName) {
      // Se o token e o nome estão no localStorage, usa diretamente
      setIsLoggedIn(true);
      setUserName(storedUserName);
    } else if (token) {
      // Se há token mas não há nome, valida com o backend
      checkLoginStatus()
        .then((data) => {
          const name = data.name;
          if (name) {
            setUserName(name);
            setIsLoggedIn(true);
            localStorage.setItem('userName', name); // Atualiza o localStorage
          }
        })
        .catch((err) => {
          setIsLoggedIn(false);
          setUserName('');
          localStorage.removeItem('token');
          localStorage.removeItem('userName');
        });
    } else {
      setIsLoggedIn(false);
      setUserName('');
    }
  };

  // Esse effect vai ser executado apenas uma vez, no carregamento inicial.
  useEffect(() => {
    checkAuthStatus();
  }, []); // A dependência vazia [] faz o efeito rodar apenas uma vez

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserName('');
    navigate('/');
  };

  return (
    <header className="header py-3">
      <section className="container">
        <div className="d-flex align-items-center justify-content-between">
          <div className="logo">
            <Link to="/">
              <img className="logo_img w-50" src={logo} alt="Logo do site" />
            </Link>
          </div>
          <nav className="navbar navbar-expand-lg navbar-light">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Início</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/sobre">Como Funciona</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/cadastra-pet">Cadastre um Pet</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/encontre-pet">Encontre seu Pet</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/contato">Contato</Link>
                </li>
              </ul>
            </div>
          </nav>
          <div className="d-flex align-items-center">
            <button
              type="button"
              className="btn btn-outline-light me-3"
              onClick={toggleTheme}
            >
              {theme === 'light' ? 'Escuro' : 'Claro'}
            </button>
            {isLoggedIn ? (
              <>
                <span className="me-3 text-white">Olá, {userName}</span>
                <button className="btn btn-primary" onClick={handleLogout}>
                  Sair
                </button>
              </>
            ) : (
              <div className="d-none d-lg-block">
                <Link to="/login" className="btn btn-primary me-2">Login</Link>
                <Link to="/register" className="btn btn-primary">Cadastro</Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </header>
  );
}

export default Header;
