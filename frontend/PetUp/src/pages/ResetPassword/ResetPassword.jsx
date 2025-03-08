import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../../services/api';
import './style.css';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Token não fornecido. Solicite um novo link de redefinição.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await resetPassword(token, newPassword);
      setMessage(response);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data || 'Erro ao redefinir senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password">
      <h1 className="h1-reset">Redefinir Senha</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="password"
            placeholder="Digite sua nova senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={!token || loading}
          />
        </div>
        <button type="submit" disabled={loading || !token}>
          {loading ? 'Redefinindo...' : 'Redefinir Senha'}
        </button>
      </form>
      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}
      <div className="link">
        <a href="/login">Voltar para o login</a>
      </div>
    </div>
  );
};

export default ResetPassword;