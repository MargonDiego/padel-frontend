import React from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  useTheme,
  useMediaQuery,
  Paper
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TournamentCard from './TournamentCard';
import type { Tournament } from '../../types/models';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface TournamentsSectionProps {
  tournaments: Tournament[];
}

const TournamentsSection: React.FC<TournamentsSectionProps> = ({ tournaments }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box sx={{ mb: { xs: 4, md: 6 } }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: { xs: 2, md: 3 },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 }
        }}
      >
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            fontWeight: 'bold',
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -4,
              left: 0,
              width: '40%',
              height: 4,
              borderRadius: 2,
              bgcolor: theme.palette.secondary.main
            }
          }}
        >
          <EmojiEventsIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
          Torneos Próximos
        </Typography>
        
        {!isMobile && tournaments.length > 0 && (
          <Button
            component={RouterLink}
            to="/tournaments"
            variant="outlined"
            color="primary"
            endIcon={<EmojiEventsIcon />}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': {
                bgcolor: theme.palette.action.hover
              }
            }}
          >
            Ver Todos
          </Button>
        )}
      </Box>
      
      {tournaments.length > 0 ? (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {tournaments.map((tournament) => (
              <Box key={tournament.id} sx={{ width: '100%' }}>
                <TournamentCard tournament={tournament} />
              </Box>
            ))}
          </Box>
          
          {isMobile && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                component={RouterLink}
                to="/tournaments"
                variant="contained"
                color="primary"
                fullWidth
                endIcon={<EmojiEventsIcon />}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  maxWidth: '100%'
                }}
              >
                Ver Todos los Torneos
              </Button>
            </Box>
          )}
        </>
      ) : (
        <Box 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            borderRadius: 2
          }}
        >
          <Typography variant="body1" sx={{ mb: 2 }}>
            No hay torneos próximos disponibles.
          </Typography>
          <Button
            component={RouterLink}
            to="/tournaments"
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Ver Todos los Torneos
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TournamentsSection;
