import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

interface HeroBannerProps {
  isAuthenticated: boolean;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ isAuthenticated }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '280px', sm: '350px', md: '450px' },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        mb: { xs: 2, md: 6 },
        borderRadius: { xs: 0, sm: 2 },
        overflow: 'hidden',
        p: { xs: 1.5, sm: 2, md: 4 },
      }}
    >
      {/* Fondo con gradiente y patrón */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: (theme) => `linear-gradient(135deg, 
            ${theme.palette.primary.dark} 0%, 
            ${theme.palette.primary.main} 50%, 
            ${theme.palette.secondary.main} 100%)`,
          opacity: 0.9,
          zIndex: 0,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/padded.png")',
            opacity: 0.1,
          }
        }}
      />

      {/* Imagen de fondo */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url("https://images.unsplash.com/photo-1625463204208-e837cf256281")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.2,
          zIndex: 0,
        }}
      />

      {/* Elementos decorativos */}
      <SportsTennisIcon 
        sx={{ 
          position: 'absolute', 
          top: '10%', 
          left: '5%', 
          fontSize: { xs: 40, md: 60 }, 
          color: 'white', 
          opacity: 0.2,
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '50%': { transform: 'translateY(-20px) rotate(180deg)' },
          }
        }} 
      />
      
      <SportsTennisIcon 
        sx={{ 
          position: 'absolute', 
          bottom: '15%', 
          right: '8%', 
          fontSize: { xs: 30, md: 50 }, 
          color: 'white', 
          opacity: 0.2,
          animation: 'float2 8s ease-in-out infinite',
          '@keyframes float2': {
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '50%': { transform: 'translateY(-15px) rotate(-180deg)' },
          }
        }} 
      />

      {/* Contenido */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          maxWidth: { xs: '100%', md: 800 },
        }}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            fontSize: { xs: '1.5rem', sm: '2.25rem', md: '3rem' },
            lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 },
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            background: 'linear-gradient(45deg, #fff 30%, rgba(255,255,255,0.8) 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: { xs: 1, sm: 2, md: 3 }
          }}
        >
          Bienvenido a PADEL APP
        </Typography>
        
        <Typography 
          variant="h5" 
          sx={{ 
            mb: { xs: 2, sm: 3, md: 4 }, 
            color: 'white', 
            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.25rem' },
            px: { xs: 1, sm: 0 }
          }}
        >
          La plataforma para gestionar torneos, equipos y partidos de pádel
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: { xs: 1, sm: 2 }, 
          flexWrap: 'wrap',
          mt: { xs: 1, sm: 2 }
        }}>
          <Button
            component={RouterLink}
            to="/tournaments"
            variant="contained"
            size="large"
            startIcon={<EmojiEventsIcon />}
            sx={{ 
              bgcolor: 'secondary.main', 
              color: 'secondary.contrastText',
              fontWeight: 'bold',
              borderRadius: 2,
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.5 },
              fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
              '&:hover': {
                bgcolor: 'secondary.dark',
                transform: 'translateY(-3px)',
                boxShadow: 3
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            Ver Torneos
          </Button>
          
          {!isAuthenticated && (
            <Button
              component={RouterLink}
              to="/register"
              variant="outlined"
              size="large"
              startIcon={<PersonAddIcon />}
              sx={{ 
                color: 'white', 
                borderColor: 'white',
                borderRadius: 2,
                px: { xs: 2, md: 3 },
                py: { xs: 1, md: 1.5 },
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                },
                transition: 'all 0.2s'
              }}
            >
              Registrarse
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default HeroBanner;
