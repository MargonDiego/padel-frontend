import React, { memo, useEffect, useState } from 'react';
import { Backdrop, Box, CircularProgress, Fade, Typography, Zoom, alpha, keyframes } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import HowToRegIcon from '@mui/icons-material/HowToReg';

interface RegisterSuccessBackdropProps {
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
const RegisterSuccessBackdrop: React.FC<RegisterSuccessBackdropProps> = memo(({ show }) => {
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
                  animation: `${rotate} 2s linear infinite`
                }
              }}
            >
              <CheckCircleIcon
                sx={{
                  fontSize: 60,
                  color: brandColors.success,
                  animation: `${bounce} 2s ease-in-out infinite`,
                  filter: 'drop-shadow(0 0 10px rgba(76, 175, 80, 0.5))'
                }}
              />
              
              {/* Íconos decorativos */}
              <HowToRegIcon
                sx={{
                  fontSize: 30,
                  color: brandColors.secondary,
                  position: 'absolute',
                  top: -10,
                  right: -10,
                  animation: `${bounce} 3s ease-in-out infinite`,
                  filter: 'drop-shadow(0 0 5px rgba(255, 176, 59, 0.7))'
                }}
              />
              
              <SportsTennisIcon
                sx={{
                  fontSize: 25,
                  color: brandColors.primary,
                  position: 'absolute',
                  bottom: -5,
                  left: -5,
                  animation: `${rotate} 10s linear infinite`,
                  filter: 'drop-shadow(0 0 5px rgba(46, 167, 224, 0.7))'
                }}
              />
            </Box>
          </Box>
        </Zoom>
        
        <Fade in={show} timeout={800}>
          <Typography variant="h4" component="h2" 
            sx={{
              fontWeight: 700,
              background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.secondary} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            ¡REGISTRO EXITOSO!
          </Typography>
        </Fade>
        
        <Fade in={show} timeout={1200}>
          <Typography variant="body1" sx={{ color: '#fff', mb: 3 }}>
            Tu cuenta ha sido creada correctamente. Redirigiendo a la página de inicio de sesión...
          </Typography>
        </Fade>
        
        <Fade in={show} timeout={1500}>
          <CircularProgress 
            size={30} 
            sx={{ 
              color: brandColors.secondary,
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round'
              }
            }} 
          />
        </Fade>
      </Box>
    </Backdrop>
  );
});

RegisterSuccessBackdrop.displayName = 'RegisterSuccessBackdrop';

export default RegisterSuccessBackdrop;
