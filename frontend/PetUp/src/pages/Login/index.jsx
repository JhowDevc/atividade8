import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginManual, loginWithGoogle, handleGoogleLoginCallback } from '../../services/api'; // Ajustado para subir dois níveis
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
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
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
          {loading ? 'Carregando...' : 'Entrar'}
        </button>
        <button type="button" onClick={handleGoogleLogin} disabled={loading}>
          Login com Google
        </button>
      </form>
      {error && <div className="error">{error}</div>}
      <div className="link">
        <Link to="/forgot-password">Esqueceu a senha?</Link>
      </div>
      <div className="link">
        Não tem conta? <Link to="/register">Cadastre-se</Link>
      </div>
    </div>
  );
};

export default Login;