import React from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import TeamCard from './TeamCard';

interface TeamStat {
  id: number;
  teamId: number;
  team: {
    id: number;
    name: string;
    logo?: string;
  };
  rankingPoints: number;
  matchesWon: number;
  matchesLost: number;
  winRatio: number;
}

interface TeamsSectionProps {
  teams: TeamStat[];
}

const TeamsSection: React.FC<TeamsSectionProps> = ({ teams }) => {
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
              bgcolor: theme.palette.warning.main
            }
          }}
        >
          <LeaderboardIcon sx={{ mr: 1, color: theme.palette.warning.main }} />
          Equipos Destacados
        </Typography>
        
        {!isMobile && teams.length > 0 && (
          <Button
            component={RouterLink}
            to="/rankings/teams"
            variant="outlined"
            color="primary"
            endIcon={<LeaderboardIcon />}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': {
                bgcolor: theme.palette.action.hover
              }
            }}
          >
            Ver Ranking Completo
          </Button>
        )}
      </Box>
      
      {teams.length > 0 ? (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {teams.map((team, index) => (
              <Box key={team.id} sx={{ width: '100%' }}>
                <TeamCard teamStat={team} rank={index + 1} />
              </Box>
            ))}
          </Box>
          
          {isMobile && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                component={RouterLink}
                to="/rankings/teams"
                variant="contained"
                color="primary"
                fullWidth
                endIcon={<LeaderboardIcon />}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  maxWidth: '100%'
                }}
              >
                Ver Ranking Completo
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
            No hay datos de equipos disponibles.
          </Typography>
          <Button
            component={RouterLink}
            to="/rankings/teams"
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Ver Rankings
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TeamsSection;
