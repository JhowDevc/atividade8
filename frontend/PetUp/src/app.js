import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Header from './components/Header';

function App() {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    userName: localStorage.getItem('userName'),
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userName = params.get('userName');
    console.log('Parâmetros da URL:', { token, userName });
    if (token) {
      localStorage.setItem('token', token);
      if (userName) {
        localStorage.setItem('userName', userName);
      }
      // Atualiza o estado de autenticação
      setAuth({ token, userName });
      // Remove os parâmetros da URL após salvar os dados
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <Router>
      <Header auth={auth} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
