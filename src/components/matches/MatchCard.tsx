import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Grid,
  Avatar,
  Divider,
  Button
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import EventIcon from '@mui/icons-material/Event';
import PlaceIcon from '@mui/icons-material/Place';
import { Link } from 'react-router-dom';
import type { Match } from '../../types/models';

interface MatchCardProps {
  match: Match;
  onViewDetails: (match: Match) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onViewDetails }) => {
  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Sin fecha programada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtener el estado del partido como texto
  const getMatchStatusChip = (match: Match) => {
    if (match.status === 'completed' || match.winnerId) {
      return (
        <Chip 
          label="Completado" 
          color="success" 
          size="small" 
          icon={<SportsTennisIcon />} 
        />
      );
    } else if (match.status === 'pending') {
      return <Chip label="Pendiente" color="default" size="small" icon={<EventIcon />} />;
    } else if (match.status === 'in_progress') {
      return <Chip label="En progreso" color="primary" size="small" />;
    } else {
      return <Chip label={match.status || 'Desconocido'} size="small" />;
    }
  };

  // Función para renderizar el resultado
  const renderScore = () => {
    if (match.status === 'completed' || match.winnerId) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            {match.team1Score} - {match.team2Score}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {typeof match.setResults === 'string' ? 
              JSON.parse(match.setResults)
                .map((set: {team1: number, team2: number}, idx: number) => 
                  `${set.team1}-${set.team2}${idx < JSON.parse(match.setResults as string).length - 1 ? ', ' : ''}`)
                .join('') 
              : ''}
          </Typography>
        </Box>
      );
    } else {
      return (
        <Typography variant="body2" align="center" color="text.secondary">
          VS
        </Typography>
      );
    }
  };

  return (
    <Card sx={{ mb: 2, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 } }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          {match.tournament ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Link to={`/tournaments/${match.tournament.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Typography variant="body2" color="primary">
                  {match.tournament.name}
                </Typography>
              </Link>
              {match.round && (
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({match.round === 1 ? 'Final' : 
                    match.round === 2 ? 'Semifinal' : 
                    match.round === 4 ? 'Cuartos de final' : 
                    `Ronda ${match.round}`})
                </Typography>
              )}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Partido amistoso
            </Typography>
          )}
          <Box>
            {getMatchStatusChip(match)}
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
          <Box sx={{ width: '40%' }}>
            <Typography variant="subtitle1" fontWeight="bold" align="center">
              {match.team1?.name || 'Equipo 1'}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1 }}>
              {match.team1?.player1 && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.75rem' }}>
                    {match.team1.player1.name.charAt(0)}
                  </Avatar>
                  <Typography variant="body2">
                    {match.team1.player1.name}
                  </Typography>
                </Box>
              )}
              {match.team1?.player2 && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.75rem' }}>
                    {match.team1.player2.name.charAt(0)}
                  </Avatar>
                  <Typography variant="body2">
                    {match.team1.player2.name}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
          
          <Box sx={{ width: '20%' }}>
            {renderScore()}
          </Box>
          
          <Box sx={{ width: '40%' }}>
            <Typography variant="subtitle1" fontWeight="bold" align="center">
              {match.team2?.name || 'Equipo 2'}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1 }}>
              {match.team2?.player1 && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.75rem' }}>
                    {match.team2.player1.name.charAt(0)}
                  </Avatar>
                  <Typography variant="body2">
                    {match.team2.player1.name}
                  </Typography>
                </Box>
              )}
              {match.team2?.player2 && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.75rem' }}>
                    {match.team2.player2.name.charAt(0)}
                  </Avatar>
                  <Typography variant="body2">
                    {match.team2.player2.name}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
        
        <Divider sx={{ my: 1 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EventIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {formatDate(match.scheduledAt || '')}
            </Typography>
          </Box>
          
          <Button 
            variant="outlined" 
            size="small" 
            onClick={() => onViewDetails(match)}
            startIcon={<InfoIcon />}
          >
            Detalles
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MatchCard;
