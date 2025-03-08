import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../services/api';
import './style.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await forgotPassword(email);
      setMessage(response);
    } catch (err) {
      setError(err.response?.data || 'Erro ao solicitar redefinição de senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password">
      <h1>Esqueceu sua senha?</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}
      <div className="link">
        <Link to="/login">Voltar ao login</Link>
      </div>
    </div>
  );
};

export default ForgotPassword;