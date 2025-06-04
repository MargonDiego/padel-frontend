import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Paper,
  Chip,
  Avatar,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress
} from '@mui/material';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import FlagIcon from '@mui/icons-material/Flag';
import EventIcon from '@mui/icons-material/Event';
import PlaceIcon from '@mui/icons-material/Place';
import { Link } from 'react-router-dom';
import type { Match } from '../../types/models';

interface MatchDetailDialogProps {
  open: boolean;
  onClose: () => void;
  match: Match | null;
  loading: boolean;
}

const MatchDetailDialog: React.FC<MatchDetailDialogProps> = ({ 
  open, 
  onClose, 
  match, 
  loading 
}) => {
  // Función para formatear la fecha
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No definido';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtener el estado del partido como texto
  const getMatchStatusChip = (match: Match) => {
    if (match.status === 'completed' || match.winnerId) {
      return (
        <Chip 
          label="Completado" 
          color="success" 
          size="small" 
          icon={<SportsTennisIcon />} 
        />
      );
    } else if (match.status === 'pending') {
      return <Chip label="Pendiente" color="default" size="small" icon={<EventIcon />} />;
    } else if (match.status === 'in_progress') {
      return <Chip label="En progreso" color="primary" size="small" />;
    } else {
      return <Chip label={match?.status || 'Desconocido'} size="small" />;
    }
  };

  // Duración del partido
  const getMatchDuration = () => {
    if (!match?.startedAt || !match?.endedAt) return 'No disponible';
    
    const start = new Date(match.startedAt);
    const end = new Date(match.endedAt);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    
    return `${hours > 0 ? `${hours}h ` : ''}${mins}min`;
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Detalles del partido
      </DialogTitle>
      {match && (
        <Box sx={{ px: 3, pt: 0, pb: 2, mt: -2 }}>
          <Typography variant="body2" color="text.secondary">
            {match.team1?.player1?.name || ''} / {match.team1?.player2?.name || ''} vs {match.team2?.player1?.name || ''} / {match.team2?.player2?.name || ''}
          </Typography>
        </Box>
      )}
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : match ? (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>Información general</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Estado:</Typography>
                  <Box>{getMatchStatusChip(match)}</Box>
                </Grid>
                {match.tournament && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Torneo:</Typography>
                    <Link to={`/tournaments/${match.tournament.id}`} style={{ textDecoration: 'none' }}>
                      <Typography color="primary">{match.tournament.name}</Typography>
                    </Link>
                  </Grid>
                )}
                {match.round && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Ronda:</Typography>
                    <Typography>
                      {match.round === 1 ? 'Final' : 
                       match.round === 2 ? 'Semifinal' : 
                       match.round === 4 ? 'Cuartos de final' : 
                       `Ronda ${match.round}`}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Programado para:</Typography>
                  <Typography>
                    {formatDate(match.scheduledAt)}
                  </Typography>
                </Grid>
                {match.startedAt && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Comenzó a las:</Typography>
                    <Typography>
                      {formatDate(match.startedAt)}
                    </Typography>
                  </Grid>
                )}
                {match.endedAt && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Finalizó a las:</Typography>
                    <Typography>
                      {formatDate(match.endedAt)}
                    </Typography>
                  </Grid>
                )}
                {match.startedAt && match.endedAt && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Duración:</Typography>
                    <Typography>
                      {getMatchDuration()}
                    </Typography>
                  </Grid>
                )}
                {match.status === 'completed' && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Resultado final:</Typography>
                    <Typography variant="h6" color={match.winnerId === match.team1Id ? 'primary' : 'secondary'}>
                      {match.team1Score} - {match.team2Score}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>Equipos</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {match.team1?.name}
                        {match.winnerId === match.team1Id && (
                          <Chip 
                            icon={<FlagIcon />} 
                            label="Ganador" 
                            color="success" 
                            size="small" 
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Typography>
                    </Box>
                    
                    {match.team1?.player1 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                          {match.team1.player1.name.charAt(0)}
                        </Avatar>
                        <Typography variant="body2">
                          {match.team1.player1.name}
                          {match.team1.player1.playingPosition && (
                            ` (${match.team1.player1.playingPosition})`
                          )}
                        </Typography>
                      </Box>
                    )}
                    
                    {match.team1?.player2 && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                          {match.team1.player2.name.charAt(0)}
                        </Avatar>
                        <Typography variant="body2">
                          {match.team1.player2.name}
                          {match.team1.player2.playingPosition && (
                            ` (${match.team1.player2.playingPosition})`
                          )}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {match.team2?.name}
                        {match.winnerId === match.team2Id && (
                          <Chip 
                            icon={<FlagIcon />} 
                            label="Ganador" 
                            color="success" 
                            size="small" 
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Typography>
                    </Box>
                    
                    {match.team2?.player1 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                          {match.team2.player1.name.charAt(0)}
                        </Avatar>
                        <Typography variant="body2">
                          {match.team2.player1.name}
                          {match.team2.player1.playingPosition && (
                            ` (${match.team2.player1.playingPosition})`
                          )}
                        </Typography>
                      </Box>
                    )}
                    
                    {match.team2?.player2 && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                          {match.team2.player2.name.charAt(0)}
                        </Avatar>
                        <Typography variant="body2">
                          {match.team2.player2.name}
                          {match.team2.player2.playingPosition && (
                            ` (${match.team2.player2.playingPosition})`
                          )}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            {match.status === 'completed' && match.setResults && (
              <>
                <Divider sx={{ my: 2 }} />
                
                <Box>
                  <Typography variant="h6" gutterBottom>Resultados por set</Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Set</TableCell>
                          <TableCell>{match.team1?.name}</TableCell>
                          <TableCell>{match.team2?.name}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(() => {
                          try {
                            const sets = Array.isArray(match.setResults) 
                              ? match.setResults 
                              : JSON.parse(match.setResults as string);
                              
                            return sets.map((set: {team1: number, team2: number}, idx: number) => (
                              <TableRow key={idx}>
                                <TableCell>{idx + 1}</TableCell>
                                <TableCell 
                                  sx={{ fontWeight: set.team1 > set.team2 ? 'bold' : 'normal' }}
                                >
                                  {set.team1}
                                </TableCell>
                                <TableCell 
                                  sx={{ fontWeight: set.team2 > set.team1 ? 'bold' : 'normal' }}
                                >
                                  {set.team2}
                                </TableCell>
                              </TableRow>
                            ));
                          } catch (e) {
                            console.error('Error parsing setResults:', e);
                            return (
                              <TableRow>
                                <TableCell colSpan={3}>Error al procesar los resultados</TableCell>
                              </TableRow>
                            );
                          }
                        })()}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </>
            )}
          </>
        ) : (
          <Typography>No se pudo cargar la información detallada del partido.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MatchDetailDialog;
