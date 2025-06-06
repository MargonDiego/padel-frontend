// RegisterForm.tsx
import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Stack,
  Typography,
  alpha,
  keyframes,
  Stepper,
  Step,
  StepLabel,
  Paper,
  StepConnector,
  stepConnectorClasses,
  StepButton,
  styled
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import SportsBaseballOutlinedIcon from '@mui/icons-material/SportsBaseballOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Animaciones
const shine = keyframes`
  from {
    background-position: 200% center;
  }
  to {
    background-position: -200% center;
  }
`;

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
`;

// Estilo personalizado para el conector entre pasos
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(95deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(95deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
    transition: 'all 0.5s ease-in-out',
  },
}));

// Estilo personalizado para los iconos de pasos
const ColorlibStepIconRoot = styled('div')<{ ownerState: { completed?: boolean; active?: boolean } }>(
  ({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,0.25)',
    transition: 'all 0.5s ease-in-out',
    ...(ownerState.active && {
      backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
      boxShadow: '0 6px 15px 0 rgba(0,0,0,0.3)',
      transform: 'scale(1.1)',
    }),
    ...(ownerState.completed && {
      backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    }),
  }),
);

function ColorlibStepIcon(props: {
  active: boolean;
  completed: boolean;
  icon: React.ReactNode;
}) {
  const { active, completed, icon } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <PersonOutlineIcon />,
    2: <LockOutlinedIcon />,
    3: <SportsBaseballOutlinedIcon />,
    4: <InfoOutlinedIcon />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }}>
      {icons[String(icon)]}
    </ColorlibStepIconRoot>
  );
}

// Esquema de validación
const validationSchema = yup.object({
  name: yup.string().required('El nombre es requerido'),
  username: yup.string().required('El nombre de usuario es requerido'),
  email: yup.string().email('Ingresa un correo electrónico válido').required('El correo electrónico es requerido'),
  password: yup.string().min(8, 'La contraseña debe tener al menos 8 caracteres').required('La contraseña es requerida'),
  passwordConfirmation: yup.string()
    .oneOf([yup.ref('password')], 'Las contraseñas deben coincidir')
    .required('La confirmación de contraseña es requerida'),
  phone: yup.string().required('El teléfono es requerido'),
  playerLevel: yup.string().required('El nivel de juego es requerido'),
  dominantHand: yup.string().required('La mano dominante es requerida')
});

interface RegisterFormProps {
  onRegisterSuccess: () => void;
}

// Definir los pasos del wizard
const steps = [
  'Información personal',
  'Seguridad',
  'Perfil de jugador',
  'Información adicional'
];

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{[k: number]: boolean}>({});
  
  // Formik setup con validación
  const formik = useFormik({
    initialValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
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
          // Notificar al componente padre que el registro fue exitoso
          onRegisterSuccess();
          
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
  
  // Gestión de pasos completados
  const isLastStep = () => activeStep === steps.length - 1;
  
  const handleNext = () => {
    // Validar el paso actual antes de continuar
    const isValid = validateStep(activeStep);
    if (isValid) {
      if (isLastStep()) {
        // En el último paso, enviar el formulario
        formik.handleSubmit();
      } else {
        const newActiveStep = activeStep + 1;
        setActiveStep(newActiveStep);
        setCompleted({ ...completed, [activeStep]: true });
      }
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleStepClick = (step: number) => {
    // Solo permitir saltar a pasos completados o al paso actual + 1
    const maxAllowedStep = Object.keys(completed).length;
    if (step <= maxAllowedStep) {
      setActiveStep(step);
    }
  };
  
  // Función para validar cada paso
  const validateStep = (stepIndex: number) => {
    let isValid = true;
    let fieldsToValidate: string[] = [];
    
    switch (stepIndex) {
      case 0: // Información personal
        fieldsToValidate = ['name', 'username', 'email', 'phone'];
        break;
      case 1: // Seguridad
        fieldsToValidate = ['password', 'passwordConfirmation'];
        break;
      case 2: // Perfil de jugador
        fieldsToValidate = ['playerLevel', 'dominantHand'];
        break;
      case 3: // Información adicional
        return true; // Campos opcionales
      default:
        return true;
    }
    
    // Tocar los campos para activar validación
    fieldsToValidate.forEach(field => {
      formik.setFieldTouched(field, true);
    });
    
    // Verificar si hay errores en los campos requeridos
    fieldsToValidate.forEach(field => {
      if (formik.errors[field as keyof typeof formik.errors]) {
        isValid = false;
      }
    });
    
    return isValid;
  };
  

  return (
    <Box 
      component="form" 
      onSubmit={(e) => { e.preventDefault(); formik.handleSubmit(); }}
      sx={{ 
        width: '100%',
        animation: `${fadeIn} 0.6s ease-out`,
      }}
    >
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            width: '100%', 
            mb: 2,
            animation: 'pulse 1.5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%': { boxShadow: '0 0 0 0 rgba(211, 47, 47, 0.4)' },
              '70%': { boxShadow: '0 0 0 10px rgba(211, 47, 47, 0)' },
              '100%': { boxShadow: '0 0 0 0 rgba(211, 47, 47, 0)' }
            }
          }}
        >
          {error}
        </Alert>
      )}
      
      {/* Stepper con los pasos del formulario */}
      <Stepper 
        alternativeLabel 
        activeStep={activeStep} 
        connector={<ColorlibConnector />}
        sx={{ mb: 4, pt: 2 }}
      >
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton onClick={() => handleStepClick(index)}>
              <StepLabel 
                StepIconComponent={(iconProps) => 
                  <ColorlibStepIcon 
                    active={iconProps.active || false}
                    completed={iconProps.completed || false}
                    icon={index + 1}
                  />
                }
              >
                {label}
              </StepLabel>
            </StepButton>
          </Step>
        ))}
      </Stepper>
      
      {/* Contenedor principal con altura mínima para evitar saltos */}
      <Box sx={{ 
        minHeight: 380, 
        position: 'relative',
        mb: 4
      }}>
        {/* Paso 1: Información personal */}
        <Box
          sx={{
            display: activeStep === 0 ? 'block' : 'none',
            animation: `${fadeIn} 0.5s ease-in-out`,
          }}
        >
          <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
            Datos personales
          </Typography>
          
          <Stack spacing={2} direction="row" sx={{ flexWrap: 'wrap' }}>
            <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1, boxSizing: 'border-box' }}>
              <TextField
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
          </Stack>

          <Stack spacing={2} direction="row" sx={{ flexWrap: 'wrap' }}>
            <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1, boxSizing: 'border-box' }}>
              <TextField
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
          </Stack>
        </Box>

        {/* Paso 2: Seguridad */}
        <Box
          sx={{
            display: activeStep === 1 ? 'block' : 'none',
            animation: `${fadeIn} 0.5s ease-in-out`,
          }}
        >
          <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
            Configuración de seguridad
          </Typography>
          
          <Stack spacing={2} direction="row" sx={{ flexWrap: 'wrap' }}>
            <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1, boxSizing: 'border-box' }}>
              <TextField
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
          </Stack>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, p: 1 }}>
            Tu contraseña debe tener al menos 8 caracteres e incluir letras y números para mayor seguridad.
          </Typography>
        </Box>

        {/* Paso 3: Perfil de jugador */}
        <Box
          sx={{
            display: activeStep === 2 ? 'block' : 'none',
            animation: `${fadeIn} 0.5s ease-in-out`,
          }}
        >
          <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
            Perfil de jugador
          </Typography>
          
          <Stack spacing={2} direction="row" sx={{ flexWrap: 'wrap' }}>
            <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1, boxSizing: 'border-box' }}>
              <FormControl fullWidth>
                <InputLabel id="player-level-label">Nivel de juego</InputLabel>
                <Select                  labelId="player-level-label"
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
                  <MenuItem value="professional">Profesional</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1, boxSizing: 'border-box' }}>
              <FormControl fullWidth>
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
                  <MenuItem value="ambidextrous">Ambidiestro</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Stack>
        </Box>

        {/* Paso 4: Información adicional */}
        <Box
          sx={{
            display: activeStep === 3 ? 'block' : 'none',
            animation: `${fadeIn} 0.5s ease-in-out`,
          }}
        >
          <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
            Información adicional
          </Typography>
          
          <Stack spacing={2} direction="row" sx={{ flexWrap: 'wrap' }}>
            <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1, boxSizing: 'border-box' }}>
              <TextField
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
                fullWidth
                id="heightCm"
                name="heightCm"
                label="Altura (cm)"
                type="number"
                value={formik.values.heightCm}
                onChange={formik.handleChange}
              />
            </Box>
          </Stack>
          
          <Stack spacing={2} direction="row" sx={{ flexWrap: 'wrap' }}>
            <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1, boxSizing: 'border-box' }}>
              <TextField
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
              <FormControl fullWidth>
                <InputLabel id="playing-position-label">Posición preferida</InputLabel>
                <Select
                  labelId="playing-position-label"
                  id="playingPosition"
                  name="playingPosition"
                  value={formik.values.playingPosition}
                  onChange={formik.handleChange}
                  label="Posición preferida"
                >
                  <MenuItem value="drive">Drive</MenuItem>
                  <MenuItem value="revés">Revés</MenuItem>
                  <MenuItem value="versatil">Versátil</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Stack>
          
          <Stack spacing={2} direction="row" sx={{ flexWrap: 'wrap', mt: 2 }}>
            <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1, boxSizing: 'border-box' }}>
              <TextField
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
                fullWidth
                id="country"
                name="country"
                label="País"
                value={formik.values.country}
                onChange={formik.handleChange}
              />
            </Box>
          </Stack>
          
          <Box sx={{ p: 1, boxSizing: 'border-box', mt: 2 }}>
            <TextField
              fullWidth
              id="favoriteRacket"
              name="favoriteRacket"
              label="Pala favorita"
              value={formik.values.favoriteRacket}
              onChange={formik.handleChange}
            />
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, p: 1 }}>
            Esta información es opcional y puedes modificarla más tarde desde tu perfil.
          </Typography>
        </Box>
      </Box>
      
      {/* Botones de navegación */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        mt: 4
      }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIosNewIcon />}
          onClick={handleBack}
          disabled={activeStep === 0 || loading}
          sx={{ 
            visibility: activeStep === 0 ? 'hidden' : 'visible',
            transition: 'all 0.3s ease-in-out',
          }}
        >
          Anterior
        </Button>

        <Button
          variant={isLastStep() ? "contained" : "outlined"}
          endIcon={isLastStep() ? <CheckCircleOutlineIcon /> : <ArrowForwardIosIcon />}
          onClick={handleNext}
          disabled={loading}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            minWidth: '120px',
            background: isLastStep() ? 
              `linear-gradient(45deg, ${alpha('#3f51b5', 0.8)} 0%, ${alpha('#f50057', 0.8)} 100%)` : 
              'transparent',
            '&:hover': {
              background: isLastStep() ? 
                `linear-gradient(45deg, ${alpha('#3f51b5', 1)} 0%, ${alpha('#f50057', 1)} 100%)` : 
                'rgba(63, 81, 181, 0.04)',
            },
            ...(loading && isLastStep() && {
              background: `linear-gradient(45deg, ${alpha('#3f51b5', 0.6)} 0%, ${alpha('#f50057', 0.6)} 100%)`,
            }),
            transition: 'all 0.3s ease-in-out',
          }}
        >
          {loading && isLastStep() ? (
            <CircularProgress 
              size={24} 
              thickness={5}
              sx={{ 
                position: 'absolute',
                color: '#fff',
                animation: `${shine} 3s ease-in-out infinite`,
              }}
            />
          ) : isLastStep() ? 'Registrarme' : 'Siguiente'}
        </Button>
      </Box>
    </Box>
  );
};

export default RegisterForm;