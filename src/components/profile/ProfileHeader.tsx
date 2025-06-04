import React from 'react';
import { Avatar, Box, Typography, Chip, Divider } from '@mui/material';
import { 
  LocationOn as LocationIcon,
  EmojiEvents as TrophyIcon,
  FitnessCenter as FitnessIcon,
  Sports as SportsIcon,
  Height as HeightIcon,
  SportsTennis as RacketIcon
} from '@mui/icons-material';
import type { User } from '../../types/models';

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  // Obtener valores traducidos para mejor visualización
  const getPlayerLevel = (level?: string) => {
    if (!level) return 'No definido';
    switch(level) {
      case 'beginner': return 'Principiante';
      case 'intermediate': return 'Intermedio';
      case 'advanced': return 'Avanzado';
      case 'professional': return 'Profesional';
      default: return level;
    }
  };

  const getDominantHand = (hand?: string) => {
    if (!hand) return 'No definido';
    switch(hand) {
      case 'right': return 'Diestro';
      case 'left': return 'Zurdo';
      default: return hand;
    }
  };

  const getPlayingPosition = (position?: string) => {
    if (!position) return 'No definido';
    switch(position) {
      case 'drive': return 'Drive';
      case 'reves': return 'Revés';
      case 'ambos': return 'Ambos lados';
      default: return position;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
      {/* Imagen de perfil y nombre */}
      <Avatar 
        src={user.photo ? `/uploads/user-photo/${user.photo}` : undefined} 
        sx={{ width: 100, height: 100, mb: 2, border: '3px solid', borderColor: 'primary.main' }}
      >
        {user.name.substring(0, 1).toUpperCase()}
      </Avatar>
      <Typography variant="h5" gutterBottom>
        {user.name}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {user.email}
      </Typography>

      {/* Etiquetas principales */}
      <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mb: 2 }}>
        <Chip 
          label={getPlayerLevel(user.playerLevel)} 
          color="primary" 
          size="small" 
        />
        <Chip 
          label={getDominantHand(user.dominantHand)} 
          color="secondary" 
          size="small" 
        />
        {user.userRole && (
          <Chip 
            label={user.userRole.name || 'Usuario'} 
            color="info" 
            size="small" 
            variant="outlined"
          />
        )}
      </Box>

      <Divider sx={{ width: '100%', my: 2 }} />

      {/* Información adicional */}
      <Box sx={{ width: '100%' }}>
        {/* Ubicación */}
        {(user.city || user.country) && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <LocationIcon color="action" fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">
              {[user.city, user.country].filter(Boolean).join(', ')}
            </Typography>
          </Box>
        )}

        {/* Posición de juego */}
        {user.playingPosition && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <SportsIcon color="action" fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">
              <b>Posición:</b> {getPlayingPosition(user.playingPosition)}
            </Typography>
          </Box>
        )}

        {/* Años de experiencia */}
        {user.experienceYears !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <TrophyIcon color="action" fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">
              <b>Experiencia:</b> {user.experienceYears} {user.experienceYears === 1 ? 'año' : 'años'}
            </Typography>
          </Box>
        )}

        {/* Datos físicos - Altura y peso */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 1.5 }}>
          {user.heightCm !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HeightIcon color="action" fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">
                <b>Altura:</b> {user.heightCm} cm
              </Typography>
            </Box>
          )}

          {user.weightKg !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FitnessIcon color="action" fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">
                <b>Peso:</b> {user.weightKg} kg
              </Typography>
            </Box>
          )}
        </Box>

        {/* Raqueta favorita */}
        {user.favoriteRacket && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <RacketIcon color="action" fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2" noWrap sx={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <b>Raqueta:</b> {user.favoriteRacket}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProfileHeader;
