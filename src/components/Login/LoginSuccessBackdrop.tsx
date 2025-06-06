import React, { memo, useEffect, useState } from 'react';
import { Backdrop, Box, CircularProgress, Fade, Typography, Zoom, alpha, keyframes } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';

interface LoginSuccessBackdropProps {
  show: boolean;
}

// Definir los keyframes para las animaciones
const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const glowPulse = keyframes`
  0% { box-shadow: 0 0 10px rgba(46, 167, 224, 0.5); }
  50% { box-shadow: 0 0 25px rgba(46, 167, 224, 0.8), 0 0 15px rgba(255, 176, 59, 0.5); }
  100% { box-shadow: 0 0 10px rgba(46, 167, 224, 0.5); }
`;

// Usar memo para evitar re-renders innecesarios
const LoginSuccessBackdrop: React.FC<LoginSuccessBackdropProps> = memo(({ show }) => {
  // Estado para las partículas decorativas
  const [particles, setParticles] = useState<{id: number, x: number, y: number, size: number, speed: number}[]>([]);
  
  // Colores de branding fijos, independientes del tema
  const brandColors = {
    primary: '#2EA7E0',    // Azul Padel
    secondary: '#FFB03B',  // Dorado/Amarillo Padel
    success: '#4CAF50',    // Verde para éxito
    dark: '#1A2027',       // Fondo oscuro
    light: '#F5F5F5'       // Fondo claro
  };

  // Generar partículas decorativas cuando el backdrop se muestra
  useEffect(() => {
    if (show) {
      const newParticles = Array(15).fill(0).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 2,
        speed: Math.random() * 3 + 1
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [show]);

  return (
    <Backdrop
      open={show}
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: alpha(brandColors.dark, 0.9),
        backdropFilter: 'blur(5px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0,
        transition: 'opacity 0.5s ease-in-out',
        ...(show && { opacity: 1 }),
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}
    >
      {/* Partículas decorativas */}
      {particles.map((particle) => (
        <Box
          key={particle.id}
          sx={{
            position: 'absolute',
            width: particle.size,
            height: particle.size,
            background: particle.id % 2 === 0 ? brandColors.primary : brandColors.secondary,
            borderRadius: '50%',
            opacity: 0.6,
            top: `${particle.y}%`,
            left: `${particle.x}%`,
            animation: `${particle.id % 2 === 0 ? bounce : rotate} ${particle.speed * 2}s infinite ease-in-out`,
            filter: 'blur(1px)',
            pointerEvents: 'none'
          }}
        />
      ))}
      
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: { xs: 3, sm: 4 },
          borderRadius: 2,
          background: `linear-gradient(135deg, ${alpha(brandColors.dark, 0.85)} 0%, ${alpha(brandColors.dark, 0.95)} 100%)`,
          boxShadow: `0 16px 40px rgba(0,0,0,0.3)`,
          backdropFilter: 'blur(15px)',
          border: `1px solid ${alpha(brandColors.primary, 0.3)}`,
          width: { xs: '85%', sm: '75%', md: '50%', lg: '42%', xl: '33%' },
          maxWidth: '450px',
          minWidth: { xs: '280px' },
          animation: `${glowPulse} 3s infinite`,
          position: 'absolute',
          zIndex: 2,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'  // Centrado perfecto en cualquier pantalla
        }}
      >
        <Zoom in={show}>
          <Box 
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 3
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: 100,
                height: 100,
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: `radial-gradient(circle, ${alpha(brandColors.primary, 0.2)}, transparent)`,
                overflow: 'visible',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  width: '90%',
                  height: '90%',
                  borderRadius: '50%',
                  border: `3px solid ${brandColors.secondary}`,
                  borderTopColor: 'transparent',
                  borderBottomColor: 'transparent',
                  animation: `${rotate} 3s linear infinite`,
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  width: '105%',
                  height: '105%',
                  borderRadius: '50%',
                  border: `3px solid ${brandColors.primary}`,
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                  animation: `${rotate} 4s linear infinite reverse`,
                }
              }}
            >
              <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Icono de tenis para representar padel */}
                <SportsTennisIcon 
                  sx={{
                    fontSize: 30,
                    color: brandColors.secondary,
                    position: 'absolute',
                    animation: `${bounce} 2s infinite ease-in-out`,
                    transform: 'rotate(35deg)',
                    top: -5,
                    right: -12,
                    zIndex: 1
                  }}
                />
                <CheckCircleIcon 
                  sx={{
                    fontSize: 60,
                    color: brandColors.primary,
                    filter: `drop-shadow(0 0 10px ${alpha(brandColors.primary, 0.7)})`
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Zoom>
        <Fade in={show} timeout={{ enter: 800 }}>
          <Typography variant="h5" component="h2" 
            sx={{
              fontWeight: 800,
              mb: 2,
              background: `linear-gradient(90deg, ${brandColors.primary}, ${brandColors.secondary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: 1.2,
              fontSize: { xs: '1.5rem', sm: '1.8rem' },
              textTransform: 'uppercase',
              textShadow: `0 2px 10px ${alpha(brandColors.primary, 0.5)}`,
              fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif'
            }}
          >
            ¡Inicio de sesión exitoso!
          </Typography>
        </Fade>
        <Fade in={show} timeout={{ enter: 1000 }}>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#FFF',
              fontWeight: 500,
              letterSpacing: 0.5,
              opacity: 0.9,
              mb: 1
            }}
          >
            Redirigiendo a tu cuenta...
          </Typography>
        </Fade>
        
        <Box sx={{ mt: 3, position: 'relative', width: 50, height: 50 }}>
          <CircularProgress 
            size={40} 
            thickness={4}
            sx={{
              color: brandColors.primary,
              position: 'relative',
              zIndex: 2
            }} 
          />
          <CircularProgress 
            size={40} 
            thickness={3}
            sx={{
              color: brandColors.secondary,
              opacity: 0.7,
              position: 'absolute',
              left: 0,
              top: 0,
              animation: `${rotate} 3s linear infinite reverse`,
              zIndex: 1
            }} 
          />
        </Box>
      </Box>
    </Backdrop>
  );
});

LoginSuccessBackdrop.displayName = 'LoginSuccessBackdrop';

export default LoginSuccessBackdrop;
