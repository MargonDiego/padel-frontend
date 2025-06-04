import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import NumbersIcon from '@mui/icons-material/Numbers';
import type { Team, Tournament } from '../../types/models';
import { useAuth } from '../../contexts/AuthContext';

interface RegisteredTeamsProps {
  tournament: Tournament;
  teams: Team[];
  loading: boolean;
  onRegisterTeam: (teamId: number) => void;
  onUnregisterTeam: (teamId: number) => void;
  onAssignSeed: (teamId: number, seed: number) => void;
  userTeams?: Team[]; // Equipos del usuario actual
}

const RegisteredTeams: React.FC<RegisteredTeamsProps> = ({
  tournament,
  teams,
  loading,
  onRegisterTeam,
  onUnregisterTeam,
  onAssignSeed,
  userTeams = []
}) => {
  const { user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [seedDialogOpen, setSeedDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [seedValue, setSeedValue] = useState<string>('');

  // Determinar si el usuario puede gestionar este torneo
  const canManageTournament = user && (
    user.userRoleId === 1 || // Admin
    user.userRoleId === 3 || // Organizador (según la respuesta de la API, el role 3 es para organizadores)
    (tournament.organizerId === user.id) // Creador del torneo
  );

  // Filtrar equipos según término de búsqueda
  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.player1?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.player2?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Determinar si el usuario ya tiene un equipo registrado en este torneo
  const userHasTeamRegistered = teams.some(team => 
    team.player1Id === user?.id || team.player2Id === user?.id
  );

  // Equipos del usuario que no están inscritos en el torneo
  const availableUserTeams = userTeams.filter(team => {
    // Verificar que el equipo no esté ya inscrito
    const notRegistered = !teams.some(registeredTeam => registeredTeam.id === team.id);
    
    // Verificar que el usuario es miembro del equipo (como jugador 1 o 2)
    const userIsMember = team.player1Id === user?.id || team.player2Id === user?.id;
    
    return notRegistered && userIsMember;
  });

  const handleRegisterOpen = () => {
    setRegisterDialogOpen(true);
  };

  const handleRegisterClose = () => {
    setRegisterDialogOpen(false);
  };

  const handleSeedDialogOpen = (team: Team) => {
    setSelectedTeam(team);
    setSeedValue(team.seed ? team.seed.toString() : '');
    setSeedDialogOpen(true);
  };

  const handleSeedDialogClose = () => {
    setSeedDialogOpen(false);
    setSelectedTeam(null);
    setSeedValue('');
  };

  const handleSeedSubmit = () => {
    if (selectedTeam && seedValue !== '') {
      onAssignSeed(selectedTeam.id, parseInt(seedValue));
      handleSeedDialogClose();
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Equipos inscritos ({teams.length}{tournament.maxTeams ? `/${tournament.maxTeams}` : ''})
          </Typography>
          {tournament.status === 'open' && isAuthenticated && !userHasTeamRegistered && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={handleRegisterOpen}
              disabled={!availableUserTeams || availableUserTeams.length === 0}
              title={availableUserTeams && availableUserTeams.length === 0 ? "No tienes equipos disponibles para inscribir" : "Inscribe uno de tus equipos"}
            >
              Inscribir mi equipo
            </Button>
          )}
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar equipos..."
          size="small"
          sx={{ mb: 2 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : filteredTeams.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', p: 2 }}>
            No hay equipos inscritos en este torneo
          </Typography>
        ) : (
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {filteredTeams.map((team, index) => (
              <React.Fragment key={team.id}>
                {index > 0 && <Divider component="li" />}
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {canManageTournament && tournament.status !== 'completed' && (
                        <IconButton 
                          edge="end" 
                          aria-label="assign seed" 
                          onClick={() => handleSeedDialogOpen(team)}
                          size="small"
                        >
                          <NumbersIcon />
                        </IconButton>
                      )}
                      {(canManageTournament || 
                        (isAuthenticated && (team.player1Id === user?.id || team.player2Id === user?.id))
                      ) && tournament.status === 'open' && (
                        <IconButton 
                          edge="end" 
                          aria-label="delete" 
                          onClick={() => onUnregisterTeam(team.id)}
                          size="small"
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <GroupsIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {team.name}
                        {team.seed && (
                          <Chip 
                            label={`Semilla #${team.seed}`} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {team.player1?.name || 'Jugador 1'} y {team.player2?.name || 'Jugador 2'}
                        </Typography>
                        {team.description && (
                          <Typography variant="body2" sx={{ display: 'block' }}>
                            {team.description}
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}

        {/* Diálogo para inscribir equipo */}
        <Dialog open={registerDialogOpen} onClose={handleRegisterClose}>
          <DialogTitle>Inscribir mi equipo</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Selecciona uno de tus equipos para inscribirlo en este torneo:
            </Typography>
            {availableUserTeams.length === 0 ? (
              <Typography variant="body2" color="error">
                No tienes equipos disponibles para inscribir. Crea un equipo primero.
              </Typography>
            ) : (
              <List sx={{ pt: 0 }}>
                {availableUserTeams.map((team) => (
                  <ListItem onClick={() => {
                    onRegisterTeam(team.id);
                    handleRegisterClose();
                  }} key={team.id} sx={{ cursor: 'pointer' }}>
                    <ListItemAvatar>
                      <Avatar>
                        <GroupsIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={team.name} 
                      secondary={`${team.player1?.name || 'Jugador 1'} y ${team.player2?.name || 'Jugador 2'}`} 
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleRegisterClose}>Cancelar</Button>
          </DialogActions>
        </Dialog>

        {/* Diálogo para asignar semilla */}
        <Dialog open={seedDialogOpen} onClose={handleSeedDialogClose}>
          <DialogTitle>Asignar semilla</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Equipo: {selectedTeam?.name}
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              id="seed"
              label="Número de semilla"
              type="number"
              fullWidth
              variant="outlined"
              value={seedValue}
              onChange={(e) => setSeedValue(e.target.value)}
              inputProps={{ min: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSeedDialogClose}>Cancelar</Button>
            <Button onClick={handleSeedSubmit} variant="contained">Guardar</Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default RegisteredTeams;
