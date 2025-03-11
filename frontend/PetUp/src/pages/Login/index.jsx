import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginManual, loginWithGoogle, handleGoogleLoginCallback } from '../../services/api';
import './style.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const processGoogleLogin = async () => {
      const success = await handleGoogleLoginCallback();
      if (success) {
        navigate('/dashboard');
      }
    };
    processGoogleLogin();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await loginManual(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Erro ao fazer login');
      }
    } catch (err) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  return (
    <div className="login">
      <Link to="/" className="back-to-home animate-slide-in">
        <i className="bi bi-arrow-left me-2"></i> Voltar para a Home
      </Link>
      <h1 className="login-title animate-slide-in">Bem-vindo ao PetUp</h1>
      <p className="login-subtitle animate-slide-in">
        Faça login para ajudar a reunir pets perdidos com seus tutores usando nossa IA inovadora!
      </p>
      <form onSubmit={handleSubmit} className="login-form animate-slide-in">
        <input
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Carregando...' : 'Entrar'}
        </button>
        <button type="button" onClick={handleGoogleLogin} disabled={loading}>
          Login com Google
        </button>
      </form>
      {error && <div className="error animate-slide-in">{error}</div>}
      <div className="link animate-slide-in">
        <Link to="/forgot-password">Esqueceu a senha?</Link>
      </div>
      <div className="link animate-slide-in">
        Não tem conta? <Link to="/register">Cadastre-se</Link>
      </div>
      <p className="login-footer animate-slide-in">
        Junte-se à nossa missão de transformar vidas, uma patinha de cada vez.
      </p>
    </div>
  );
};

export default Login;