import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  Paper,
  Button
} from '@mui/material';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// PlaceIcon ya no es necesario porque eliminamos la referencia a location
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Match } from '../../types/models';

interface EnhancedMatchCardProps {
  match: Match;
  onViewDetails?: (match: Match) => void;
}

const EnhancedMatchCard: React.FC<EnhancedMatchCardProps> = ({ match, onViewDetails }) => {
  // Formatear fecha y hora del partido
  const formatMatchDateTime = (dateTimeString: string | undefined) => {
    if (!dateTimeString) return 'Fecha no disponible';
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
      case 'pending':
        return { 
          label: 'Pendiente', 
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
          label: status || 'Desconocido', 
          color: 'default' as const,
          icon: undefined 
        };
    }
  };

  const statusProps = getStatusChipProps(match.status);

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(match);
    }
  };

  return (
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
        {/* Encabezado con ID, torneo y estado */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {match.tournament && (
                <> - {match.tournament?.name || 'Torneo no especificado'}</>
              )}
            </Typography>
            {match.round !== undefined && (
              <Typography variant="subtitle2" color="text.secondary">
                Ronda: {match.round === 1 ? 'Final' : 
                       match.round === 2 ? 'Semifinal' : 
                       match.round === 4 ? 'Cuartos de final' : 
                       `Ronda ${match.round}`}
              </Typography>
            )}
          </Box>
          <Chip 
            label={statusProps.label}
            color={statusProps.color}
            size="small"
            icon={statusProps.icon}
          />
        </Box>
        
        {/* Información de fechas */}
        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Programado:</strong> {formatMatchDateTime(match.scheduledAt)}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 1 }} />
        
        {/* Equipos y resultado */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {/* Equipo 1 */}
            <Box sx={{ flex: 5 }}>
              <Paper 
                elevation={0}
                variant="outlined"
                sx={{ 
                  p: 1.5, 
                  textAlign: 'center',
                  borderColor: match.winnerId === match.team1?.id ? 'success.main' : 'divider',
                  bgcolor: match.winnerId === match.team1?.id ? 'success.light' : 'background.paper',
                  '& .MuiTypography-root': {
                    color: match.winnerId === match.team1?.id ? 'success.contrastText' : 'inherit'
                  }
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {match.team1?.player1?.name || ''} / {match.team1?.player2?.name || ''}
                </Typography>
              </Paper>
            </Box>
            
            {/* Resultado o VS */}
            <Box sx={{ flex: 2, display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                {match.status === 'completed' ? (
                  <Typography variant="h6" fontWeight="bold" color="text.primary">
                    {match.team1Score} - {match.team2Score}
                  </Typography>
                ) : (
                  <Typography variant="h6" fontWeight="bold" color="text.secondary">
                    VS
                  </Typography>
                )}
              </Box>
            </Box>
            
            {/* Equipo 2 */}
            <Box sx={{ flex: 5 }}>
              <Paper 
                elevation={0}
                variant="outlined"
                sx={{ 
                  p: 1.5, 
                  textAlign: 'center',
                  borderColor: match.winnerId === match.team2?.id ? 'success.main' : 'divider',
                  bgcolor: match.winnerId === match.team2?.id ? 'success.light' : 'background.paper',
                  '& .MuiTypography-root': {
                    color: match.winnerId === match.team2?.id ? 'success.contrastText' : 'inherit'
                  }
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {match.team2?.player1?.name || ''} / {match.team2?.player2?.name || ''}
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Box>
        
        {/* Sets (si el partido está completado) */}
        {match.status === 'completed' && match.setResults && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Resultados por set:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {(() => {
                try {
                  // Procesar los resultados de los sets que pueden venir como string JSON o como array
                  const sets = typeof match.setResults === 'string' 
                    ? JSON.parse(match.setResults) 
                    : match.setResults;
                  
                  return sets.map((set: {team1: number, team2: number}, index: number) => (
                    <Chip
                      key={index}
                      label={`${set.team1}-${set.team2}`}
                      size="small"
                      variant="outlined"
                    />
                  ));
                } catch (e) {
                  return <Typography color="error">Error al procesar los sets</Typography>;
                }
              })()} 
            </Box>
          </Box>
        )}
        
        {/* No hay notas en el modelo Match */}
        
        {/* Botón para ver detalles */}
        <Button 
          variant="outlined" 
          fullWidth
          sx={{ mt: 1 }}
          onClick={handleViewDetails}
        >
          Ver detalles
        </Button>
      </CardContent>
    </Card>
  );
};

export default EnhancedMatchCard;
