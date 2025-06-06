import React from 'react';
import { Typography, Box, Button, Paper, Avatar, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import type { User } from '../../types/models';

interface WelcomeSectionProps {
  user: User | null;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ user }) => {
  const theme = useTheme();
  
  if (!user) return null;
  
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: { xs: 2, sm: 2.5, md: 3 }, 
        mb: { xs: 2, sm: 3, md: 4 }, 
        borderRadius: 2,
        background: theme.palette.mode === 'dark' 
          ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[900]} 100%)`
          : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[100]} 100%)`,
        border: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'center', sm: 'center' },
        gap: { xs: 1.5, sm: 2 }
      }}
    >
      <Avatar 
        src={user.photo ? `/uploads/user-photo/${user.photo}` : undefined}
        alt={user.name}
        sx={{ 
          width: { xs: 60, md: 70 }, 
          height: { xs: 60, md: 70 },
          border: `3px solid ${theme.palette.primary.main}`,
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          fontSize: '1.75rem',
          bgcolor: theme.palette.primary.main
        }}
      >
        {user.name?.charAt(0) || 'U'}
      </Avatar>
      
      <Box sx={{ flex: 1 }}>
        <Typography 
          variant="h5" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontSize: { xs: '1.25rem', md: '1.5rem' }
          }}
        >
          Hola, {user.name}! 
          <Box component="span" sx={{ fontSize: '1.5rem' }}>👋</Box>
        </Typography>
        
        <Typography 
          variant="body1" 
          paragraph
          sx={{ 
            mb: { xs: 2, md: 3 },
            color: theme.palette.text.secondary,
            maxWidth: { sm: '80%', md: '70%' }
          }}
        >
          Bienvenido de nuevo a la plataforma. Aquí podrás gestionar tus equipos, inscribirte en torneos y llevar un seguimiento de tus estadísticas.
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          flexWrap: 'wrap'
        }}>
          <Button
            component={RouterLink}
            to="/my-teams"
            variant="contained"
            color="primary"
            startIcon={<GroupsIcon />}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 2
              },
              transition: 'all 0.2s'
            }}
          >
            Mis Equipos
          </Button>
          
          <Button
            component={RouterLink}
            to="/profile"
            variant="outlined"
            color="primary"
            startIcon={<PersonIcon />}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 1
              },
              transition: 'all 0.2s'
            }}
          >
            Mi Perfil
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default WelcomeSection;
