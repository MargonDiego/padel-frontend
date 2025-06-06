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
  Chip,
  Avatar,
  Alert,
  Snackbar
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import Layout from '../components/common/Layout';
import type { Team } from '../types/models';
import teamService from '../services/teamService';
import { useAuth } from '../contexts/AuthContext';

const MyTeamsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Cargar mis equipos
  useEffect(() => {
    const fetchMyTeams = async () => {
      setLoading(true);
      try {
        const response = await teamService.getMyTeams(page, 12);
        if (response.success) {
          setTeams(response.data.data);
          setTotalPages(response.data.meta.last_page);
        }
      } catch (error) {
        console.error('Error fetching my teams:', error);
        setMessage({ type: 'error', text: 'Error al cargar tus equipos' });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchMyTeams();
    }
  }, [page, isAuthenticated]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleCloseMessage = () => {
    setMessage(null);
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Mis Equipos
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={RouterLink}
            to="/teams"
          >
            Crear Nuevo Equipo
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : teams.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            No tienes equipos creados. ¡Crea tu primer equipo!
          </Alert>
        ) : (
          <>
            <Grid container spacing={3}>
              {teams.map((team) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={team.id}>
                  <Card 
                    variant="outlined"
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 3
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {team.name}
                      </Typography>
                      
                      {team.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {team.description}
                        </Typography>
                      )}
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {team.player1?.name && (
                          <Chip
                            avatar={<Avatar>{team.player1.name.charAt(0)}</Avatar>}
                            label={team.player1.name}
                            variant="outlined"
                            color="primary"
                          />
                        )}
                        {team.player2?.name && (
                          <Chip
                            avatar={<Avatar>{team.player2.name.charAt(0)}</Avatar>}
                            label={team.player2.name}
                            variant="outlined"
                            color="primary"
                          />
                        )}
                      </Box>
                      
                      <Box sx={{ mt: 'auto' }}>
                        <Button 
                          variant="contained" 
                          color="primary"
                          component={RouterLink}
                          to={`/teams/${team.id}`}
                          fullWidth
                        >
                          Ver Detalles
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handlePageChange} 
                  color="primary" 
                />
              </Box>
            )}
          </>
        )}
        
        <Snackbar 
          open={!!message} 
          autoHideDuration={6000} 
          onClose={handleCloseMessage}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          {message && (
            <Alert 
              onClose={handleCloseMessage} 
              severity={message.type} 
              sx={{ width: '100%' }}
            >
              {message.text}
            </Alert>
          )}
        </Snackbar>
      </Container>
    </Layout>
  );
};

export default MyTeamsPage;
