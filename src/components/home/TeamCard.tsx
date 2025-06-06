import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  LinearProgress,
  useTheme,
  Avatar,
  Divider
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsIcon from '@mui/icons-material/Groups';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';

interface TeamStatProps {
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

interface TeamCardProps {
  teamStat: TeamStatProps;
  rank: number;
}

const TeamCard: React.FC<TeamCardProps> = ({ teamStat, rank }) => {
  const theme = useTheme();
  
  // Determinar color basado en el ranking
  const getRankColor = (rank: number) => {
    if (rank === 1) return theme.palette.warning.main; // Gold
    if (rank === 2) return '#A7A7AD'; // Silver
    if (rank === 3) return '#CD7F32'; // Bronze
    return theme.palette.primary.main;
  };
  
  // Calcular el porcentaje de victorias para la barra de progreso
  const totalMatches = teamStat.matchesWon + teamStat.matchesLost;
  const winPercentage = totalMatches > 0 ? (teamStat.matchesWon / totalMatches) * 100 : 0;
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        borderRadius: 2,
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        },
        overflow: 'visible',
        position: 'relative'
      }}
    >
      {/* Badge de ranking */}
      <Box
        sx={{
          position: 'absolute',
          top: -10,
          right: -10,
          width: 36,
          height: 36,
          borderRadius: '50%',
          bgcolor: getRankColor(rank),
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          boxShadow: 2,
          zIndex: 2,
          border: `2px solid ${theme.palette.background.paper}`
        }}
      >
        {rank}
      </Box>
      
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {teamStat.team.logo ? (
            <Avatar 
              src={`/uploads/team-logo/${teamStat.team.logo}`}
              alt={teamStat.team.name}
              sx={{ 
                width: 48, 
                height: 48,
                mr: 2,
                border: `2px solid ${theme.palette.divider}`
              }}
            />
          ) : (
            <Avatar 
              sx={{ 
                width: 48, 
                height: 48,
                mr: 2,
                bgcolor: theme.palette.primary.main
              }}
            >
              <GroupsIcon />
            </Avatar>
          )}
          
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {teamStat.team.name}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 1.5 }} />
        
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <MilitaryTechIcon sx={{ fontSize: 18, mr: 1, color: theme.palette.warning.main }} />
            <Typography variant="body2" sx={{ fontWeight: 'bold', mr: 1 }}>
              Ranking:
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              {teamStat.rankingPoints} puntos
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <EmojiEventsIcon sx={{ fontSize: 18, mr: 1, color: theme.palette.success.main }} />
            <Typography variant="body2" sx={{ fontWeight: 'bold', mr: 1 }}>
              Victorias/Derrotas:
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              {teamStat.matchesWon}/{teamStat.matchesLost}
            </Typography>
          </Box>
          
          <Box sx={{ mt: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Ratio de victorias:
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 'bold',
                  color: winPercentage > 50 
                    ? theme.palette.success.main 
                    : theme.palette.error.main
                }}
              >
                {winPercentage.toFixed(1)}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={winPercentage} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                bgcolor: theme.palette.mode === 'dark' 
                  ? 'rgba(255,255,255,0.1)' 
                  : 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: winPercentage > 50 
                    ? theme.palette.success.main 
                    : theme.palette.error.main
                }
              }} 
            />
          </Box>
        </Box>
        
        <Box sx={{ mt: 'auto' }}>
          <Button
            component={RouterLink}
            to={`/teams/${teamStat.teamId}`}
            variant="outlined"
            size="small"
            fullWidth
            startIcon={<GroupsIcon />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': {
                bgcolor: theme.palette.action.hover
              }
            }}
          >
            Ver Equipo
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TeamCard;
