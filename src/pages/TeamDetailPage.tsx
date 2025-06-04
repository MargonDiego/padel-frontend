import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Divider,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TrophyIcon from '@mui/icons-material/EmojiEvents';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Layout from '../components/common/Layout';
import { useAuth } from '../contexts/AuthContext';
import teamService from '../services/teamService';
import statsService from '../services/statsService';
import type { Team, Match, TeamStat } from '../types/models';

const validationSchema = yup.object({
  name: yup.string().required('El nombre del equipo es requerido'),
});

const TeamDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStat | null>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Obtener detalles del equipo
        const teamResponse = await teamService.getTeam(parseInt(id));
        if (teamResponse.success) {
          setTeam(teamResponse.data.team);
          setRecentMatches(teamResponse.data.recentMatches || []);
        }

        // Obtener estadísticas del equipo
        const statsResponse = await statsService.getTeamStats(parseInt(id));
        if (statsResponse.success) {
          setTeamStats(statsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching team data:', error);
        setMessage({ type: 'error', text: 'Error al cargar los datos del equipo' });
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [id]);

  const handleOpenEditDialog = () => {
    setEditDialogOpen(true);
    formik.setValues({
      name: team?.name || '',
      description: team?.description || '',
    });
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleCloseMessage = () => {
    setMessage(null);
  };

  const handleDeleteTeam = async () => {
    if (!id) return;
    
    try {
      const response = await teamService.deleteTeam(parseInt(id));
      if (response.success) {
        setMessage({ type: 'success', text: 'Equipo eliminado correctamente' });
        setTimeout(() => {
          navigate('/teams');
        }, 1500);
      } else {
        setMessage({ type: 'error', text: 'Error al eliminar el equipo' });
      }
    } catch (error) {
      console.error('Error deleting team:', error);
      setMessage({ type: 'error', text: 'Error al eliminar el equipo' });
    } finally {
      handleCloseDeleteDialog();
    }
  };

  const formik = useFormik({
    initialValues: {
      name: team?.name || '',
      description: team?.description || '',
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!id) return;
      
      try {
        const response = await teamService.updateTeam(parseInt(id), values);
        if (response.success) {
          setTeam(response.data);
          setMessage({ type: 'success', text: 'Equipo actualizado correctamente' });
          handleCloseEditDialog();
        } else {
          setMessage({ type: 'error', text: 'Error al actualizar el equipo' });
        }
      } catch (error) {
        console.error('Error updating team:', error);
        setMessage({ type: 'error', text: 'Error al actualizar el equipo' });
      }
    },
  });

  // Verificar si el usuario actual es miembro del equipo
  const isTeamMember = user && team && (team.player1Id === user.id || team.player2Id === user.id);
  
  // Verificar si el usuario es administrador
  const isAdmin = user && user.userRoleId === 1;
  
  // Determinar si el usuario puede editar o eliminar el equipo
  const canManageTeam = isTeamMember || isAdmin;

  if (loading) {
    return (
      <Layout>
        <Container>
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }

  if (!team) {
    return (
      <Layout>
        <Container>
          <Typography variant="h5" align="center" sx={{ my: 4 }}>
            Equipo no encontrado
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" onClick={() => navigate('/teams')}>
              Volver a Equipos
            </Button>
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1">
              {team.name}
            </Typography>
            {canManageTeam && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleOpenEditDialog}
                >
                  Editar
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleOpenDeleteDialog}
                >
                  Eliminar
                </Button>
              </Box>
            )}
          </Box>
          {team.description && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {team.description}
            </Typography>
          )}
        </Box>

        <Grid container spacing={4}>
          {/* Columna izquierda: Información del equipo y jugadores */}
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Jugadores
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Jugador 1:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 1 }}>
                      {team.player1?.name.substring(0, 1).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="body1">
                        {team.player1?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Nivel: {team.player1?.playerLevel === 'beginner' ? 'Principiante' : 
                               team.player1?.playerLevel === 'intermediate' ? 'Intermedio' : 
                               team.player1?.playerLevel === 'advanced' ? 'Avanzado' : 'Profesional'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Jugador 2:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 1 }}>
                      {team.player2?.name.substring(0, 1).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="body1">
                        {team.player2?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Nivel: {team.player2?.playerLevel === 'beginner' ? 'Principiante' : 
                               team.player2?.playerLevel === 'intermediate' ? 'Intermedio' : 
                               team.player2?.playerLevel === 'advanced' ? 'Avanzado' : 'Profesional'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Estadísticas del equipo */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Estadísticas
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {teamStats ? (
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Partidos jugados:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" fontWeight="bold">
                        {teamStats.matchesPlayed}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Victorias:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" fontWeight="bold">
                        {teamStats.matchesWon}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Derrotas:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" fontWeight="bold">
                        {teamStats.matchesLost}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        % de victorias:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" fontWeight="bold">
                        {(teamStats.winRatio * 100).toFixed(1)}%
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Sets ganados:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" fontWeight="bold">
                        {teamStats.setsWon}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Torneos jugados:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" fontWeight="bold">
                        {teamStats.tournamentsPlayed}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Torneos ganados:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" fontWeight="bold">
                        {teamStats.tournamentsWon}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Puntos ranking:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" fontWeight="bold">
                        {teamStats.rankingPoints}
                      </Typography>
                    </Grid>
                    {teamStats.bestTournamentResult && (
                      <>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Mejor resultado:
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" fontWeight="bold">
                            {teamStats.bestTournamentResult === 'winner' ? 
                              'Campeón' : 
                              teamStats.bestTournamentResult === 'finalist' ? 
                              'Finalista' : 
                              teamStats.bestTournamentResult === 'semifinalist' ? 
                              'Semifinalista' : 'Participante'}
                          </Typography>
                        </Grid>
                      </>
                    )}
                  </Grid>
                ) : (
                  <Typography variant="body2" align="center" color="text.secondary">
                    No hay estadísticas disponibles
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Columna derecha: Torneos y partidos recientes */}
          <Grid item xs={12} md={8}>
            {/* Torneos en los que participa */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Torneos
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {team.tournaments && team.tournaments.length > 0 ? (
                  <Grid container spacing={2}>
                    {team.tournaments.map((tournament) => (
                      <Grid item xs={12} sm={6} key={tournament.id}>
                        <Paper
                          sx={{
                            p: 2,
                            borderLeft: tournament.status === 'completed' && tournament.winnerId === team.id ? 
                              '4px solid #FFD700' : '1px solid rgba(0, 0, 0, 0.12)',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                          }}
                        >
                          {tournament.status === 'completed' && tournament.winnerId === team.id && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <TrophyIcon sx={{ color: '#FFD700', mr: 0.5 }} />
                              <Typography variant="body2" fontWeight="bold" color="secondary">
                                ¡Campeones!
                              </Typography>
                            </Box>
                          )}
                          <Typography variant="subtitle1" gutterBottom>
                            {tournament.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Fecha: {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
                          </Typography>
                          <Box sx={{ mt: 'auto', pt: 1 }}>
                            <Chip
                              label={tournament.status === 'draft' ? 'Borrador' : 
                                    tournament.status === 'open' ? 'Inscripciones abiertas' : 
                                    tournament.status === 'in_progress' ? 'En progreso' : 'Completado'}
                              size="small"
                              color={tournament.status === 'completed' ? 'success' : 
                                    tournament.status === 'in_progress' ? 'primary' : 
                                    tournament.status === 'open' ? 'info' : 'default'}
                            />
                          </Box>
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => navigate(`/tournaments/${tournament.id}`)}
                            sx={{ mt: 1, alignSelf: 'flex-start' }}
                          >
                            Ver detalles
                          </Button>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body1" align="center" color="text.secondary">
                    Este equipo no está inscrito en ningún torneo actualmente.
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Partidos recientes */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Partidos Recientes
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {recentMatches && recentMatches.length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Fecha</TableCell>
                          <TableCell>Equipos</TableCell>
                          <TableCell>Resultado</TableCell>
                          <TableCell>Estado</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentMatches.map((match) => (
                          <TableRow key={match.id}>
                            <TableCell>
                              {match.scheduledAt ? new Date(match.scheduledAt).toLocaleDateString() : 'No programado'}
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography variant="body2" sx={{ 
                                  fontWeight: match.team1Id === team.id ? 'bold' : 'normal'
                                }}>
                                  {match.team1?.name}
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                  fontWeight: match.team2Id === team.id ? 'bold' : 'normal'
                                }}>
                                  {match.team2?.name}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              {match.status === 'completed' ? (
                                <Typography variant="body2">
                                  {match.team1Score} - {match.team2Score}
                                </Typography>
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  -
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={match.status === 'scheduled' ? 'Programado' : 
                                      match.status === 'in_progress' ? 'En progreso' : 'Completado'}
                                size="small"
                                color={match.status === 'completed' ? 'success' : 
                                      match.status === 'in_progress' ? 'primary' : 'default'}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body1" align="center" color="text.secondary">
                    No hay partidos recientes para este equipo.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Diálogo para editar equipo */}
        <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
          <form onSubmit={formik.handleSubmit}>
            <DialogTitle>Editar Equipo</DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 1 }}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="name"
                  name="name"
                  label="Nombre del equipo"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  id="description"
                  name="description"
                  label="Descripción (opcional)"
                  multiline
                  rows={3}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEditDialog}>Cancelar</Button>
              <Button type="submit" variant="contained" color="primary">
                Guardar Cambios
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Diálogo para confirmar eliminación */}
        <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Eliminar Equipo</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              ¿Estás seguro de que quieres eliminar el equipo "{team.name}"? Esta acción no se puede deshacer.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
            <Button onClick={handleDeleteTeam} variant="contained" color="error">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Mensaje de notificación */}
        <Snackbar open={!!message} autoHideDuration={6000} onClose={handleCloseMessage}>
          <Alert onClose={handleCloseMessage} severity={message?.type} sx={{ width: '100%' }}>
            {message?.text}
          </Alert>
        </Snackbar>
      </Container>
    </Layout>
  );
};

export default TeamDetailPage;
