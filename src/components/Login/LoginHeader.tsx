import React, { memo } from 'react';
import { Box, Typography, Zoom, useTheme, alpha } from '@mui/material';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';

interface LoginHeaderProps {
  fadeIn: boolean;
}

// Usar memo para evitar re-renders innecesarios
const LoginHeader: React.FC<LoginHeaderProps> = memo(({ fadeIn }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
      <Zoom in={fadeIn} style={{ transitionDelay: fadeIn ? '300ms' : '0ms' }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          marginBottom: 2
        }}>
          <Box 
            sx={{ 
              width: 70, 
              height: 70, 
              borderRadius: '50%',
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`
            }}
          >
            <SportsTennisIcon 
              sx={{ 
                color: theme.palette.primary.main, 
                fontSize: 40,
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': {
                    transform: 'scale(0.95)',
                  },
                  '50%': {
                    transform: 'scale(1.05)',
                  },
                  '100%': {
                    transform: 'scale(0.95)',
                  },
                },
              }} 
            />
          </Box>
        </Box>
      </Zoom>
      <Typography 
        component="h1" 
        variant="h4" 
        sx={{ 
          fontWeight: 700,
          position: 'relative',
          mb: 1,
          backgroundImage: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          WebkitTextFillColor: 'transparent',
        }}
      >
        PADEL APP
      </Typography>
      <Typography 
        variant="body1" 
        color="text.secondary" 
        align="center" 
        sx={{ 
          mb: 3,
          fontWeight: 500 
        }}
      >
        Inicia sesión para acceder a tu cuenta
      </Typography>
    </Box>
  );
});

LoginHeader.displayName = 'LoginHeader';

export default LoginHeader;
