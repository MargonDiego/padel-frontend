import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Button,
  Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DoneIcon from '@mui/icons-material/Done';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InfoIcon from '@mui/icons-material/Info';
import type { Tournament } from '../../types/models';
import { useAuth } from '../../contexts/AuthContext';

interface TournamentInfoProps {
  tournament: Tournament;
  onEdit: () => void;
  onOpenRegistration: () => void;
  onStartTournament: () => void;
  onCompleteTournament: () => void;
}

const TournamentInfo: React.FC<TournamentInfoProps> = ({
  tournament,
  onEdit,
  onOpenRegistration,
  onStartTournament,
  onCompleteTournament
}) => {
  const { user } = useAuth();
  
  // Determinar si el usuario puede gestionar este torneo (admin u organizador)
  const canManageTournament = user && (
    user.userRoleId === 1 || // Admin (ADMIN = 1)
    user.userRoleId === 3 || // Organizador (ORGANIZER = 3)
    (tournament.organizerId === user.id) // Creador del torneo
  );

  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Obtener el estado del torneo para mostrar
  const getTournamentStatusChip = () => {
    switch (tournament.status) {
      case 'draft':
        return <Chip label="Borrador" color="default" size="small" />;
      case 'open':
        return <Chip label="Inscripciones abiertas" color="info" size="small" />;
      case 'in_progress':
        return <Chip label="En progreso" color="primary" size="small" />;
      case 'completed':
        return <Chip label="Completado" color="success" size="small" />;
      default:
        return <Chip label={tournament.status} size="small" />;
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            {tournament.name}
          </Typography>
          {getTournamentStatusChip()}
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
          <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, p: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarTodayIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2">
                Inicio: {formatDate(tournament.startDate)}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, p: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarTodayIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2">
                Fin: {formatDate(tournament.endDate)}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, p: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2">
                Equipos máx: {tournament.maxTeams || 'Sin límite'}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, p: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <InfoIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2">
                Formato: {tournament.format === 'elimination' ? 'Eliminación directa' : 'Round Robin'}
              </Typography>
            </Box>
          </Box>
        </Stack>

        {tournament.location && (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <LocationOnIcon sx={{ mr: 1, mt: 0.3, color: 'primary.main' }} />
            <Typography variant="body2">
              Ubicación: {tournament.location}
            </Typography>
          </Box>
        )}

        {tournament.description && (
          <Typography variant="body2" paragraph>
            {tournament.description}
          </Typography>
        )}

        {canManageTournament && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditIcon />}
              onClick={onEdit}
            >
              Editar
            </Button>
            
            {tournament.status === 'draft' && (
              <Button
                variant="contained"
                size="small"
                color="primary"
                startIcon={<PlayArrowIcon />}
                onClick={onOpenRegistration}
              >
                Abrir inscripciones
              </Button>
            )}
            
            {tournament.status === 'open' && (
              <Button
                variant="contained"
                size="small"
                color="primary"
                startIcon={<PlayArrowIcon />}
                onClick={onStartTournament}
              >
                Iniciar torneo
              </Button>
            )}
            
            {tournament.status === 'in_progress' && (
              <Button
                variant="contained"
                size="small"
                color="success"
                startIcon={<DoneIcon />}
                onClick={onCompleteTournament}
              >
                Finalizar torneo
              </Button>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TournamentInfo;
