import React, { useCallback, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, TextField, Button, CircularProgress, alpha, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoginErrorAlert from './LoginErrorAlert';

// Esquema de validación para el formulario
const validationSchema = Yup.object({
  username: Yup.string().required('Usuario requerido'),
  password: Yup.string().required('Contraseña requerida'),
});

// Interfaz para los valores del formulario
interface LoginFormValues {
  username: string;
  password: string;
}

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();

  // Estados locales
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Función para manejar el envío del formulario
  const handleLoginSubmit = useCallback(async (values: LoginFormValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    // Evitar múltiples envíos
    if (loading) {
      setSubmitting(false);
      return;
    }
    
    try {
      // Actualizar estados juntos para reducir renders
      setLoading(true);
      setError(null);
      
      console.log('Intentando login con:', values.username);
      const success = await login(values.username, values.password);
      
      if (success) {
        console.log('Login exitoso, notificando al componente padre');
        // Notificar al componente padre que manejará la redirección
        onLoginSuccess();
        // No desactivamos el estado de carga para mantener el spinner
      } else {
        console.log('Login fallido, mostrando error');
        // Usar setTimeout para agrupar actualizaciones de estado
        setTimeout(() => {
          setError('Credenciales inválidas. Por favor, verifica tu nombre de usuario y contraseña.');
          setLoading(false);
          setSubmitting(false);
        }, 100); // Pequeño delay para evitar parpadeo
      }
    } catch (err) {
      console.error('Error en login:', err);
      setTimeout(() => {
        setError('Error al iniciar sesión. Por favor, intenta nuevamente.');
        setLoading(false);
        setSubmitting(false);
      }, 100); // Pequeño delay para evitar parpadeo
    }
  }, [loading, login, navigate, onLoginSuccess]);

  // Configuración de Formik
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: false,
    enableReinitialize: false,
    onSubmit: handleLoginSubmit
  });

  return (
    <>
      <LoginErrorAlert error={error} />
      
      <Box 
        component="div" 
        sx={{ 
          width: '100%',
          '& .MuiTextField-root': {
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)'
            }
          }
        }}
      >
        <Box sx={{ position: 'relative', mb: 3 }}>
          <TextField
            fullWidth
            id="username"
            name="username"
            label="Usuario"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            variant="outlined"
            margin="normal"
            autoComplete="username"
            autoFocus
            sx={{ mb: 2 }}
            disabled={loading}
          />
          
          <TextField
            fullWidth
            id="password"
            name="password"
            label="Contraseña"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            variant="outlined"
            margin="normal"
            autoComplete="current-password"
            sx={{ mb: 1 }}
            disabled={loading}
          />
          
          <Button
            fullWidth
            variant="contained"
            size="large"
            disabled={loading || formik.isSubmitting}
            onClick={(e) => {
              e.preventDefault();
              console.log('Botón de login clickeado');
              formik.handleSubmit();
            }}
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              position: 'relative',
              borderRadius: '8px',
              fontWeight: 600,
              overflow: 'hidden',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.common.white, 0.2)}, transparent)`,
                transition: 'left 0.5s ease-in-out'
              },
              '&:hover::after': {
                left: '100%'
              },
              '@keyframes shine': {
                '0%': {
                  left: '-100%'
                },
                '100%': {
                  left: '100%'
                }
              }
            }}
          >
            {loading ? (
              <CircularProgress 
                size={24} 
                sx={{ color: theme.palette.common.white }}
              />
            ) : 'INICIAR SESIÓN'}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default LoginForm;
