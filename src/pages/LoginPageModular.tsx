import React, { useState, useEffect } from 'react';
import {
  Box,
  alpha,
  useTheme
} from '@mui/material';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import {
  LoginHeader,
  LoginForm,
  LoginFooter,
  LoginSuccessBackdrop
} from '../components/Login';

const LoginPageModular: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  // Estados para controlar la animación y UI
  const [fadeIn, setFadeIn] = useState<boolean>(false);
  const [loginSuccessful, setLoginSuccessful] = useState<boolean>(false);
  
  // Trigger animations on component mount
  useEffect(() => {
    setFadeIn(true);
  }, []);

  // Manejar el login exitoso
  const handleLoginSuccess = () => {
    console.log('Login exitoso, mostrando animación');
    // Activar el backdrop de éxito
    setLoginSuccessful(true);
    
    // Determinar la URL de retorno con la siguiente prioridad:
    // 1. Parámetro de consulta returnUrl (del interceptor de API)
    // 2. State.from de React Router (de ProtectedRoute)
    // 3. Página principal / como fallback
    
    // Verificar si tenemos el parámetro returnUrl en la URL
    let returnPath = searchParams.get('returnUrl');
    
    // Si no hay parámetro, intentar usar el state de React Router
    if (!returnPath && location.state && location.state.from) {
      returnPath = location.state.from.pathname;
    }
    
    // Si no hay ninguno de los dos, usar la página principal
    const finalPath = returnPath || '/';
    console.log('URL de retorno:', finalPath);
    
    // Reducimos el tiempo de espera para la navegación inmediata
    // Mostramos la animación brevemente pero navegamos rápido para evitar pantallas intermedias
    setTimeout(() => {
      // Usar replace:true para reemplazar en el historial y evitar navegación hacia atrás
      navigate(decodeURIComponent(finalPath), { replace: true });
    }, 1500);
  };

  // Background pattern style
  const backgroundPattern = {
    backgroundImage: `linear-gradient(${alpha(theme.palette.primary.main, 0.1)} 1px, transparent 1px), 
       linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.1)} 1px, transparent 1px)`,
    backgroundSize: '40px 40px',
  };
  
  return (
    <Box 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        ...backgroundPattern,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: `linear-gradient(135deg, 
            ${alpha(theme.palette.primary.main, 0.7)} 0%, 
            ${alpha(theme.palette.secondary.main, 0.5)} 100%)
          `,
          transform: 'skewY(-6deg)',
          transformOrigin: 'top left',
          zIndex: 0,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '40%',
          height: '40%',
          background: `radial-gradient(
            circle, 
            ${alpha(theme.palette.secondary.main, 0.4)} 0%, 
            transparent 70%
          )`,
          zIndex: 0,
        }
      }}
    >
      {/* Si el login fue exitoso, mostrar solo el backdrop */}
      {loginSuccessful ? (
        <LoginSuccessBackdrop show={true} />
      ) : (
        /* Si no hay login exitoso aún, mostrar el formulario de login */
        <Box 
          sx={{ 
            width: { xs: '90%', sm: '75%', md: '50%', lg: '42%', xl: '33%' },
            maxWidth: '450px',
            zIndex: 1
          }}
        >
          {/* Usamos un componente Box en lugar de Paper para mantener el código simple
             y dejar que los componentes modulares manejen su propia apariencia */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              borderRadius: 3,
              opacity: fadeIn ? 1 : 0,
              transform: fadeIn ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
            }}
          >
            {/* Componente de cabecera con logo y título */}
            <LoginHeader fadeIn={fadeIn} />
            
            {/* Componente de formulario que maneja la lógica de validación, UI y errores */}
            <LoginForm 
              onLoginSuccess={handleLoginSuccess}
            />
            
            {/* Componente de footer con enlaces de registro */}
            <LoginFooter />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default LoginPageModular;
