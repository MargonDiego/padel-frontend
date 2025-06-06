import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Pagination,
  Alert,
  Paper,
  Tabs,
  Tab,
  Divider,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Layout from '../components/common/Layout';
import matchService from '../services/matchService';
import type { Match } from '../types/models';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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
      id={`match-tabpanel-${index}`}
      aria-labelledby={`match-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `match-tab-${index}`,
    'aria-controls': `match-tabpanel-${index}`,
  };
}

const MatchesPage: React.FC = () => {
  const theme = useTheme();
  const [tabIndex, setTabIndex] = useState(0);
  const [matches, setMatches] = useState<Match[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tournamentFilter, setTournamentFilter] = useState<string>('');
  const [tournaments, setTournaments] = useState<{id: number, name: string}[]>([]);

  // Cargar todos los partidos y luego filtrar por estado según la pestaña seleccionada
  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      setError(null);
      try {
        // Cargar todos los partidos sin filtrar por estado
        const response = await matchService.getMatches(page, 20);
        
        if (response.success && response.data) {
          // Obtener todos los partidos
          const allMatches = response.data.data || [];
          
          // Filtrar según la pestaña seleccionada
          let filteredMatches = allMatches;
          
          if (tabIndex === 0) {
            // Próximos partidos: Partidos programados pendientes
            filteredMatches = allMatches.filter(match => 
              match.status === 'pending' || !match.completedAt
            );
          } else if (tabIndex === 1) {
            // Partidos en progreso
            filteredMatches = allMatches.filter(match => 
              match.status === 'in_progress'
            );
          } else if (tabIndex === 2) {
            // Partidos completados
            filteredMatches = allMatches.filter(match => 
              match.status === 'completed' || match.winnerId
            );
          }
          
          // Filtrar por torneo si hay uno seleccionado
          if (tournamentFilter) {
            filteredMatches = filteredMatches.filter(match => 
              match.tournament?.id.toString() === tournamentFilter
            );
          }
          
          setMatches(filteredMatches);
          
          // Extraer torneos únicos para el filtro
          const uniqueTournaments = Array.from(
            new Set(allMatches.map(match => match.tournament?.id))
          ).filter(id => id !== undefined).map(id => {
            const tournament = allMatches.find(m => m.tournament?.id === id)?.tournament;
            return {
              id: tournament?.id || 0,
              name: tournament?.name || ''
            };
          });
          
          if (uniqueTournaments.length > 0) {
            setTournaments(uniqueTournaments);
          }
          
          setTotalPages(1); // Con este enfoque no necesitamos paginación para la vista inicial
        } else {
          setError('No se pudieron cargar los partidos');
        }
      } catch (error) {
        console.error('Error al cargar los partidos:', error);
        setError('Error al cargar los partidos');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [page, tabIndex, tournamentFilter]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    setPage(1); // Reiniciar a la primera página cuando cambia la pestaña
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleTournamentFilterChange = (event: SelectChangeEvent) => {
    setTournamentFilter(event.target.value);
    setPage(1); // Reiniciar a la primera página cuando cambia el filtro
  };

  // Formatear fecha y hora del partido
  const formatMatchDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return format(date, "dd 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es });
    } catch (error) {
      return dateTimeString;
    }
  };

  // Obtener el color del chip según el estado del partido
  const getStatusChipProps = (status: string) => {
    switch (status) {
      case 'upcoming':
        return { 
          label: 'Próximo', 
          color: 'primary' as const, 
          icon: <CalendarTodayIcon /> 
        };
      case 'in_progress':
        return { 
          label: 'En progreso', 
          color: 'warning' as const,
          icon: <SportsTennisIcon /> 
        };
      case 'completed':
        return { 
          label: 'Finalizado', 
          color: 'success' as const,
          icon: <EmojiEventsIcon /> 
        };
      default:
        return { 
          label: status, 
          color: 'default' as const,
          icon: undefined 
        };
    }
  };

  // Renderizar un partido
  const renderMatch = (match: Match) => {
    const statusProps = getStatusChipProps(match.status);
    
    return (
      <Grid size={{ xs: 12, md: 6 }} key={match.id}>
        <Card 
          variant="outlined" 
          sx={{ 
            height: '100%',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 3
            }
          }}
        >
          <CardContent>
            {/* Encabezado con torneo y estado */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {match.tournament?.name || 'Torneo no especificado'}
              </Typography>
              <Chip 
                label={statusProps.label} 
                color={statusProps.color as any} 
                size="small" 
                icon={statusProps.icon}
              />
            </Box>
            
            {/* Fecha y hora */}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {formatMatchDateTime(match.scheduledAt)}
            </Typography>
            
            {/* Equipos y resultado */}
            <Box sx={{ mb: 2 }}>
              <Grid container spacing={1}>
                {/* Equipo 1 */}
                <Grid size={5}>
                  <Box 
                    sx={{ 
                      textAlign: 'center', 
                      p: 1, 
                      borderRadius: 1, 
                      bgcolor: match.status === 'completed' && match.winner?.id === match.team1?.id 
                        ? 'success.light' 
                        : 'background.paper'
                    }}
                  >
                    <Typography variant="body1" fontWeight="bold">
                      {match.team1?.name || 'Equipo 1'}
                    </Typography>
                    <Typography variant="caption" display="block">
                      {match.team1?.player1?.name || ''} / {match.team1?.player2?.name || ''}
                    </Typography>
                  </Box>
                </Grid>
                
                {/* Resultado o VS */}
                <Grid size={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    {match.status === 'completed' ? (
                      <Typography variant="h6" fontWeight="bold" color="text.primary">
                        {match.scoreTeam1 || 0} - {match.scoreTeam2 || 0}
                      </Typography>
                    ) : (
                      <Typography variant="h6" color="text.secondary">
                        VS
                      </Typography>
                    )}
                  </Box>
                </Grid>
                
                {/* Equipo 2 */}
                <Grid size={5}>
                  <Box 
                    sx={{ 
                      textAlign: 'center', 
                      p: 1, 
                      borderRadius: 1, 
                      bgcolor: match.status === 'completed' && match.winner?.id === match.team2?.id 
                        ? 'success.light' 
                        : 'background.paper'
                    }}
                  >
                    <Typography variant="body1" fontWeight="bold">
                      {match.team2?.name || 'Equipo 2'}
                    </Typography>
                    <Typography variant="caption" display="block">
                      {match.team2?.player1?.name || ''} / {match.team2?.player2?.name || ''}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            
            {/* Sets (si el partido está completado) */}
            {match.status === 'completed' && match.setResults && match.setResults.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Resultados por set:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {Array.isArray(match.setResults) ? match.setResults.map((set, index) => (
                    <Chip 
                      key={index}
                      label={`${set.team1} - ${set.team2}`}
                      variant="outlined"
                      size="small"
                    />
                  )) : (
                    <Typography variant="body2">{match.setResults || 'No hay resultados disponibles'}</Typography>
                  )}
                </Box>
              </Box>
            )}
            
            {/* Botón para ver detalles */}
            <Button 
              component={RouterLink}
              to={`/matches/${match.id}`}
              variant="contained" 
              color="primary" 
              fullWidth
              size="small"
              sx={{ mt: 1 }}
            >
              Ver detalles
            </Button>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Partidos
          </Typography>
          
          {/* Filtro por torneo */}
          <FormControl sx={{ minWidth: 250 }}>
            <InputLabel id="tournament-filter-label">Filtrar por torneo</InputLabel>
            <Select
              labelId="tournament-filter-label"
              id="tournament-filter"
              value={tournamentFilter}
              label="Filtrar por torneo"
              onChange={handleTournamentFilterChange}
              size="small"
            >
              <MenuItem value="">
                <em>Todos los torneos</em>
              </MenuItem>
              {tournaments.map((tournament) => (
                <MenuItem key={tournament.id} value={tournament.id.toString()}>
                  {tournament.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <Paper sx={{ width: '100%', mb: 2 }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            aria-label="match status tabs"
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab 
              label="Próximos partidos" 
              icon={<CalendarTodayIcon />} 
              {...a11yProps(0)} 
            />
            <Tab 
              label="En progreso" 
              icon={<SportsTennisIcon />} 
              {...a11yProps(1)} 
            />
            <Tab 
              label="Finalizados" 
              icon={<EmojiEventsIcon />} 
              {...a11yProps(2)} 
            />
          </Tabs>

          <TabPanel value={tabIndex} index={0}>
            {renderMatchesContent()}
          </TabPanel>
          
          <TabPanel value={tabIndex} index={1}>
            {renderMatchesContent()}
          </TabPanel>
          
          <TabPanel value={tabIndex} index={2}>
            {renderMatchesContent()}
          </TabPanel>
        </Paper>
      </Container>
    </Layout>
  );

  // Función auxiliar para renderizar el contenido de los partidos
  function renderMatchesContent() {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    if (error) {
      return (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      );
    }
    
    if (matches.length === 0) {
      return (
        <Alert severity="info" sx={{ my: 2 }}>
          No hay partidos {tabIndex === 0 ? 'próximos' : tabIndex === 1 ? 'en progreso' : 'finalizados'} 
          {tournamentFilter ? ' para el torneo seleccionado' : ''}.
        </Alert>
      );
    }
    
    return (
      <>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {matches.map(match => renderMatch(match))}
        </Grid>
        
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, pb: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="medium"
            />
          </Box>
        )}
      </>
    );
  }
};

export default MatchesPage;
