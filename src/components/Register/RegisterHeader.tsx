import React from 'react';
import { Box, Typography } from '@mui/material';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';

const RegisterHeader: React.FC = () => {
  return (
    <Box sx={{ 
      mb: 3, 
      display: 'flex', 
      alignItems: 'center', 
      flexDirection: 'column',
      animation: 'fadeIn 0.8s ease-in-out',
      '@keyframes fadeIn': {
        '0%': { opacity: 0, transform: 'translateY(-10px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' }
      }
    }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        height: 70,
        borderRadius: '50%',
        background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        mb: 2,
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 6px 25px rgba(0, 0, 0, 0.2)',
        },
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}>
        <SportsTennisIcon sx={{ 
          fontSize: 40, 
          color: '#fff',
          animation: 'spin 20s linear infinite',
          '@keyframes spin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' }
          }
        }} />
      </Box>
      <Typography component="h1" variant="h4" sx={{ 
        fontWeight: 700,
        background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        mb: 1
      }}>
        Crear cuenta
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ maxWidth: 450, px: 2 }}>
        Únete a la comunidad Padel y comienza a disfrutar de todos los beneficios
      </Typography>
    </Box>
  );
};

export default RegisterHeader;
