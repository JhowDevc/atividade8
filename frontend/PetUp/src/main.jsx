import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { createBrowserRouter, RouterProvider, useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import Home from './pages/Home';
import About from './pages/About/about';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard/dashboard';
import Settings from './Settings';
import Contact from './pages/Contact/contact';
import Encontre from './pages/Encontre/encontre';
import AddPet from './pages/AddPet/AddPet';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'; // Ajustado para o arquivo correto
import ResetPassword from './pages/ResetPassword/ResetPassword';    // Ajustado para o arquivo correto
import { handleGoogleLoginCallback } from './services/api';

const Root = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      console.log('Token na URL (Root):', token);
      handleGoogleLoginCallback().then((success) => {
        if (success) {
          navigate('/', { replace: true });
        } else {
          navigate('/login', { replace: true });
        }
      });
    }
  }, [token, navigate]);

  return token ? <div>Processando autenticação...</div> : <Home />;
};

const router = createBrowserRouter([
  { path: '/', element: <Root /> },
  { path: '/sobre', element: <About /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/settings', element: <Settings /> },
  { path: '/contato', element: <Contact /> },
  { path: '/encontre-pet', element: <Encontre /> },
  { path: '/cadastra-pet', element: <AddPet /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password', element: <ResetPassword /> },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);