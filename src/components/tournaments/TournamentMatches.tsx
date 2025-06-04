import React, { useState } from 'react';
import {
  Card,
  Typography,
  Box,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Button,
  Tabs,
  Tab,
  Chip,
  Pagination,
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import MatchResultForm from './MatchResultForm';
import MatchDetails from './MatchDetails';
import type { Match, Tournament } from '../../types/models';
import { useAuth } from '../../contexts/AuthContext';
import matchService from '../../services/matchService';

// Interfaces
interface TournamentMatchesProps {
  tournament: Tournament;
  matches: Match[];
  loading: boolean;
  onRegisterResult: (matchId: number, scoreTeam1: number, scoreTeam2: number, setResults: {team1: number, team2: number}[], winnerId: number | null, status: string) => void;
}

interface PaginationMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  firstPage: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Componente TabPanel
const TabPanel: React.FC<TabPanelProps> = (props) => {
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
        <Box sx={{ p: 1 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

// Componente principal
const TournamentMatches: React.FC<TournamentMatchesProps> = ({
  tournament,
  matches,
  loading,
  onRegisterResult
}) => {
  // Estados
  const { user, isAuthenticated } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [detailedMatch, setDetailedMatch] = useState<Match | null>(null);
  const [loadingMatchDetails, setLoadingMatchDetails] = useState(false);
  const [page, setPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);

  // Lógica de permisos
  const canManageTournament = user && (
    user.userRoleId === 1 || // Admin
    user.userRoleId === 3 || // Organizador
    (tournament.organizerId === user.id) // Creador del torneo
  );

  // Filtrar partidos por ronda
  const rounds = matches && matches.length > 0 
    ? [...new Set(matches.map(match => match.round))].sort((a, b) => a - b) 
    : [];

  // Manejadores de eventos
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleResultDialogOpen = (match: Match) => {
    setSelectedMatch(match);
    setResultDialogOpen(true);
  };

  const handleResultDialogClose = () => {
    setResultDialogOpen(false);
    setSelectedMatch(null);
  };

  const handleDetailDialogOpen = async (match: Match) => {
    setSelectedMatch(match);
    setDetailDialogOpen(true);
    setLoadingMatchDetails(true);
    
    try {
      const response = await matchService.getMatch(match.id);
      if (response.success) {
        setDetailedMatch(response.data);
      }
    } catch (error) {
      console.error('Error fetching match details:', error);
    } finally {
      setLoadingMatchDetails(false);
    }
  };
  
  const handleDetailDialogClose = () => {
    setDetailDialogOpen(false);
    setSelectedMatch(null);
    setDetailedMatch(null);
  };

  const handleSubmitResult = (matchId: number, scoreTeam1: number, scoreTeam2: number, setResults: {team1: number, team2: number}[], winnerId: number | null, status: string) => {
    onRegisterResult(
      matchId, 
      scoreTeam1, 
      scoreTeam2,
      setResults,
      winnerId,
      status
    );
    handleResultDialogClose();
  };

  // Comprobar si el usuario puede registrar resultados
  const canRegisterResult = (match: Match) => {
    if (canManageTournament) return true;
    
    if (isAuthenticated && user) {
      if (match.team1?.player1Id === user.id || match.team1?.player2Id === user.id ||
          match.team2?.player1Id === user.id || match.team2?.player2Id === user.id) {
        return true;
      }
    }
    return false;
  };

  // Renderizado de botones de acción
  const renderMatchActions = (match: Match) => {
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<InfoIcon />}
          onClick={() => handleDetailDialogOpen(match)}
        >
          Detalles
        </Button>
        
        {!match.winnerId && canRegisterResult(match) && (
          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => handleResultDialogOpen(match)}
          >
            Registrar
          </Button>
        )}
      </Box>
    );
  };

  // Renderizado del estado como chip
  const getMatchStatusChip = (match: Match) => {
    if (match.winnerId) {
      return <Chip label="Completado" color="success" size="small" />;
    } else if (match.status === 'in_progress') {
      return <Chip label="En progreso" color="primary" size="small" />;
    } else {
      return <Chip label="Pendiente" color="default" size="small" />;
    }
  };

  // Manejador de cambio de página
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    // Aquí se implementaría la llamada a la API para obtener la página solicitada
    // Por ejemplo: fetchMatches(tournament.id, value);
  };

  // Función para obtener el nombre correcto de la ronda
  const getRoundName = (round: number) => {
    // Asumimos que el número de ronda más bajo corresponde a las primeras rondas del torneo
    // y el número más alto a la ronda final
    const maxRound = Math.max(...rounds);
    
    if (round === maxRound) {
      return 'Final';
    } else if (round === maxRound - 1) {
      return 'Semifinales';
    } else if (round === maxRound - 2) {
      return 'Cuartos';
    } else if (round === maxRound - 3) {
      return 'Octavos';
    } else {
      return `Ronda ${round}`;
    }
  };

  // Renderizado
  return (
    <Box sx={{ mb: 3 }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant="scrollable"
              scrollButtons="auto"
            >
              {rounds.map((round, index) => (
                <Tab 
                  key={round} 
                  label={getRoundName(round)}
                  id={`match-tab-${index}`}
                  aria-controls={`match-tabpanel-${index}`}
                />
              ))}
            </Tabs>
          </Box>

          {rounds.map((round, index) => {
            const roundMatches = matches.filter(match => match.round === round);
            
            return (
              <TabPanel key={round} value={tabValue} index={index}>
                <TableContainer component={Card}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Equipo 1</TableCell>
                        <TableCell>Equipo 2</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Resultado</TableCell>
                        <TableCell>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {roundMatches.length > 0 ? roundMatches.map((match) => (
                        <TableRow key={match.id}>
                          <TableCell>
                            {match.winnerId && match.team1Score !== null && match.team2Score !== null ? (
                              Number(match.team1Score) > Number(match.team2Score) ? (
                                <Typography variant="body2" fontWeight="bold" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  {match.team1?.name || 'Equipo 1'} 🏆
                                </Typography>
                              ) : (
                                <Typography variant="body2">
                                  {match.team1?.name || 'Equipo 1'}
                                </Typography>
                              )
                            ) : (
                              <Typography variant="body2">
                                {match.team1?.name || 'Equipo 1'}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {match.winnerId && match.team1Score !== null && match.team2Score !== null ? (
                              Number(match.team2Score) > Number(match.team1Score) ? (
                                <Typography variant="body2" fontWeight="bold" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  {match.team2?.name || 'Equipo 2'} 🏆
                                </Typography>
                              ) : (
                                <Typography variant="body2">
                                  {match.team2?.name || 'Equipo 2'}
                                </Typography>
                              )
                            ) : (
                              <Typography variant="body2">
                                {match.team2?.name || 'Equipo 2'}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>{getMatchStatusChip(match)}</TableCell>
                          <TableCell>
                            {match.winnerId && match.team1Score !== null && match.team2Score !== null ? (
                              <Typography variant="body2" fontWeight="medium">
                                {match.team1Score} - {match.team2Score}
                              </Typography>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                Sin registrar
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>{renderMatchActions(match)}</TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <Typography variant="body2" color="text.secondary">
                              No hay partidos disponibles en esta ronda
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {/* Paginación para esta ronda si hay suficientes partidos */}
                {paginationMeta && paginationMeta.lastPage > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Pagination 
                      count={paginationMeta.lastPage} 
                      page={page} 
                      onChange={handlePageChange} 
                      color="primary" 
                    />
                  </Box>
                )}
              </TabPanel>
            );
          })}
        </>
      )}

      {/* Formulario para registrar resultado */}
      <MatchResultForm 
        open={resultDialogOpen} 
        match={selectedMatch} 
        onClose={handleResultDialogClose} 
        onSubmit={handleSubmitResult}
      />

      {/* Componente para ver detalles del partido */}
      <MatchDetails 
        open={detailDialogOpen} 
        match={detailedMatch} 
        loading={loadingMatchDetails} 
        onClose={handleDetailDialogClose} 
        finalRound={rounds.length > 0 ? Math.max(...rounds) : 1}
      />
    </Box>
  );
};

export default TournamentMatches;