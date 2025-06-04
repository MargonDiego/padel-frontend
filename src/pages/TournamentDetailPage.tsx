import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
  Paper,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';

import Layout from '../components/common/Layout';
import TournamentInfo from '../components/tournaments/TournamentInfo';
import RegisteredTeams from '../components/tournaments/RegisteredTeams';
import TournamentMatches from '../components/tournaments/TournamentMatches';
import { useAuth } from '../contexts/AuthContext';
import tournamentService from '../services/tournamentService';
import teamService from '../services/teamService';
import matchService from '../services/matchService';
import type { Tournament, Team, Match } from '../types/models';

// Esquema de validación para actualizar torneo
const validationSchema = yup.object({
  name: yup.string().required('El nombre del torneo es requerido'),
  startDate: yup.date().required('La fecha de inicio es requerida'),
  endDate: yup.date().required('La fecha de fin es requerida')
    .min(
      yup.ref('startDate'),
      'La fecha de fin debe ser posterior a la fecha de inicio'
    ),
  format: yup.string().required('El formato del torneo es requerido'),
  maxTeams: yup.number().positive('Debe ser un número positivo').integer('Debe ser un número entero'),
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tournament-tabpanel-${index}`}
      aria-labelledby={`tournament-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const TournamentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [registeredTeams, setRegisteredTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [teamsLoading, setTeamsLoading] = useState(false);
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [tabValue, setTabValue] = useState(0);

  // Cargar datos del torneo
  useEffect(() => {
    const fetchTournamentData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Obtener detalles del torneo (incluye el torneo y sus partidos iniciales)
        const tournamentResponse = await tournamentService.getTournament(parseInt(id));
        if (tournamentResponse.success) {
          setTournament(tournamentResponse.data.tournament);
          setMatches(tournamentResponse.data.matches || []);
          
          // Si el torneo tiene equipos, agregarlos al estado de equipos registrados
          if (tournamentResponse.data.tournament.teams && tournamentResponse.data.tournament.teams.length > 0) {
            setRegisteredTeams(tournamentResponse.data.tournament.teams);
          }
          
          // También obtener los partidos desde el endpoint específico
          const matchesResponse = await tournamentService.getTournamentMatches(parseInt(id));
          if (matchesResponse.success) {
            // Si hay respuesta exitosa del endpoint específico de partidos, actualizar con esos datos
            setMatches(matchesResponse.data.data || []);
          }
        } else {
          setMessage({ type: 'error', text: tournamentResponse.error || 'Error al cargar el torneo' });
        }
      } catch (error) {
        console.error('Error fetching tournament data:', error);
        setMessage({ type: 'error', text: 'Error al cargar los datos del torneo' });
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentData();
  }, [id]);

  // Cargar equipos inscritos (como respaldo si no vinieron con los datos del torneo)
  useEffect(() => {
    const fetchRegisteredTeams = async () => {
      if (!id || !tournament) return;
      
      // No cargar equipos nuevamente si ya los obtuvimos con los datos del torneo
      if (registeredTeams.length > 0) {
        return;
      }
      
      setTeamsLoading(true);
      try {
        // Obtener equipos inscritos desde el endpoint específico
        const teamsResponse = await tournamentService.getRegisteredTeams(parseInt(id));
        if (teamsResponse.success) {
          setRegisteredTeams(teamsResponse.data);
        } else {
          console.error('Error fetching registered teams:', teamsResponse.error);
        }
      } catch (error) {
        console.error('Error fetching registered teams:', error);
      } finally {
        setTeamsLoading(false);
      }
    };

    fetchRegisteredTeams();
  }, [id, tournament, registeredTeams.length]);

  // Cargar equipos del usuario (para inscripción)
  useEffect(() => {
    const fetchUserTeams = async () => {
      if (!isAuthenticated || !user) return;
      
      try {
        const userTeamsResponse = await teamService.getUserTeams(user.id);
        if (userTeamsResponse.success && Array.isArray(userTeamsResponse.data)) {
          setUserTeams(userTeamsResponse.data);
        } else {
          console.error('Error: respuesta de equipos del usuario no es un array', userTeamsResponse);
          setUserTeams([]);
        }
      } catch (error) {
        console.error('Error fetching user teams:', error);
        setUserTeams([]);
      }
    };

    fetchUserTeams();
  }, [isAuthenticated, user]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenEditDialog = () => {
    if (!tournament) return;
    
    formik.setValues({
      name: tournament.name,
      description: tournament.description || '',
      startDate: new Date(tournament.startDate),
      endDate: new Date(tournament.endDate),
      format: tournament.format,
      maxTeams: tournament.maxTeams?.toString() || '',
      location: tournament.location || ''
    });
    
    setEditDialogOpen(true);
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

  // Formulario para editar torneo
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      startDate: null as Date | null,
      endDate: null as Date | null,
      format: '',
      maxTeams: '',
      location: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (!id || !tournament) return;
      
      try {
        // Convertir valores para la API
        const tournamentData = {
          name: values.name,
          description: values.description,
          startDate: values.startDate?.toISOString().split('T')[0] || '',
          endDate: values.endDate?.toISOString().split('T')[0] || '',
          format: values.format as 'elimination' | 'round_robin',
          maxTeams: values.maxTeams ? Number(values.maxTeams) : undefined,
          location: values.location
        };

        const response = await tournamentService.updateTournament(parseInt(id), tournamentData);
        
        if (response.success) {
          setTournament(response.data);
          setMessage({ type: 'success', text: 'Torneo actualizado correctamente' });
          handleCloseEditDialog();
        } else {
          setMessage({ type: 'error', text: response.error || 'Error al actualizar el torneo' });
        }
      } catch (error) {
        console.error('Error updating tournament:', error);
        setMessage({ type: 'error', text: 'Error al actualizar el torneo' });
      }
    },
  });

  // Función para eliminar torneo
  const handleDeleteTournament = async () => {
    if (!id) return;
    
    try {
      const response = await tournamentService.deleteTournament(parseInt(id));
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Torneo eliminado correctamente' });
        handleCloseDeleteDialog();
        // Redireccionar a la lista de torneos después de un breve retraso
        setTimeout(() => {
          navigate('/tournaments');
        }, 1500);
      } else {
        setMessage({ type: 'error', text: response.error || 'Error al eliminar el torneo' });
        handleCloseDeleteDialog();
      }
    } catch (error) {
      console.error('Error deleting tournament:', error);
      setMessage({ type: 'error', text: 'Error al eliminar el torneo' });
      handleCloseDeleteDialog();
    }
  };

  // Función para abrir inscripciones
  const handleOpenRegistration = async () => {
    if (!id || !tournament) return;
    
    try {
      const response = await tournamentService.openRegistration(parseInt(id));
      
      if (response.success) {
        setTournament(response.data);
        setMessage({ type: 'success', text: 'Inscripciones abiertas correctamente' });
      } else {
        setMessage({ type: 'error', text: response.error || 'Error al abrir inscripciones' });
      }
    } catch (error) {
      console.error('Error opening registration:', error);
      setMessage({ type: 'error', text: 'Error al abrir inscripciones' });
    }
  };

  // Función para iniciar torneo (generar cuadros)
  const handleStartTournament = async () => {
    if (!id || !tournament) return;
    
    try {
      const response = await tournamentService.generateBrackets(parseInt(id));
      
      if (response.success) {
        setTournament(response.data.tournament);
        setMatches(response.data.matches);
        setMessage({ type: 'success', text: 'Torneo iniciado correctamente' });
      } else {
        setMessage({ type: 'error', text: response.error || 'Error al iniciar el torneo' });
      }
    } catch (error) {
      console.error('Error starting tournament:', error);
      setMessage({ type: 'error', text: 'Error al iniciar el torneo' });
    }
  };

  // Función para finalizar torneo
  const handleCompleteTournament = async () => {
    if (!id || !tournament) return;
    
    try {
      const response = await tournamentService.updateTournament(parseInt(id), { status: 'completed' });
      
      if (response.success) {
        setTournament(response.data);
        setMessage({ type: 'success', text: 'Torneo finalizado correctamente' });
      } else {
        setMessage({ type: 'error', text: response.error || 'Error al finalizar el torneo' });
      }
    } catch (error) {
      console.error('Error completing tournament:', error);
      setMessage({ type: 'error', text: 'Error al finalizar el torneo' });
    }
  };

  // Función para inscribir equipo
  const handleRegisterTeam = async (teamId: number) => {
    if (!id || !tournament) return;
    
    try {
      const response = await tournamentService.registerTeam(parseInt(id), teamId);
      
      if (response.success) {
        // Recargar equipos inscritos
        const teamsResponse = await tournamentService.getRegisteredTeams(parseInt(id));
        if (teamsResponse.success) {
          setRegisteredTeams(teamsResponse.data);
        }
        setMessage({ type: 'success', text: 'Equipo inscrito correctamente' });
      } else {
        setMessage({ type: 'error', text: response.error || 'Error al inscribir el equipo' });
      }
    } catch (error) {
      console.error('Error registering team:', error);
      setMessage({ type: 'error', text: 'Error al inscribir el equipo' });
    }
  };

  // Función para eliminar inscripción de equipo
  const handleUnregisterTeam = async (teamId: number) => {
    if (!id || !tournament) return;
    
    try {
      const response = await tournamentService.unregisterTeam(parseInt(id), teamId);
      
      if (response.success) {
        // Filtrar el equipo eliminado de la lista
        setRegisteredTeams(prevTeams => prevTeams.filter(team => team.id !== teamId));
        setMessage({ type: 'success', text: 'Inscripción eliminada correctamente' });
      } else {
        setMessage({ type: 'error', text: response.error || 'Error al eliminar la inscripción' });
      }
    } catch (error) {
      console.error('Error unregistering team:', error);
      setMessage({ type: 'error', text: 'Error al eliminar la inscripción' });
    }
  };

  // Función para asignar semilla a equipo
  const handleAssignSeed = async (teamId: number, seed: number) => {
    if (!id || !tournament) return;
    
    try {
      const response = await tournamentService.assignSeed(parseInt(id), { teamId, seed });
      
      if (response.success) {
        // Actualizar la semilla en el equipo correspondiente
        setRegisteredTeams(prevTeams => 
          prevTeams.map(team => 
            team.id === teamId ? { ...team, seed } : team
          )
        );
        setMessage({ type: 'success', text: 'Semilla asignada correctamente' });
      } else {
        setMessage({ type: 'error', text: response.error || 'Error al asignar la semilla' });
      }
    } catch (error) {
      console.error('Error assigning seed:', error);
      setMessage({ type: 'error', text: 'Error al asignar la semilla' });
    }
  };

  // Función para registrar resultado de partido
  const handleRegisterResult = async (matchId: number, scoreTeam1: number, scoreTeam2: number, setResults: {team1: number, team2: number}[], winnerId: number | null, status: string) => {
    try {
      console.log(`Actualizando partido ${matchId} con estado: ${status}`);
      
      // Preparar datos para actualizar
      const updateData = {
        status: status as 'scheduled' | 'in_progress' | 'completed' | 'cancelled',
        team1Score: scoreTeam1,
        team2Score: scoreTeam2,
        setResults: setResults,
        winnerId: winnerId
      };
      
      console.log('Enviando datos a la API:', updateData);
      
      let response;
      
      // Si el partido está completado y tiene un ganador, usar registerResult
      if (status === 'completed' && winnerId) {
        response = await matchService.registerResult(matchId, {
          ...updateData,
          status: 'completed',
          winnerId: winnerId
        });
      } else {
        // Para actualizaciones parciales o estados diferentes, usar updateMatch
        response = await matchService.updateMatch(matchId, updateData);
      }
      
      if (response.success) {
        // Actualizar el partido en la lista
        setMatches(prevMatches => 
          prevMatches.map(match => 
            match.id === matchId ? { ...match, ...response.data } : match
          )
        );
        setMessage({ type: 'success', text: 'Resultado registrado correctamente' });
      } else {
        setMessage({ type: 'error', text: response.error || 'Error al registrar el resultado' });
      }
    } catch (error) {
      console.error('Error registering result:', error);
      setMessage({ type: 'error', text: 'Error al registrar el resultado' });
    }
  };

  if (loading) {
    return (
      <Layout>
        <Container>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }

  if (!tournament) {
    return (
      <Layout>
        <Container>
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Torneo no encontrado
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate('/tournaments')}
              sx={{ mt: 2 }}
            >
              Volver a torneos
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
          <Button 
            variant="outlined" 
            onClick={() => navigate('/tournaments')}
            sx={{ mb: 2 }}
          >
            Volver a torneos
          </Button>

          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
            >
              <Tab label="Información" />
              <Tab label="Equipos" />
              <Tab label="Partidos" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              <TabPanel value={tabValue} index={0}>
                <TournamentInfo 
                  tournament={tournament}
                  onEdit={handleOpenEditDialog}
                  onOpenRegistration={handleOpenRegistration}
                  onStartTournament={handleStartTournament}
                  onCompleteTournament={handleCompleteTournament}
                />
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <RegisteredTeams 
                  tournament={tournament}
                  teams={registeredTeams}
                  loading={teamsLoading}
                  onRegisterTeam={handleRegisterTeam}
                  onUnregisterTeam={handleUnregisterTeam}
                  onAssignSeed={handleAssignSeed}
                  userTeams={userTeams}
                />
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <TournamentMatches 
                  tournament={tournament}
                  matches={matches}
                  loading={loading}
                  onRegisterResult={handleRegisterResult}
                />
              </TabPanel>
            </Box>
          </Paper>
        </Box>

        {/* Diálogo para editar torneo */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="md" fullWidth>
            <form onSubmit={formik.handleSubmit}>
              <DialogTitle>Editar Torneo</DialogTitle>
              <DialogContent>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 0.5 }}>
                  <Box>
                    <TextField
                      fullWidth
                      id="name"
                      name="name"
                      label="Nombre del torneo"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                    />
                  </Box>
                  <Box>
                    <FormControl fullWidth error={formik.touched.format && Boolean(formik.errors.format)}>
                      <InputLabel id="format-label">Formato</InputLabel>
                      <Select
                        labelId="format-label"
                        id="format"
                        name="format"
                        value={formik.values.format}
                        onChange={formik.handleChange}
                        label="Formato"
                      >
                        <MenuItem value="elimination">Eliminación directa</MenuItem>
                        <MenuItem value="round_robin">Round Robin</MenuItem>
                      </Select>
                      {formik.touched.format && formik.errors.format && (
                        <FormHelperText>{formik.errors.format}</FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                  <Box>
                    <DatePicker
                      label="Fecha de inicio"
                      value={formik.values.startDate}
                      onChange={(newValue) => {
                        formik.setFieldValue('startDate', newValue);
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: formik.touched.startDate && Boolean(formik.errors.startDate),
                          helperText: formik.touched.startDate && formik.errors.startDate as string
                        }
                      }}
                    />
                  </Box>
                  <Box>
                    <DatePicker
                      label="Fecha de fin"
                      value={formik.values.endDate}
                      onChange={(newValue) => {
                        formik.setFieldValue('endDate', newValue);
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: formik.touched.endDate && Boolean(formik.errors.endDate),
                          helperText: formik.touched.endDate && formik.errors.endDate as string
                        }
                      }}
                    />
                  </Box>
                  <Box>
                    <TextField
                      fullWidth
                      id="maxTeams"
                      name="maxTeams"
                      label="Número máximo de equipos"
                      type="number"
                      value={formik.values.maxTeams}
                      onChange={formik.handleChange}
                      error={formik.touched.maxTeams && Boolean(formik.errors.maxTeams)}
                      helperText={formik.touched.maxTeams && formik.errors.maxTeams}
                    />
                  </Box>
                  <Box>
                    <TextField
                      fullWidth
                      id="location"
                      name="location"
                      label="Ubicación"
                      value={formik.values.location}
                      onChange={formik.handleChange}
                    />
                  </Box>
                  <Box sx={{ gridColumn: { xs: '1', md: '1 / span 2' } }}>
                    <TextField
                      fullWidth
                      id="description"
                      name="description"
                      label="Descripción (opcional)"
                      multiline
                      rows={3}
                      value={formik.values.description}
                      onChange={formik.handleChange}
                    />
                  </Box>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={handleOpenDeleteDialog}
                  sx={{ mr: 'auto' }}
                >
                  Eliminar Torneo
                </Button>
                <Button onClick={handleCloseEditDialog}>Cancelar</Button>
                <Button type="submit" variant="contained" color="primary">
                  Guardar Cambios
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        </LocalizationProvider>

        {/* Diálogo para confirmar eliminación */}
        <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Confirmar eliminación</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              ¿Estás seguro de que deseas eliminar el torneo "{tournament.name}"?
            </Typography>
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              Esta acción no se puede deshacer.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
            <Button 
              onClick={handleDeleteTournament} 
              variant="contained" 
              color="error"
            >
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

export default TournamentDetailPage;
