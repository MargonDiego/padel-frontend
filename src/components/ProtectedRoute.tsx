import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

interface ProtectedRouteProps {
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  redirectPath = '/login'
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Mostrar indicador de carga mientras verificamos autenticación
  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '100vh'
        }}
      >
        <CircularProgress color="primary" />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Verificando acceso...
        </Typography>
      </Box>
    );
  }

  // Si no está autenticado, redirigir a la página de login
  // pero guardar la ruta a la que intentaba acceder
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Si está autenticado, renderizar los componentes hijos
  return <Outlet />;
};

export default ProtectedRoute;
