import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Box, 
  Chip,
  useTheme
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DateRangeIcon from '@mui/icons-material/DateRange';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import type { Tournament } from '../../types/models';

interface TournamentCardProps {
  tournament: Tournament;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament }) => {
  const theme = useTheme();
  
  // Formatear fechas
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };
  
  // Determinar color basado en el formato del torneo
  const formatColor = tournament.format === 'elimination' ? theme.palette.error.main : theme.palette.info.main;
  
  // Determinar texto del formato
  const formatText = tournament.format === 'elimination' ? 'Eliminación' : 'Round Robin';
  
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 2,
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        },
        overflow: 'visible',
        position: 'relative'
      }}
    >
      {/* Badge de formato */}
      <Chip
        label={formatText}
        size="small"
        icon={<FormatListNumberedIcon fontSize="small" />}
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 2,
          bgcolor: formatColor,
          color: '#fff',
          fontWeight: 'bold',
          '& .MuiChip-icon': {
            color: '#fff'
          }
        }}
      />
      
      <CardMedia
        component="div"
        sx={{
          height: 140,
          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <EmojiEventsIcon 
          sx={{ 
            position: 'absolute',
            fontSize: 100,
            opacity: 0.2,
            transform: 'rotate(-15deg)',
            right: -20,
            bottom: -20
          }} 
        />
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            px: 2,
            textAlign: 'center',
            zIndex: 1
          }}
        >
          {tournament.name}
        </Typography>
      </CardMedia>
      
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 1.5,
          color: theme.palette.text.secondary
        }}>
          <DateRangeIcon sx={{ fontSize: 18, mr: 1 }} />
          <Typography variant="body2">
            {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
          </Typography>
        </Box>
        
        <Typography 
          variant="body2" 
          paragraph
          sx={{ 
            mb: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            height: '40px'
          }}
        >
          {tournament.description || 'Sin descripción'}
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          mb: 2,
          color: theme.palette.text.secondary
        }}>
          <LocationOnIcon sx={{ fontSize: 18, mr: 1 }} />
          <Typography 
            variant="body2"
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {tournament.location || 'Por definir'}
          </Typography>
        </Box>
        
        <Box sx={{ mt: 'auto' }}>
          <Button
            component={RouterLink}
            to={`/tournaments/${tournament.id}`}
            variant="outlined"
            size="small"
            fullWidth
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': {
                bgcolor: theme.palette.action.hover
              }
            }}
          >
            Ver Detalles
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TournamentCard;
