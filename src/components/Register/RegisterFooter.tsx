import React from 'react';
import { Box, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const RegisterFooter: React.FC = () => {
  return (
    <Box 
      sx={{ 
        mt: 3, 
        textAlign: 'center',
        animation: 'fadeIn 1s ease-in-out',
        '@keyframes fadeIn': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        }
      }}
    >
      <MuiLink 
        component={RouterLink} 
        to="/login" 
        variant="body1" 
        sx={{
          color: 'primary.main',
          textDecoration: 'none',
          fontWeight: 500,
          position: 'relative',
          '&:hover': {
            '&:after': {
              width: '100%'
            }
          },
          '&:after': {
            content: '""',
            position: 'absolute',
            width: '0',
            height: '2px',
            bottom: '-2px',
            left: '0',
            background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            transition: 'width 0.3s ease'
          }
        }}
      >
        ¿Ya tienes una cuenta? Inicia sesión
      </MuiLink>
    </Box>
  );
};

export default RegisterFooter;
