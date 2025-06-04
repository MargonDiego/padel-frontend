import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography,
  CircularProgress 
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import type { User } from '../../types/models';

interface ProfileFormProps {
  user: User;
  onUpdateUser: (userData: any) => Promise<boolean>;
  onSuccess: () => void;
}

// Esquema de validación del formulario
const validationSchema = yup.object({
  name: yup.string().required('El nombre es requerido'),
  email: yup.string().email('Email inválido').required('El email es requerido'),
  playerLevel: yup.string().required('El nivel de juego es requerido'),
  dominantHand: yup.string().required('La mano dominante es requerida'),
});

const ProfileForm: React.FC<ProfileFormProps> = ({ user, onUpdateUser, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: user.name || '',
      email: user.email || '',
      playerLevel: user.playerLevel || '',
      dominantHand: user.dominantHand || '',
      experienceYears: user.experienceYears || '',
      heightCm: user.heightCm || '',
      weightKg: user.weightKg || '',
      city: user.city || '',
      country: user.country || '',
      playingPosition: user.playingPosition || '',
      favoriteRacket: user.favoriteRacket || '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Enviar tanto los nombres en formato snake_case como camelCase para compatibilidad
      const apiPayload = {
        name: values.name,
        
        // Campos en formato snake_case (como espera la API según documentación)
        level: values.playerLevel,                
        playing_hand: values.dominantHand,        
        playing_position: values.playingPosition, 
        favorite_racket: values.favoriteRacket,   
        experience_years: values.experienceYears !== '' ? Number(values.experienceYears) : null,
        height_cm: values.heightCm !== '' ? Number(values.heightCm) : null,
        weight_kg: values.weightKg !== '' ? Number(values.weightKg) : null,
        
        // También incluir campos en formato camelCase (como está haciendo Postman)
        playerLevel: values.playerLevel,
        dominantHand: values.dominantHand,
        playingPosition: values.playingPosition,
        favoriteRacket: values.favoriteRacket,
        experienceYears: values.experienceYears !== '' ? Number(values.experienceYears) : null,
        heightCm: values.heightCm !== '' ? Number(values.heightCm) : null,
        weightKg: values.weightKg !== '' ? Number(values.weightKg) : null,
        
        // Campos con nombres consistentes
        city: values.city || null,
        country: values.country || null
      };
      
      console.log('Enviando datos a la API:', apiPayload);
      setLoading(true);
      try {
        const success = await onUpdateUser(apiPayload);
        if (success) {
          setEditMode(false); // Volver al modo de visualización después de guardar
          onSuccess();
        }
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant={editMode ? "outlined" : "contained"} 
          color={editMode ? "secondary" : "primary"}
          onClick={() => setEditMode(!editMode)}
          sx={{ mb: 2 }}
        >
          {editMode ? "Cancelar" : "Editar Información"}
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1 }}>
          {editMode ? (
            <TextField
              fullWidth
              margin="normal"
              id="name"
              name="name"
              label="Nombre"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          ) : (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Nombre
              </Typography>
              <Typography variant="body1">
                {formik.values.name}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1 }}>
          {editMode ? (
            <TextField
              fullWidth
              margin="normal"
              id="email"
              name="email"
              label="Correo electrónico"
              value={formik.values.email}
              onChange={formik.handleChange}
              disabled={true}
            />
          ) : (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Correo electrónico
              </Typography>
              <Typography variant="body1">
                {formik.values.email}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1 }}>
          {editMode ? (
            <FormControl fullWidth margin="normal">
              <InputLabel id="player-level-label">Nivel de juego</InputLabel>
              <Select
                labelId="player-level-label"
                id="playerLevel"
                name="playerLevel"
                value={formik.values.playerLevel}
                onChange={formik.handleChange}
                label="Nivel de juego"
              >
                <MenuItem value="beginner">Principiante</MenuItem>
                <MenuItem value="intermediate">Intermedio</MenuItem>
                <MenuItem value="advanced">Avanzado</MenuItem>
                <MenuItem value="professional">Profesional</MenuItem>
              </Select>
            </FormControl>
          ) : (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Nivel de juego
              </Typography>
              <Typography variant="body1">
                {{
                  'beginner': 'Principiante',
                  'intermediate': 'Intermedio',
                  'advanced': 'Avanzado',
                  'professional': 'Profesional'
                }[formik.values.playerLevel] || formik.values.playerLevel || '-'}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1 }}>
          {editMode ? (
            <FormControl fullWidth margin="normal">
              <InputLabel id="dominant-hand-label">Mano dominante</InputLabel>
              <Select
                labelId="dominant-hand-label"
                id="dominantHand"
                name="dominantHand"
                value={formik.values.dominantHand}
                onChange={formik.handleChange}
                label="Mano dominante"
              >
                <MenuItem value="right">Derecha</MenuItem>
                <MenuItem value="left">Izquierda</MenuItem>
              </Select>
            </FormControl>
          ) : (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Mano dominante
              </Typography>
              <Typography variant="body1">
                {{
                  'right': 'Derecha',
                  'left': 'Izquierda'
                }[formik.values.dominantHand] || formik.values.dominantHand || '-'}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1 }}>
          {editMode ? (
            <TextField
              fullWidth
              margin="normal"
              id="experienceYears"
              name="experienceYears"
              label="Años de experiencia"
              type="number"
              value={formik.values.experienceYears}
              onChange={formik.handleChange}
            />
          ) : (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Años de experiencia
              </Typography>
              <Typography variant="body1">
                {formik.values.experienceYears || '-'}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1 }}>
          {editMode ? (
            <TextField
              fullWidth
              margin="normal"
              id="heightCm"
              name="heightCm"
              label="Altura (cm)"
              type="number"
              value={formik.values.heightCm}
              onChange={formik.handleChange}
            />
          ) : (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Altura
              </Typography>
              <Typography variant="body1">
                {formik.values.heightCm ? `${formik.values.heightCm} cm` : '-'}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1 }}>
          {editMode ? (
            <TextField
              fullWidth
              margin="normal"
              id="weightKg"
              name="weightKg"
              label="Peso (kg)"
              type="number"
              value={formik.values.weightKg}
              onChange={formik.handleChange}
            />
          ) : (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Peso
              </Typography>
              <Typography variant="body1">
                {formik.values.weightKg ? `${formik.values.weightKg} kg` : '-'}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1 }}>
          {editMode ? (
            <TextField
              fullWidth
              margin="normal"
              id="city"
              name="city"
              label="Ciudad"
              value={formik.values.city}
              onChange={formik.handleChange}
            />
          ) : (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Ciudad
              </Typography>
              <Typography variant="body1">
                {formik.values.city || '-'}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1 }}>
          {editMode ? (
            <TextField
              fullWidth
              margin="normal"
              id="country"
              name="country"
              label="País"
              value={formik.values.country}
              onChange={formik.handleChange}
            />
          ) : (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                País
              </Typography>
              <Typography variant="body1">
                {formik.values.country || '-'}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1 }}>
          {editMode ? (
            <FormControl fullWidth margin="normal">
              <InputLabel id="playing-position-label">Posición preferida</InputLabel>
              <Select
                labelId="playing-position-label"
                id="playingPosition"
                name="playingPosition"
                value={formik.values.playingPosition}
                onChange={formik.handleChange}
                label="Posición preferida"
              >
                <MenuItem value="drive">Drive (derecha)</MenuItem>
                <MenuItem value="reves">Revés (izquierda)</MenuItem>
                <MenuItem value="ambos">Ambos</MenuItem>
              </Select>
            </FormControl>
          ) : (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Posición preferida
              </Typography>
              <Typography variant="body1">
                {{
                  'drive': 'Drive (derecha)',
                  'reves': 'Revés (izquierda)',
                  'ambos': 'Ambos'
                }[formik.values.playingPosition] || formik.values.playingPosition || '-'}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1 }}>
          {editMode ? (
            <TextField
              fullWidth
              margin="normal"
              id="favoriteRacket"
              name="favoriteRacket"
              label="Pala favorita"
              value={formik.values.favoriteRacket}
              onChange={formik.handleChange}
            />
          ) : (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Pala favorita
              </Typography>
              <Typography variant="body1">
                {formik.values.favoriteRacket || '-'}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      
      {editMode && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Guardar Cambios'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ProfileForm;
