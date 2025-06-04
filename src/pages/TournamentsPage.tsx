import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
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
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Chip,
  CardMedia,
  CardActionArea,
  FormHelperText
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Layout from '../components/common/Layout';
import type { Tournament } from '../types/models';
import tournamentService from '../services/tournamentService';
import { useAuth } from '../contexts/AuthContext';

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

const TournamentsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Cargar torneos
  useEffect(() => {
    const fetchTournaments = async () => {
      setLoading(true);
      try {
        const response = await tournamentService.getTournaments(page, 12, statusFilter || undefined);
        if (response.success) {
          setTournaments(response.data.data);
          setTotalPages(response.data.meta.last_page);
        }
      } catch (error) {
        console.error('Error fetching tournaments:', error);
        setMessage({ type: 'error', text: 'Error al cargar los torneos' });
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, [page, statusFilter]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setStatusFilter(event.target.value as string);
    setPage(1); // Resetear a la primera página cuando cambia el filtro
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
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
      startDate: null as Date | null,
      endDate: null as Date | null,
      format: '',
      maxTeams: '',
      location: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        // Convertir valores para la API
        const tournamentData = {
          ...values,
          startDate: values.startDate?.toISOString().split('T')[0] || '',
          endDate: values.endDate?.toISOString().split('T')[0] || '',
          maxTeams: values.maxTeams ? Number(values.maxTeams) : undefined
        };

        const response = await tournamentService.createTournament(tournamentData);
        
        if (response.success) {
          // Recargar torneos para mostrar el nuevo
          const tournamentsResponse = await tournamentService.getTournaments(1, 12, statusFilter || undefined);
          if (tournamentsResponse.success) {
            setTournaments(tournamentsResponse.data.data);
            setTotalPages(tournamentsResponse.data.meta.last_page);
            setPage(1); // Volver a la primera página
          }
          
          setMessage({ type: 'success', text: 'Torneo creado correctamente' });
          handleCloseDialog();
        } else {
          setMessage({ type: 'error', text: 'Error al crear el torneo' });
        }
      } catch (error) {
        console.error('Error creating tournament:', error);
        setMessage({ type: 'error', text: 'Error al crear el torneo' });
      }
    },
  });

  // Filtrar torneos por término de búsqueda
  const filteredTournaments = tournaments.filter(tournament => 
    tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tournament.description && tournament.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (tournament.location && tournament.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Determinar si el usuario puede crear torneos (solo admin y organizadores)
  const canCreateTournament = user && (user.userRoleId === 1 || user.userRoleId === 2);

  return (
    <Layout>
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Torneos
          </Typography>
          {isAuthenticated && canCreateTournament && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
            >
              Crear Torneo
            </Button>
          )}
        </Box>

        <Box sx={{ 
          mb: 4,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2
        }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar torneos..."
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
          <FormControl sx={{ minWidth: { sm: 200 } }}>
            <InputLabel id="status-filter-label">
              <FilterListIcon sx={{ mr: 0.5, verticalAlign: 'middle', fontSize: '1.2rem' }} />
              Estado
            </InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={statusFilter}
              label="Estado"
              onChange={handleStatusFilterChange as any}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="draft">Borrador</MenuItem>
              <MenuItem value="open">Inscripciones abiertas</MenuItem>
              <MenuItem value="in_progress">En progreso</MenuItem>
              <MenuItem value="completed">Completados</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredTournaments.length > 0 ? (
          <>
            <Grid container spacing={3}>
              {filteredTournaments.map((tournament) => (
                <Grid item xs={12} sm={6} md={4} key={tournament.id}>
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
                  >
                    <CardActionArea 
                      component={RouterLink}
                      to={`/tournaments/${tournament.id}`}
                      sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                    >
                      <CardMedia
                        component="div"
                        sx={{
                          height: 120,
                          bgcolor: 'primary.light',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                        }}
                      >
                        <SportsTennisIcon sx={{ fontSize: 40, opacity: 0.7 }} />
                      </CardMedia>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {tournament.name}
                          </Typography>
                          <Chip
                            label={tournament.status === 'draft' ? 'Borrador' : 
                                  tournament.status === 'open' ? 'Inscripciones abiertas' : 
                                  tournament.status === 'in_progress' ? 'En progreso' : 'Completado'}
                            size="small"
                            color={tournament.status === 'completed' ? 'success' : 
                                  tournament.status === 'in_progress' ? 'primary' : 
                                  tournament.status === 'open' ? 'info' : 'default'}
                            sx={{ ml: 1 }}
                          />
                        </Box>
                        {tournament.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {tournament.description.length > 80 
                              ? `${tournament.description.substring(0, 80)}...` 
                              : tournament.description}
                          </Typography>
                        )}
                        <Box sx={{ mt: 'auto' }}>
                          <Typography variant="body2" color="text.secondary">
                            Fechas: {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Formato: {tournament.format === 'elimination' ? 'Eliminación directa' : 'Round Robin'}
                          </Typography>
                          {tournament.location && (
                            <Typography variant="body2" color="text.secondary">
                              Ubicación: {tournament.location}
                            </Typography>
                          )}
                          {tournament.maxTeams && (
                            <Typography variant="body2" color="text.secondary">
                              Equipos máximos: {tournament.maxTeams}
                            </Typography>
                          )}
                          {tournament.organizer && (
                            <Typography variant="body2" color="text.secondary">
                              Organizador: {tournament.organizer.name}
                            </Typography>
                          )}
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
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
              No se encontraron torneos
            </Typography>
            {searchTerm && (
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                Intenta con otro término de búsqueda
              </Typography>
            )}
            {statusFilter && (
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                Intenta con otro filtro de estado
              </Typography>
            )}
          </Box>
        )}

        {/* Diálogo para crear torneo */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
            <form onSubmit={formik.handleSubmit}>
              <DialogTitle>Crear Nuevo Torneo</DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                  <Grid item xs={12} md={6}>
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
                  </Grid>
                  <Grid item xs={12} md={6}>
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
                  </Grid>
                  <Grid item xs={12} md={6}>
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
                  </Grid>
                  <Grid item xs={12} md={6}>
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
                  </Grid>
                  <Grid item xs={12} md={6}>
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
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="location"
                      name="location"
                      label="Ubicación"
                      value={formik.values.location}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
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
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancelar</Button>
                <Button type="submit" variant="contained" color="primary">
                  Crear Torneo
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        </LocalizationProvider>

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

export default TournamentsPage;
