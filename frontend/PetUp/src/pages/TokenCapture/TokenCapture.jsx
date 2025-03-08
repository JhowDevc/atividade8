import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const TokenCapture = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // Salvar o token no localStorage
      localStorage.setItem('jwtToken', token);
      console.log('Token salvo:', token);

      // Limpar a URL e redirecionar para o dashboard
      navigate('/', { replace: true });
    } else {
      // Se não houver token, redirecionar para a página inicial ou login
      navigate('/login', { replace: true });
    }
  }, [navigate, searchParams]);

  return (
    <div>
      <p>Processando autenticação...</p>
    </div>
  );
};

export default TokenCapture;