import React, { useState } from 'react';
import { Box, Container, Paper } from '@mui/material';
import { RegisterHeader, RegisterForm, RegisterFooter, RegisterSuccessBackdrop } from '../components/Register';

const RegisterPageModular: React.FC = () => {
  const [showSuccessBackdrop, setShowSuccessBackdrop] = useState(false);

  const handleRegisterSuccess = () => {
    setShowSuccessBackdrop(true);
  };

  return (
    <>
      {/* Backdrop de éxito que se mostrará al completar el registro */}
      <RegisterSuccessBackdrop show={showSuccessBackdrop} />
      
      {/* Contenido principal de la página */}
      <Container 
        component="main" 
        maxWidth="md" 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: '100vh',
          py: 4
        }}
      >
        <Paper 
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
            background: (theme) => theme.palette.mode === 'dark' 
              ? 'linear-gradient(145deg, rgba(26,32,39,1) 0%, rgba(40,46,52,1) 100%)' 
              : 'linear-gradient(145deg, #fff 0%, #f7f9fc 100%)',
            boxShadow: (theme) => theme.palette.mode === 'dark'
              ? '0 10px 30px rgba(0,0,0,0.6)'
              : '0 10px 30px rgba(0,0,0,0.1)',
            border: (theme) => `1px solid ${theme.palette.divider}`,
            opacity: showSuccessBackdrop ? 0 : 1,
            transition: 'opacity 0.5s ease-in-out',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box 
            sx={{ 
              width: '100%',
              position: 'relative',
              zIndex: 2
            }}
          >
            <RegisterHeader />
            <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
            <RegisterFooter />
          </Box>
          
          {/* Elementos decorativos */}
          <Box 
            sx={{
              position: 'absolute',
              top: -100,
              right: -100,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: (theme) => `radial-gradient(circle, ${theme.palette.primary.main}30 0%, transparent 70%)`,
              zIndex: 1
            }}
          />
          <Box 
            sx={{
              position: 'absolute',
              bottom: -80,
              left: -80,
              width: 160,
              height: 160,
              borderRadius: '50%',
              background: (theme) => `radial-gradient(circle, ${theme.palette.secondary.main}30 0%, transparent 70%)`,
              zIndex: 1
            }}
          />
        </Paper>
      </Container>
    </>
  );
};

export default RegisterPageModular;
