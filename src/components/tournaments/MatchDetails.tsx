import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Chip,
  Divider,
  Avatar,
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from '@mui/material';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PlaceIcon from '@mui/icons-material/Place';
import GroupIcon from '@mui/icons-material/Group';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { Match } from '../../types/models';

interface MatchDetailsProps {
  open: boolean;
  match: Match | null;
  loading: boolean;
  onClose: () => void;
  finalRound: number;
}

const MatchDetails: React.FC<MatchDetailsProps> = ({
  open,
  match,
  loading,
  onClose,
  finalRound
}) => {
  // Función para formatear fecha
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleString();
  };

  // Función para obtener nombre de la ronda
  const getRoundName = (round?: number) => {
    if (!round) return 'Desconocida';
    
    if (round === finalRound) return 'Final';
    if (round === finalRound - 1) return 'Semifinal';
    if (round === finalRound - 2) return 'Cuartos de final';
    return `Ronda ${round}`;
  };

  // Función para formatear el estado del partido
  const getStatusLabel = (status?: string) => {
    if (!status) return 'Desconocido';
    
    switch(status) {
      case 'completed': return 'Completado';
      case 'scheduled': return 'Programado';
      case 'in_progress': return 'En progreso';
      default: return status;
    }
  };

  // Función para obtener el color del chip según el estado
  const getStatusColor = (status?: string) => {
    if (!status) return 'default';
    
    switch(status) {
      case 'completed': return 'success';
      case 'scheduled': return 'default';
      case 'in_progress': return 'primary';
      default: return 'default';
    }
  };

  // Función para mostrar resultados de sets
  const renderSetResults = () => {
    if (!match || !match.setResults) return null;
    
    try {
      // Manejar tanto arrays como strings
      const sets = typeof match.setResults === 'string' 
        ? JSON.parse(match.setResults) 
        : match.setResults;
      
      if (!Array.isArray(sets) || sets.length === 0) return 'No disponible';
      
      return (
        <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Set</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{match.team1?.name || 'Equipo 1'}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{match.team2?.name || 'Equipo 2'}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Ganador</TableCell>
              </TableRow>
              {sets.map((set: {team1: number, team2: number}, index: number) => {
                const team1Wins = set.team1 > set.team2;
                return (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell sx={{ fontWeight: team1Wins ? 'bold' : 'normal', color: team1Wins ? 'success.main' : 'inherit' }}>
                      {set.team1}
                    </TableCell>
                    <TableCell sx={{ fontWeight: !team1Wins ? 'bold' : 'normal', color: !team1Wins ? 'success.main' : 'inherit' }}>
                      {set.team2}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        size="small" 
                        label={team1Wins ? match.team1?.name || 'Equipo 1' : match.team2?.name || 'Equipo 2'} 
                        color={team1Wins ? 'primary' : 'secondary'}
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      );
    } catch (e) {
      console.error("Error parsing setResults:", e);
      return 'Error al mostrar los sets';
    }
  };

  // Función para renderizar la información de los jugadores de un equipo
  const renderPlayerInfo = (player: any, position: string) => {
    if (!player) return null;

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: position === 'player1' ? 'primary.main' : 'secondary.main' }}>
          {player.name?.charAt(0).toUpperCase() || '?'}
        </Avatar>
        <Box>
          <Typography variant="body2" fontWeight="medium">
            {player.name || 'Jugador sin nombre'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {player.username ? `@${player.username}` : ''}
            {player.playingPosition ? ` • ${player.playingPosition.charAt(0).toUpperCase() + player.playingPosition.slice(1)}` : ''}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SportsTennisIcon sx={{ mr: 1 }} />
          <Typography>Detalles del Partido</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : match ? (
          <Box sx={{ pt: 2 }}>
            {/* Resumen del partido */}
            <Card sx={{ mb: 3 }}>
              <CardHeader 
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6">
                      {getRoundName(match.round)} - Partido {match.matchNumber || ''}
                    </Typography>
                    <Chip 
                      label={getStatusLabel(match.status)} 
                      color={getStatusColor(match.status)} 
                      size="small" 
                    />
                  </Box>
                }
                subheader={
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, flexWrap: 'wrap', gap: 2 }}>
                    {match.tournament && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EmojiEventsIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {match.tournament.name}
                        </Typography>
                      </Box>
                    )}
                    {match.scheduledAt && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(match.scheduledAt)}
                        </Typography>
                      </Box>
                    )}
                    {match.tournament?.location && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PlaceIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {match.tournament.location}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                }
              />

              <CardContent>
                {/* Equipos y resultado */}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mt: 1,
                  mb: 3,
                  flexWrap: { xs: 'wrap', md: 'nowrap' }
                }}>
                  <Box sx={{ 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: { xs: 'center', md: 'flex-end' }, 
                    mr: { xs: 0, md: 2 },
                    mb: { xs: 2, md: 0 },
                    order: { xs: 1, md: 1 }
                  }}>
                    <Typography variant="h6" sx={{
                      fontWeight: match.winnerId === match.team1Id ? 'bold' : 'medium',
                      color: match.winnerId === match.team1Id ? 'success.main' : 'inherit'
                    }}>
                      {match.team1?.name || 'Equipo 1'}
                      {match.winnerId === match.team1Id && ' 🏆'}
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-end' } }}>
                      {match.team1?.player1 && renderPlayerInfo(match.team1.player1, 'player1')}
                      {match.team1?.player2 && renderPlayerInfo(match.team1.player2, 'player2')}
                    </Box>
                  </Box>

                  {/* Marcador central */}
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    order: { xs: 3, md: 2 },
                    width: { xs: '100%', md: 'auto' }
                  }}>
                    {match.status === 'completed' ? (
                      <Paper elevation={3} sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'background.paper'
                      }}>
                        <Typography variant="h4" fontWeight="bold" color="primary.main">
                          {match.team1Score !== null ? match.team1Score : '-'}
                        </Typography>
                        <Typography variant="h5" sx={{ mx: 1.5 }}>:</Typography>
                        <Typography variant="h4" fontWeight="bold" color="secondary.main">
                          {match.team2Score !== null ? match.team2Score : '-'}
                        </Typography>
                      </Paper>
                    ) : (
                      <Chip 
                        label="Partido pendiente" 
                        variant="outlined" 
                        color="default" 
                        size="medium"
                      />
                    )}
                  </Box>

                  <Box sx={{ 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: { xs: 'center', md: 'flex-start' }, 
                    ml: { xs: 0, md: 2 },
                    mb: { xs: 2, md: 0 },
                    order: { xs: 2, md: 3 }
                  }}>
                    <Typography variant="h6" sx={{
                      fontWeight: match.winnerId === match.team2Id ? 'bold' : 'medium',
                      color: match.winnerId === match.team2Id ? 'success.main' : 'inherit'
                    }}>
                      {match.team2?.name || 'Equipo 2'}
                      {match.winnerId === match.team2Id && ' 🏆'}
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
                      {match.team2?.player1 && renderPlayerInfo(match.team2.player1, 'player1')}
                      {match.team2?.player2 && renderPlayerInfo(match.team2.player2, 'player2')}
                    </Box>
                  </Box>
                </Box>

                {/* Información detallada */}
                <Grid container spacing={3}>
                  {/* Resultados detallados (sets) */}
                  {match.status === 'completed' && (
                    <Grid size={12}>
                      <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <SportsTennisIcon sx={{ mr: 1, fontSize: 20 }} />
                        Detalle del Resultado
                      </Typography>
                      {renderSetResults()}
                    </Grid>
                  )}

                  {/* Información del ganador */}
                  {match.winner && (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <EmojiEventsIcon sx={{ mr: 1, fontSize: 20 }} />
                        Equipo Ganador
                      </Typography>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                            {match.winner.name?.charAt(0).toUpperCase() || 'G'}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight="bold">
                              {match.winner.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {match.winner.description || ''}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  )}

                  {/* Próximo partido */}
                  {match.nextMatchId && match.tournament?.matches && (
                    <Grid size={{ xs: 12, md: match.winner ? 6 : 12 }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <ArrowForwardIcon sx={{ mr: 1, fontSize: 20 }} />
                        Próximo Partido
                      </Typography>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Box>
                          {(() => {
                            const nextMatch = match.tournament?.matches?.find(m => m.id === match.nextMatchId);
                            if (!nextMatch) return <Typography variant="body2">Información no disponible</Typography>;
                            
                            return (
                              <>
                                <Typography variant="body2" gutterBottom>
                                  <strong>Ronda:</strong> {getRoundName(nextMatch.round)}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                  <strong>Fecha programada:</strong> {formatDate(nextMatch.scheduledAt)}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                  <strong>Estado:</strong> {getStatusLabel(nextMatch.status)}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                  <Typography variant="body2" color="primary.main" fontWeight="medium" sx={{ mr: 1 }}>
                                    {nextMatch.team1?.name || match.winner?.name || 'Ganador de este partido'}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ mx: 1 }}>vs</Typography>
                                  <Typography variant="body2" color="secondary.main" fontWeight="medium" sx={{ ml: 1 }}>
                                    {nextMatch.team2?.name || 'Por determinar'}
                                  </Typography>
                                </Box>
                              </>
                            );
                          })()}
                        </Box>
                      </Paper>
                    </Grid>
                  )}

                  {/* Fechas detalladas */}
                  <Grid size={12}>
                    <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarTodayIcon sx={{ mr: 1, fontSize: 20 }} />
                      Información Temporal
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            Programado para:
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {formatDate(match.scheduledAt)}
                          </Typography>
                        </Grid>
                        {match.scheduledAt && (
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                              Comenzó:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {formatDate(match.scheduledAt)}
                            </Typography>
                          </Grid>
                        )}
                        {match.completedAt && (
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                              Finalizó:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {formatDate(match.completedAt)}
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        ) : (
          <Typography variant="body1" align="center" color="text.secondary">
            No se encontraron detalles del partido
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MatchDetails;
