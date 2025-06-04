import { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Container,
  Alert,
  CircularProgress,
  Link as MuiLink,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stack
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';

const validationSchema = yup.object({
  name: yup
    .string()
    .required('El nombre es requerido'),
  username: yup
    .string()
    .required('El nombre de usuario es requerido'),
  email: yup
    .string()
    .email('Ingresa un correo electrónico válido')
    .required('El correo electrónico es requerido'),
  password: yup
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .required('La contraseña es requerida'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contraseñas deben coincidir')
    .required('La confirmación de contraseña es requerida'),
  phone: yup
    .string()
    .required('El teléfono es requerido'),
  playerLevel: yup
    .string()
    .required('El nivel de juego es requerido'),
  dominantHand: yup
    .string()
    .required('La mano dominante es requerida')
});

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      username: '', // Campo de nombre de usuario separado
      email: '',
      password: '',
      passwordConfirmation: '', // Cambiado a camelCase como espera la API
      phone: '',
      playerLevel: '',
      dominantHand: '',
      experienceYears: '',
      heightCm: '',
      weightKg: '',
      city: '',
      country: '',
      playingPosition: '',
      favoriteRacket: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      
      try {
        // Convertir campos numéricos de string a number
        const processedValues = {
          ...values,
          experienceYears: values.experienceYears ? parseInt(values.experienceYears) : undefined,
          heightCm: values.heightCm ? parseInt(values.heightCm) : undefined,
          weightKg: values.weightKg ? parseInt(values.weightKg) : undefined,
        };

        console.log('Enviando datos de registro:', processedValues);
        
        const success = await register(processedValues);

        if (success) {
          // Mostrar mensaje de éxito y esperar un poco antes de redirigir
          setSuccess(true);
          
          // Esperar 2 segundos antes de redirigir al login
          setTimeout(() => {
            navigate('/login', { state: { message: '¡Registro exitoso! Ahora puedes iniciar sesión.' } });
          }, 2000);
        } else {
          setError('Error al registrar el usuario. Por favor, verifica la información proporcionada.');
        }
      } catch (error: any) {
        console.error('Error completo:', error);
        setError(error.message || 'Error desconocido durante el registro');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Container component="main" maxWidth="md">
      <Paper 
        elevation={3}
        sx={{
          mt: 4,
          mb: 4,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2,
        }}
      >
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <SportsTennisIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
          <Typography component="h1" variant="h5">
            Registrarse
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            ¡Registro exitoso! Tu cuenta ha sido creada correctamente. Serás redirigido a la página de inicio de sesión en unos segundos...
          </Alert>
        )}
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <Stack spacing={2} direction="row" sx={{ flexWrap: 'wrap' }}>
              <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1, boxSizing: 'border-box' }}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="name"
                  name="name"
                  label="Nombre completo"
                  autoComplete="name"
                  autoFocus
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
            </Box>
            <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1, boxSizing: 'border-box' }}>
              <TextField
                margin="normal"
                fullWidth
                id="username"
                name="username"
                label="Nombre de usuario"
                autoComplete="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
              />
            </Box>
            <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1, boxSizing: 'border-box' }}>
              <TextField
                margin="normal"
                fullWidth
                id="email"
                name="email"
                label="Correo Electrónico"
                autoComplete="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Box>
            <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1, boxSizing: 'border-box' }}>
              <TextField
                margin="normal"
                fullWidth
                id="password"
                name="password"
                label="Contraseña"
                type="password"
                autoComplete="new-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
            </Box>
            <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1, boxSizing: 'border-box' }}>
              <TextField
                margin="normal"
                fullWidth
                id="passwordConfirmation"
                name="passwordConfirmation"
                label="Confirmar Contraseña"
                type="password"
                autoComplete="new-password"
                value={formik.values.passwordConfirmation}
                onChange={formik.handleChange}
                error={formik.touched.passwordConfirmation && Boolean(formik.errors.passwordConfirmation)}
                helperText={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
              />
            </Box>
            <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1, boxSizing: 'border-box' }}>
              <TextField
                margin="normal"
                fullWidth
                id="phone"
                name="phone"
                label="Teléfono"
                autoComplete="tel"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Box>
            <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1, boxSizing: 'border-box' }}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="player-level-label">Nivel de juego</InputLabel>
                <Select
                  labelId="player-level-label"
                  id="playerLevel"
                  name="playerLevel"
                  value={formik.values.playerLevel}
                  onChange={formik.handleChange}
                  error={formik.touched.playerLevel && Boolean(formik.errors.playerLevel)}
                  label="Nivel de juego"
                >
                  <MenuItem value="beginner">Principiante</MenuItem>
                  <MenuItem value="intermediate">Intermedio</MenuItem>
                  <MenuItem value="advanced">Avanzado</MenuItem>
                  <MenuItem value="pro">Profesional</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1, boxSizing: 'border-box' }}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="dominant-hand-label">Mano dominante</InputLabel>
                <Select
                  labelId="dominant-hand-label"
                  id="dominantHand"
                  name="dominantHand"
                  value={formik.values.dominantHand}
                  onChange={formik.handleChange}
                  error={formik.touched.dominantHand && Boolean(formik.errors.dominantHand)}
                  label="Mano dominante"
                >
                  <MenuItem value="right">Derecha</MenuItem>
                  <MenuItem value="left">Izquierda</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1, boxSizing: 'border-box' }}>
              <TextField
                margin="normal"
                fullWidth
                id="experienceYears"
                name="experienceYears"
                label="Años de experiencia"
                type="number"
                value={formik.values.experienceYears}
                onChange={formik.handleChange}
              />
            </Box>
            <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1, boxSizing: 'border-box' }}>
              <TextField
                margin="normal"
                fullWidth
                id="heightCm"
                name="heightCm"
                label="Altura (cm)"
                type="number"
                value={formik.values.heightCm}
                onChange={formik.handleChange}
              />
            </Box>
            <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1, boxSizing: 'border-box' }}>
              <TextField
                margin="normal"
                fullWidth
                id="weightKg"
                name="weightKg"
                label="Peso (kg)"
                type="number"
                value={formik.values.weightKg}
                onChange={formik.handleChange}
              />
            </Box>
            <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1, boxSizing: 'border-box' }}>
              <TextField
                margin="normal"
                fullWidth
                id="city"
                name="city"
                label="Ciudad"
                value={formik.values.city}
                onChange={formik.handleChange}
              />
            </Box>
            <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1, boxSizing: 'border-box' }}>
              <TextField
                margin="normal"
                fullWidth
                id="country"
                name="country"
                label="País"
                value={formik.values.country}
                onChange={formik.handleChange}
              />
            </Box>
            <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1, boxSizing: 'border-box' }}>
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
            </Box>
            <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1, boxSizing: 'border-box' }}>
              <TextField
                margin="normal"
                fullWidth
                id="favoriteRacket"
                name="favoriteRacket"
                label="Pala favorita"
                value={formik.values.favoriteRacket}
                onChange={formik.handleChange}
              />
            </Box>
          </Stack>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading || formik.isSubmitting}
          >
            {loading ? (
              <>
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                Creando cuenta...
              </>
            ) : (
              'Registrarse'
            )}
          </Button>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <MuiLink component={RouterLink} to="/login" variant="body2">
              ¿Ya tienes una cuenta? Inicia sesión
            </MuiLink>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
