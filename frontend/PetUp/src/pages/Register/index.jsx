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
      console.log('Resposta do backend:', response.data); // Adicionar log para depuração
      const token = response.data; // O token é retornado como string
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Erro ao registrar:', err); // Adicionar log para depuração
      setError(err.response?.data || 'Erro ao registrar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <h1>Cadastro</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Carregando...' : 'Cadastrar'}
        </button>
      </form>
      {error && <div className="error">{error}</div>}
      <div className="link">
        Já tem conta? <Link to="/login">Faça login</Link>
      </div>
    </div>
  );
};

export default Register;