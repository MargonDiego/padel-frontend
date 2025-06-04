import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  CircularProgress,
  Pagination,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Snackbar,
  Alert,
  Chip,
  Avatar,
  Autocomplete
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Layout from '../components/common/Layout';
import type { Team, User } from '../types/models';
import teamService from '../services/teamService';
import userService from '../services/userService';
import { useAuth } from '../contexts/AuthContext';

const validationSchema = yup.object({
  name: yup.string().required('El nombre del equipo es requerido'),
  player2Id: yup.number().required('Debes seleccionar un compañero de equipo')
});

const TeamsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [availablePlayers, setAvailablePlayers] = useState<User[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Cargar equipos
  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const response = await teamService.getTeams(page, 12);
        if (response.success) {
          setTeams(response.data.data);
          setTotalPages(response.data.meta.last_page);
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
        setMessage({ type: 'error', text: 'Error al cargar los equipos' });
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [page]);

  // Cargar jugadores disponibles para formar equipos
  const fetchAvailablePlayers = async (query = '') => {
    setLoadingPlayers(true);
    try {
      // Usar el servicio de usuarios actualizado
      const response = await userService.getPublicUsers(1, 20, query);
      
      if (response.success && response.data && Array.isArray(response.data.data)) {
        // Filtrar para no incluir al usuario actual
        const filteredPlayers = response.data.data.filter(player => 
          user && player.id !== user.id
        );
        setAvailablePlayers(filteredPlayers);
      } else {
        console.error('Error fetching users:', response.error);
        setMessage({ type: 'error', text: 'Error al cargar usuarios disponibles' });
        setAvailablePlayers([]);
      }
    } catch (error) {
      console.error('Error fetching available players:', error);
      setMessage({ type: 'error', text: 'Error al cargar usuarios disponibles' });
      setAvailablePlayers([]);
    } finally {
      setLoadingPlayers(false);
    }
  };
  
  // Función para convertir nivel de jugador a texto legible
  const getPlayerLevelText = (level: string | undefined): string => {
    switch(level) {
      case 'beginner': return 'Principiante';
      case 'intermediate': return 'Intermedio';
      case 'advanced': return 'Avanzado';
      case 'pro': return 'Profesional';
      default: return 'Nivel no especificado';
    }
  };
  
  // Buscar usuarios al cambiar el texto
  const handleUserSearch = (_: React.SyntheticEvent, value: string) => {
    if (value && value.length >= 2) {
      fetchAvailablePlayers(value);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
    fetchAvailablePlayers(); // Cargar usuarios iniciales
    formik.setFieldValue('player2Id', ''); // Resetear el campo de compañero
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    formik.resetForm();
  };

  const handleCloseMessage = () => {
    setMessage(null);
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      player2Id: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await teamService.createTeam({
          name: values.name,
          description: values.description,
          player2Id: Number(values.player2Id)
        });
        
        if (response.success) {
          // Recargar equipos para mostrar el nuevo
          const teamsResponse = await teamService.getTeams(1, 12);
          if (teamsResponse.success) {
            setTeams(teamsResponse.data.data);
            setTotalPages(teamsResponse.data.meta.last_page);
            setPage(1); // Volver a la primera página
          }
          
          setMessage({ type: 'success', text: 'Equipo creado correctamente' });
          handleCloseDialog();
        } else {
          setMessage({ type: 'error', text: 'Error al crear el equipo' });
        }
      } catch (error) {
        console.error('Error creating team:', error);
        setMessage({ type: 'error', text: 'Error al crear el equipo' });
      }
    },
  });

  // Filtrar equipos por término de búsqueda
  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (team.player1?.name && team.player1.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (team.player2?.name && team.player2.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Layout>
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Equipos
          </Typography>
          {isAuthenticated && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
            >
              Crear Equipo
            </Button>
          )}
        </Box>

        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar equipos por nombre o jugadores..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredTeams.length > 0 ? (
          <>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
              {filteredTeams.map((team) => (
                <Box key={team.id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                      },
                    }}
                    component={RouterLink}
                    to={`/teams/${team.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {team.name}
                      </Typography>
                      {team.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {team.description.length > 100 
                            ? `${team.description.substring(0, 100)}...` 
                            : team.description}
                        </Typography>
                      )}
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Jugadores:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {team.player1 && (
                            <Chip
                              avatar={
                                <Avatar>
                                  {team.player1.name.substring(0, 1).toUpperCase()}
                                </Avatar>
                              }
                              label={team.player1.name}
                              size="small"
                              sx={{ 
                                bgcolor: team.player1.id === user?.id ? 'primary.light' : undefined,
                                color: team.player1.id === user?.id ? 'white' : undefined
                              }}
                            />
                          )}
                          {team.player2 && (
                            <Chip
                              avatar={
                                <Avatar>
                                  {team.player2.name.substring(0, 1).toUpperCase()}
                                </Avatar>
                              }
                              label={team.player2.name}
                              size="small"
                              sx={{ 
                                bgcolor: team.player2.id === user?.id ? 'primary.light' : undefined,
                                color: team.player2.id === user?.id ? 'white' : undefined
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
              />
            </Box>
          </>
        ) : (
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No se encontraron equipos
            </Typography>
            {searchTerm && (
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                Intenta con otro término de búsqueda
              </Typography>
            )}
          </Box>
        )}

        {/* Diálogo para crear equipo */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <form onSubmit={formik.handleSubmit}>
            <DialogTitle>Crear Nuevo Equipo</DialogTitle>
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
                <FormControl 
                  fullWidth 
                  margin="normal"
                  error={formik.touched.player2Id && Boolean(formik.errors.player2Id)}
                >
                  <Autocomplete
                    id="player2-autocomplete"
                    options={availablePlayers}
                    loading={loadingPlayers}
                    getOptionLabel={(option) => `${option.name} (${getPlayerLevelText(option.playerLevel)})`}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(_, value) => {
                      formik.setFieldValue('player2Id', value ? value.id : '');
                    }}
                    onInputChange={handleUserSearch}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        label="Buscar compañero de equipo" 
                        error={formik.touched.player2Id && Boolean(formik.errors.player2Id)}
                        helperText={formik.touched.player2Id && formik.errors.player2Id}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {loadingPlayers ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                      />
                    )}
                    renderOption={(props, option) => {
                      // Extraer la propiedad key del objeto props
                      const { key, ...otherProps } = props;
                      return (
                        <li key={key} {...otherProps}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                              {option.name.substring(0, 1).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="body1">{option.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {getPlayerLevelText(option.playerLevel)}
                              </Typography>
                            </Box>
                          </Box>
                        </li>
                      );
                    }}
                  />
                </FormControl>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancelar</Button>
              <Button type="submit" variant="contained" color="primary">
                Crear Equipo
              </Button>
            </DialogActions>
          </form>
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

export default TeamsPage;
