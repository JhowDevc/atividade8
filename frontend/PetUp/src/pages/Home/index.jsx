import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Adicione useLocation e useNavigate
import Header from '../../components/Header/header';
import HeroSection from '../../components/HeroSection/hero';
import Search from '../../components/Search/search';
import Footer from '../../components/Footer/footer';
import RecentPet from '../../components/RecentPet/recentpet';
import Banner from '../../components/Banner/banner';
import api from '../../services/api';
import './style.css';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const location = useLocation(); // Para capturar a query string
  const navigate = useNavigate(); // Para limpar a URL

  // Função para verificar o estado de login
  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    const storedUserName = localStorage.getItem('userName');
    if (token) {
      api
        .get('/usuarios', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const currentUser = response.data.find(
            (user) => user.id === JSON.parse(atob(token.split('.')[1])).id
          );
          if (currentUser) {
            setIsLoggedIn(true);
            setUserName(currentUser.name || storedUserName);
            // Atualiza o localStorage com o nome mais recente, se necessário
            if (currentUser.name && currentUser.name !== storedUserName) {
              localStorage.setItem('userName', currentUser.name);
            }
          } else {
            setIsLoggedIn(false);
            setUserName('');
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
          }
        })
        .catch(() => {
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

  // Captura os parâmetros da query string após o login via Google
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    const userName = searchParams.get('userName');

    if (token && userName) {
      localStorage.setItem('token', token);
      localStorage.setItem('userName', userName);
      checkLoginStatus(); // Verifica o login imediatamente após salvar
      navigate('/', { replace: true }); // Limpa a query string da URL
    } else {
      checkLoginStatus(); // Verifica no carregamento inicial se já há token
    }
  }, [location, navigate]);

  // Escuta mudanças no localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      checkLoginStatus();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <>
      <Header /> {/* Remova isLoggedIn e userName como props */}
      <Banner />
      
      <HeroSection />
      <Search />
      <RecentPet />
      <Footer />
    </>
  );
};

export default Home;