import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Chip,
  Avatar,
  CircularProgress,
  Pagination,
  Alert
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import Layout from '../components/common/Layout';
import { rankingService } from '../services/rankingService';
import type { RankingPlayer, RankingTeam } from '../services/rankingService';

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
      id={`ranking-tabpanel-${index}`}
      aria-labelledby={`ranking-tab-${index}`}
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
    id: `ranking-tab-${index}`,
    'aria-controls': `ranking-tabpanel-${index}`,
  };
}

const RankingsPage: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [playersPage, setPlayersPage] = useState(1);
  const [teamsPage, setTeamsPage] = useState(1);
  const [playersTotalPages, setPlayersTotalPages] = useState(1);
  const [teamsTotalPages, setTeamsTotalPages] = useState(1);
  const [playersLoading, setPlayersLoading] = useState(true);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [playersError, setPlayersError] = useState<string | null>(null);
  const [teamsError, setTeamsError] = useState<string | null>(null);
  const [playerRankings, setPlayerRankings] = useState<RankingPlayer[]>([]);
  const [teamRankings, setTeamRankings] = useState<RankingTeam[]>([]);

  // Cargar rankings de jugadores
  useEffect(() => {
    const fetchPlayerRankings = async () => {
      setPlayersLoading(true);
      setPlayersError(null);
      try {
        const response = await rankingService.getPlayerRankings(playersPage);
        if (response.success) {
          // La respuesta trae directamente un array de datos en response.data
          setPlayerRankings(response.data || []);
          // Como no hay paginación en la API, solo mostraremos una página
          setPlayersTotalPages(1);
        } else {
          setPlayersError('No se pudieron cargar los rankings de jugadores');
        }
      } catch (error) {
        console.error('Error fetching player rankings:', error);
        setPlayersError('Error al cargar los rankings de jugadores');
      } finally {
        setPlayersLoading(false);
      }
    };

    fetchPlayerRankings();
  }, [playersPage]);

  // Cargar rankings de equipos
  useEffect(() => {
    const fetchTeamRankings = async () => {
      setTeamsLoading(true);
      setTeamsError(null);
      try {
        const response = await rankingService.getTeamRankings(teamsPage);
        if (response.success) {
          // La respuesta trae directamente un array de datos en response.data
          setTeamRankings(response.data || []);
          // Como no hay paginación en la API, solo mostraremos una página
          setTeamsTotalPages(1);
        } else {
          setTeamsError('No se pudieron cargar los rankings de equipos');
        }
      } catch (error) {
        console.error('Error fetching team rankings:', error);
        setTeamsError('Error al cargar los rankings de equipos');
      } finally {
        setTeamsLoading(false);
      }
    };

    fetchTeamRankings();
  }, [teamsPage]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handlePlayersPageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPlayersPage(value);
  };

  const handleTeamsPageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setTeamsPage(value);
  };

  // Función para renderizar medallas según la posición
  const renderPosition = (position: number) => {
    if (position === 1) {
      return (
        <Chip 
          icon={<EmojiEventsIcon />} 
          label="1° Lugar" 
          color="primary" 
          variant="outlined" 
          sx={{ 
            bgcolor: 'rgba(255, 215, 0, 0.1)', 
            borderColor: 'gold',
            color: 'gold',
            fontWeight: 'bold'
          }} 
        />
      );
    } else if (position === 2) {
      return (
        <Chip 
          icon={<EmojiEventsIcon />} 
          label="2° Lugar" 
          color="primary" 
          variant="outlined" 
          sx={{ 
            bgcolor: 'rgba(192, 192, 192, 0.1)', 
            borderColor: 'silver',
            color: 'silver',
            fontWeight: 'bold'
          }} 
        />
      );
    } else if (position === 3) {
      return (
        <Chip 
          icon={<EmojiEventsIcon />} 
          label="3° Lugar" 
          color="primary" 
          variant="outlined" 
          sx={{ 
            bgcolor: 'rgba(205, 127, 50, 0.1)', 
            borderColor: '#CD7F32',
            color: '#CD7F32',
            fontWeight: 'bold'
          }} 
        />
      );
    } else {
      return <Typography>{position}° Lugar</Typography>;
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Rankings
        </Typography>
        
        <Paper sx={{ width: '100%', mb: 2 }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            aria-label="ranking tabs"
            variant="fullWidth"
          >
            <Tab 
              icon={<PersonIcon />} 
              label="Jugadores" 
              {...a11yProps(0)} 
            />
            <Tab 
              icon={<PeopleIcon />} 
              label="Equipos" 
              {...a11yProps(1)} 
            />
          </Tabs>

          {/* Panel de Rankings de Jugadores */}
          <TabPanel value={tabIndex} index={0}>
            {playersLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            ) : playersError ? (
              <Alert severity="error" sx={{ my: 2 }}>
                {playersError}
              </Alert>
            ) : playerRankings.length === 0 ? (
              <Alert severity="info" sx={{ my: 2 }}>
                No hay datos de ranking disponibles todavía.
              </Alert>
            ) : (
              <>
                <TableContainer component={Paper} variant="outlined">
                  <Table sx={{ minWidth: 650 }} aria-label="player rankings table">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'primary.main' }}>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Posición</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Jugador</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nivel</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Puntos</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Partidos</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Victorias</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Torneos Ganados</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">% Victorias</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {playerRankings.map((player, index) => (
                        <TableRow
                          key={player.id}
                          sx={{
                            '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                            '&:hover': { backgroundColor: 'action.selected' },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {renderPosition(index + 1 + (playersPage - 1) * 20)}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ mr: 2 }}>{player.player.name.charAt(0)}</Avatar>
                              {player.player.name}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={player.player.playingPosition || 'No definido'} 
                              color={
                                player.player.playingPosition === 'drive' ? 'primary' :
                                player.player.playingPosition === 'reves' ? 'secondary' : 'default'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography fontWeight="bold">{player.rankingPoints}</Typography>
                          </TableCell>
                          <TableCell align="right">{player.matchesPlayed}</TableCell>
                          <TableCell align="right">{player.matchesWon}</TableCell>
                          <TableCell align="right">{player.tournamentsWon}</TableCell>
                          <TableCell align="right">{player.winRatio}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {playersTotalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Pagination
                      count={playersTotalPages}
                      page={playersPage}
                      onChange={handlePlayersPageChange}
                      color="primary"
                    />
                  </Box>
                )}
              </>
            )}
          </TabPanel>

          {/* Panel de Rankings de Equipos */}
          <TabPanel value={tabIndex} index={1}>
            {teamsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            ) : teamsError ? (
              <Alert severity="error" sx={{ my: 2 }}>
                {teamsError}
              </Alert>
            ) : teamRankings.length === 0 ? (
              <Alert severity="info" sx={{ my: 2 }}>
                No hay datos de ranking de equipos disponibles todavía.
              </Alert>
            ) : (
              <>
                <TableContainer component={Paper} variant="outlined">
                  <Table sx={{ minWidth: 650 }} aria-label="team rankings table">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'primary.main' }}>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Posición</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Equipo</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Jugadores</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Puntos</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Partidos</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Victorias</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Torneos Ganados</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">% Victorias</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {teamRankings.map((team, index) => (
                        <TableRow
                          key={team.id}
                          sx={{
                            '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                            '&:hover': { backgroundColor: 'action.selected' },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {renderPosition(index + 1 + (teamsPage - 1) * 20)}
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight="bold">{team.team.name}</Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              <Chip
                                avatar={<Avatar>{team.team.player1.name.charAt(0)}</Avatar>}
                                label={team.team.player1.name}
                                variant="outlined"
                                size="small"
                              />
                              <Chip
                                avatar={<Avatar>{team.team.player2.name.charAt(0)}</Avatar>}
                                label={team.team.player2.name}
                                variant="outlined"
                                size="small"
                              />
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography fontWeight="bold">{team.rankingPoints}</Typography>
                          </TableCell>
                          <TableCell align="right">{team.matchesPlayed}</TableCell>
                          <TableCell align="right">{team.matchesWon}</TableCell>
                          <TableCell align="right">{team.tournamentsWon}</TableCell>
                          <TableCell align="right">{team.winRatio}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {teamsTotalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Pagination
                      count={teamsTotalPages}
                      page={teamsPage}
                      onChange={handleTeamsPageChange}
                      color="primary"
                    />
                  </Box>
                )}
              </>
            )}
          </TabPanel>
        </Paper>
      </Container>
    </Layout>
  );
};

export default RankingsPage;
