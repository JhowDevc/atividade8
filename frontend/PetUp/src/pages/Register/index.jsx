import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/auth/register', {
        name,
        email,
        password,
      });
      console.log('Resposta do backend:', response.data);
      const token = response.data;
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Erro ao registrar:', err);
      setError(err.response?.data || 'Erro ao registrar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <Link to="/" className="back-to-home animate-slide-in">
        <i className="bi bi-arrow-left me-2"></i> Voltar para a Home
      </Link>
      <h1 className="register-title animate-slide-in">Crie sua conta no PetUp</h1>
      <p className="register-subtitle animate-slide-in">
        Cadastre-se e junte-se à nossa missão de reunir pets perdidos com seus tutores usando inteligência artificial!
      </p>
      <form onSubmit={handleSubmit} className="register-form animate-slide-in">
        <input
          type="text"
          placeholder="Digite seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Crie uma senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Carregando...' : 'Cadastrar'}
        </button>
      </form>
      {error && <div className="error animate-slide-in">{error}</div>}
      <div className="link animate-slide-in">
        Já tem conta? <Link to="/login">Faça login</Link>
      </div>
      <p className="register-footer animate-slide-in">
        Faça parte da mudança e ajude a transformar vidas, uma patinha de cada vez!
      </p>
    </div>
  );
};

export default Register;