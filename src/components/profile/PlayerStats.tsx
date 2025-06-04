import React from 'react';
import { Box, Typography, CircularProgress, Stack, Paper, Divider, Card, CardContent, LinearProgress } from '@mui/material';
import { 
  EmojiEvents as TrophyIcon,
  SportsTennis as TennisIcon,
  Score as ScoreIcon,
  Speed as RatioIcon,
  ShowChart as StatsIcon,
  CalendarToday as CalendarIcon,
  EmojiEventsOutlined as RankingIcon
} from '@mui/icons-material';
import type { PlayerStat } from '../../types/models';

interface PlayerStatsProps {
  stats: PlayerStat | null;
  isLoading: boolean;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box sx={{ textAlign: 'center', p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No hay estadísticas disponibles
        </Typography>
      </Box>
    );
  }

  // Calcular valores para barras de progreso
  const matchWinRate = stats.matchesPlayed > 0 ? (stats.matchesWon / stats.matchesPlayed) * 100 : 0;
  const setWinRate = stats.setsPlayed > 0 ? (stats.setsWon / stats.setsPlayed) * 100 : 0;
  const tournamentWinRate = stats.tournamentsPlayed > 0 ? (stats.tournamentsWon / stats.tournamentsPlayed) * 100 : 0;
  
  return (
    <Box>
      <Card sx={{ mb: 3, overflow: 'visible' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <StatsIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" color="primary">
              Resumen de Estadísticas
            </Typography>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {/* Información de Ranking y Ratio */}
            <Box sx={{ flex: 1, minWidth: '280px' }}>
              <Paper sx={{ p: 2, height: '100%', borderRadius: 2, boxShadow: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <RankingIcon sx={{ color: 'primary.main', mr: 1 }} />
                      <Typography variant="subtitle1">Puntos de Ranking</Typography>
                    </Box>
                    <Typography variant="h4" color="primary" fontWeight="bold">{stats.rankingPoints}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <RatioIcon sx={{ color: 'success.main', mr: 1 }} />
                      <Typography variant="subtitle1">Ratio de Victorias</Typography>
                    </Box>
                    <Typography variant="h4" color="success.main" fontWeight="bold">{stats.winRatio}%</Typography>
                  </Box>
                </Stack>
              </Paper>
            </Box>
            
            {/* Última Actividad */}
            <Box sx={{ flex: 1, minWidth: '280px' }}>
              <Paper sx={{ p: 2, height: '100%', borderRadius: 2, boxShadow: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarIcon sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="subtitle1">Última Actividad</Typography>
                </Box>
                
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body1" fontWeight="medium">
                    Último partido: 
                  </Typography>
                  <Typography variant="h6" color="text.primary">
                    {stats.lastMatchDate ? new Date(stats.lastMatchDate).toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'No disponible'}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      {/* Estadísticas de Partidos */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TennisIcon sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h6" color="primary">Partidos</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: '1 1 30%', minWidth: '100px' }}>
              <Box sx={{ textAlign: 'center', bgcolor: 'background.paper', p: 2, borderRadius: 2 }}>
                <Typography variant="h3" color="text.primary">{stats.matchesPlayed}</Typography>
                <Typography variant="body2" color="text.secondary">Jugados</Typography>
              </Box>
            </Box>
            
            <Box sx={{ flex: '1 1 30%', minWidth: '100px' }}>
              <Box sx={{ textAlign: 'center', bgcolor: 'success.light', color: 'success.contrastText', p: 2, borderRadius: 2 }}>
                <Typography variant="h3" color="success.main">{stats.matchesWon}</Typography>
                <Typography variant="body2">Ganados</Typography>
              </Box>
            </Box>
            
            <Box sx={{ flex: '1 1 30%', minWidth: '100px' }}>
              <Box sx={{ textAlign: 'center', bgcolor: 'error.light', color: 'error.contrastText', p: 2, borderRadius: 2 }}>
                <Typography variant="h3" color="error.main">{stats.matchesLost}</Typography>
                <Typography variant="body2">Perdidos</Typography>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">Efectividad</Typography>
              <Typography variant="body2" fontWeight="bold">{matchWinRate.toFixed(0)}%</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={matchWinRate} 
              sx={{ 
                height: 8, 
                borderRadius: 5,
                bgcolor: 'background.paper',
                '& .MuiLinearProgress-bar': {
                  bgcolor: matchWinRate > 70 ? 'success.main' : matchWinRate > 40 ? 'warning.main' : 'error.main',
                }
              }} 
            />
          </Box>
        </CardContent>
      </Card>
      
      {/* Estadísticas de Sets */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ScoreIcon sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h6" color="primary">Sets</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: '1 1 30%', minWidth: '100px' }}>
              <Box sx={{ textAlign: 'center', bgcolor: 'background.paper', p: 2, borderRadius: 2 }}>
                <Typography variant="h3" color="text.primary">{stats.setsPlayed}</Typography>
                <Typography variant="body2" color="text.secondary">Jugados</Typography>
              </Box>
            </Box>
            
            <Box sx={{ flex: '1 1 30%', minWidth: '100px' }}>
              <Box sx={{ textAlign: 'center', bgcolor: 'success.light', color: 'success.contrastText', p: 2, borderRadius: 2 }}>
                <Typography variant="h3" color="success.main">{stats.setsWon}</Typography>
                <Typography variant="body2">Ganados</Typography>
              </Box>
            </Box>
            
            <Box sx={{ flex: '1 1 30%', minWidth: '100px' }}>
              <Box sx={{ textAlign: 'center', bgcolor: 'error.light', color: 'error.contrastText', p: 2, borderRadius: 2 }}>
                <Typography variant="h3" color="error.main">{stats.setsLost}</Typography>
                <Typography variant="body2">Perdidos</Typography>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">Efectividad</Typography>
              <Typography variant="body2" fontWeight="bold">{setWinRate.toFixed(0)}%</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={setWinRate} 
              sx={{ 
                height: 8, 
                borderRadius: 5,
                bgcolor: 'background.paper',
                '& .MuiLinearProgress-bar': {
                  bgcolor: setWinRate > 70 ? 'success.main' : setWinRate > 40 ? 'warning.main' : 'error.main',
                }
              }} 
            />
          </Box>
        </CardContent>
      </Card>
      
      {/* Estadísticas de Torneos */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TrophyIcon sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h6" color="primary">Torneos</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: '1 1 45%', minWidth: '120px' }}>
              <Box sx={{ textAlign: 'center', bgcolor: 'background.paper', p: 2, borderRadius: 2 }}>
                <Typography variant="h3" color="text.primary">{stats.tournamentsPlayed}</Typography>
                <Typography variant="body2" color="text.secondary">Jugados</Typography>
              </Box>
            </Box>
            
            <Box sx={{ flex: '1 1 45%', minWidth: '120px' }}>
              <Box sx={{ textAlign: 'center', bgcolor: 'info.light', color: 'info.contrastText', p: 2, borderRadius: 2 }}>
                <Typography variant="h3" color="info.main">{stats.tournamentsWon}</Typography>
                <Typography variant="body2">Ganados</Typography>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">Efectividad</Typography>
              <Typography variant="body2" fontWeight="bold">{tournamentWinRate.toFixed(0)}%</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={tournamentWinRate} 
              sx={{ 
                height: 8, 
                borderRadius: 5,
                bgcolor: 'background.paper',
                '& .MuiLinearProgress-bar': {
                  bgcolor: tournamentWinRate > 70 ? 'success.main' : tournamentWinRate > 40 ? 'warning.main' : 'error.main',
                }
              }} 
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PlayerStats;
