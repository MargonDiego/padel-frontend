import { useEffect, useState } from 'react';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Button, 
  CircularProgress,
  CardMedia,
  Paper,
  Stack
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/common/Layout';
import type { Tournament } from '../types/models';
import tournamentService from '../services/tournamentService';
import statsService from '../services/statsService';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [upcomingTournaments, setUpcomingTournaments] = useState<Tournament[]>([]);
  const [topTeams, setTopTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener torneos próximos (en estado 'open')
        const tournamentsResponse = await tournamentService.getTournaments(1, 4, 'open');
        if (tournamentsResponse.success) {
          setUpcomingTournaments(tournamentsResponse.data.data);
        }

        // Obtener equipos mejor clasificados
        const teamsRankingResponse = await statsService.getTeamRanking(4);
        if (teamsRankingResponse.success) {
          setTopTeams(teamsRankingResponse.data);
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Banner */}
      <Box
        sx={{
          position: 'relative',
          height: '400px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 6,
          bgcolor: 'primary.main',
          color: 'white',
          borderRadius: 2,
          overflow: 'hidden',
          p: 4,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url("https://images.unsplash.com/photo-1625463204208-e837cf256281")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3,
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            maxWidth: 800,
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Bienvenido a PADEL APP
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            La plataforma para gestionar torneos, equipos y partidos de pádel
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              component={RouterLink}
              to="/tournaments"
              variant="contained"
              size="large"
              sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText' }}
            >
              Ver Torneos
            </Button>
            {!isAuthenticated && (
              <Button
                component={RouterLink}
                to="/register"
                variant="outlined"
                size="large"
                sx={{ color: 'white', borderColor: 'white' }}
              >
                Registrarse
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      {/* Bienvenida personalizada si está autenticado */}
      {isAuthenticated && (
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>
            Hola, {user?.name}! 👋
          </Typography>
          <Typography variant="body1" paragraph>
            Bienvenido de nuevo a la plataforma. Aquí podrás gestionar tus equipos, inscribirte en torneos y llevar un seguimiento de tus estadísticas.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              component={RouterLink}
              to="/my-teams"
              variant="contained"
              color="primary"
            >
              Mis Equipos
            </Button>
            <Button
              component={RouterLink}
              to="/profile"
              variant="outlined"
              color="primary"
            >
              Mi Perfil
            </Button>
          </Box>
        </Paper>
      )}

      {/* Sección de Torneos Próximos */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 6, mb: 3 }}>
        Torneos Próximos
      </Typography>
      <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap' }}>
        {upcomingTournaments.length > 0 ? (
          upcomingTournaments.map((tournament) => (
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, p: 1, boxSizing: 'border-box' }} key={tournament.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="div"
                  sx={{
                    height: 140,
                    bgcolor: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                  }}
                >
                  <Typography variant="h6">{tournament.name}</Typography>
                </CardMedia>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {tournament.description || 'Sin descripción'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Formato: {tournament.format === 'elimination' ? 'Eliminación' : 'Round Robin'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ubicación: {tournament.location || 'Por definir'}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      component={RouterLink}
                      to={`/tournaments/${tournament.id}`}
                      variant="outlined"
                      size="small"
                      fullWidth
                    >
                      Ver Detalles
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))
        ) : (
          <Box sx={{ width: '100%' }}>
            <Typography variant="body1" align="center">
              No hay torneos próximos disponibles.
            </Typography>
          </Box>
        )}
      </Stack>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button
          component={RouterLink}
          to="/tournaments"
          variant="contained"
          color="primary"
        >
          Ver Todos los Torneos
        </Button>
      </Box>

      {/* Sección de Equipos Destacados */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 6, mb: 3 }}>
        Equipos Destacados
      </Typography>
      <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap' }}>
        {topTeams.length > 0 ? (
          topTeams.map((teamStat) => (
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, p: 1, boxSizing: 'border-box' }} key={teamStat.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {teamStat.team.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mr: 1 }}>
                      Ranking:
                    </Typography>
                    <Typography variant="body2">
                      {teamStat.rankingPoints} puntos
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mr: 1 }}>
                      Victorias/Derrotas:
                    </Typography>
                    <Typography variant="body2">
                      {teamStat.matchesWon}/{teamStat.matchesLost}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mr: 1 }}>
                      Ratio de victorias:
                    </Typography>
                    <Typography variant="body2">
                      {(teamStat.winRatio * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      component={RouterLink}
                      to={`/teams/${teamStat.teamId}`}
                      variant="outlined"
                      size="small"
                      fullWidth
                    >
                      Ver Equipo
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))
        ) : (
          <Box sx={{ width: '100%' }}>
            <Typography variant="body1" align="center">
              No hay datos de equipos disponibles.
            </Typography>
          </Box>
        )}
      </Stack>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button
          component={RouterLink}
          to="/rankings/teams"
          variant="contained"
          color="primary"
        >
          Ver Ranking Completo
        </Button>
      </Box>
    </Layout>
  );
};

export default HomePage;
