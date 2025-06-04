import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import Layout from '../components/common/Layout';
import matchService from '../services/matchService';
import type { Match } from '../types/models';

// Componentes personalizados
import TournamentFilter from '../components/matches/TournamentFilter';
import MatchStatusTabs from '../components/matches/MatchStatusTabs';
import EnhancedMatchCard from '../components/matches/EnhancedMatchCard';
import MatchDetailDialog from '../components/matches/MatchDetailDialog';

const AllMatchesPage: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [tournaments, setTournaments] = useState<{id: number, name: string}[]>([]);
  const [tournamentFilter, setTournamentFilter] = useState<string>('');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Manejadores
  const handleTabChange = (newValue: number) => {
    setTabIndex(newValue);
  };

  const handleTournamentChange = (value: string) => {
    setTournamentFilter(value);
  };
  
  const handleOpenDialog = (match: Match) => {
    setSelectedMatch(match);
    setDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Cargar partidos
  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await matchService.getMatches(1, 50);
        if (response.success && response.data && response.data.data) {
          const allMatches = response.data.data;
          setMatches(allMatches);
          setFilteredMatches(allMatches);
          
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
          
          setTournaments(uniqueTournaments);
        } else {
          setError('No se pudieron cargar los partidos');
        }
      } catch (error) {
        console.error('Error fetching matches:', error);
        setError('Error al cargar los partidos');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);
  
  // Filtrar partidos según la pestaña y torneo seleccionados
  useEffect(() => {
    if (matches.length === 0) return;
    
    let filtered = [...matches];
    
    // Filtrar por estado según la pestaña
    if (tabIndex === 0) {
      // Todos los partidos
      // No aplicamos filtro
    } else if (tabIndex === 1) {
      // Próximos partidos
      filtered = filtered.filter(match => 
        match.status === 'pending'
      );
    } else if (tabIndex === 2) {
      // Partidos en progreso
      filtered = filtered.filter(match => 
        match.status === 'in_progress'
      );
    } else if (tabIndex === 3) {
      // Partidos completados
      filtered = filtered.filter(match => 
        match.status === 'completed'
      );
    }
    
    // Filtrar por torneo si hay uno seleccionado
    if (tournamentFilter) {
      filtered = filtered.filter(match => 
        match.tournament?.id.toString() === tournamentFilter
      );
    }
    
    setFilteredMatches(filtered);
  }, [matches, tabIndex, tournamentFilter]);

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Partidos
          </Typography>
          
          {/* Filtros */}
          <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: { md: 'center' } }}>
            <TournamentFilter 
              tournaments={tournaments} 
              value={tournamentFilter} 
              onChange={handleTournamentChange} 
            />
          </Box>
          
          {/* Tabs de estados */}
          <MatchStatusTabs value={tabIndex} onChange={handleTabChange} />
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : filteredMatches.length === 0 ? (
          <Alert severity="info">No hay partidos disponibles con los filtros seleccionados.</Alert>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            {filteredMatches.map((match) => (
              <Box key={match.id}>
                <EnhancedMatchCard match={match} onViewDetails={handleOpenDialog} />
              </Box>
            ))}
          </Box>
        )}
        
        {/* Diálogo de detalles del partido */}
        {selectedMatch && (
          <MatchDetailDialog
            match={selectedMatch}
            open={dialogOpen}
            onClose={handleCloseDialog}
          />
        )}
      </Container>
    </Layout>
  );
};

export default AllMatchesPage;