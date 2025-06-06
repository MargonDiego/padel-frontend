import { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/common/Layout';
import type { Tournament } from '../types/models';
import tournamentService from '../services/tournamentService';
import statsService from '../services/statsService';
import {
  HeroBanner,
  WelcomeSection,
  TournamentsSection,
  TeamsSection
} from '../components/home';

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
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          flexDirection: 'column',
          gap: 2
        }}>
          <CircularProgress color="secondary" />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Banner */}
      <HeroBanner isAuthenticated={isAuthenticated} />

      {/* Bienvenida personalizada si está autenticado */}
      {isAuthenticated && <WelcomeSection user={user} />}

      {/* Sección de Torneos Próximos */}
      <TournamentsSection tournaments={upcomingTournaments} />

      {/* Sección de Equipos Destacados */}
      <TeamsSection teams={topTeams} />
    </Layout>
  );
};

export default HomePage;
