import React from 'react';
import { Alert, Collapse, alpha, useTheme } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface LoginErrorAlertProps {
  error: string | null;
}

const LoginErrorAlert: React.FC<LoginErrorAlertProps> = ({ error }) => {
  const theme = useTheme();
  
  // Referencia para seguimiento de montaje/desmontaje
  const mountRef = React.useRef(false);
  
  // Efecto para controlar el montaje
  React.useEffect(() => {
    mountRef.current = true;
    return () => {
      mountRef.current = false;
    };
  }, []);

  return (
    <Collapse 
      in={!!error} 
      timeout={400}
      mountOnEnter
      unmountOnExit
      sx={{ 
        mb: error ? 2 : 0,
        willChange: 'height, opacity',
        transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <Alert 
        severity="error" 
        icon={
          <ErrorOutlineIcon 
            fontSize="inherit" 
            sx={{ 
              animation: 'pulse-icon 2s infinite',
              '@keyframes pulse-icon': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.2)' },
                '100%': { transform: 'scale(1)' }
              }
            }}
          />
        }
        sx={{ 
          width: '100%', 
          borderRadius: 2,
          boxShadow: `0 2px 8px ${alpha(theme.palette.error.main, 0.25)}`,
          '& .MuiAlert-icon': {
            opacity: 1,
            color: theme.palette.error.main
          },
          animation: 'pulse-error 2s infinite',
          '@keyframes pulse-error': {
            '0%': {
              boxShadow: `0 2px 8px ${alpha(theme.palette.error.main, 0.25)}`
            },
            '50%': {
              boxShadow: `0 2px 12px ${alpha(theme.palette.error.main, 0.4)}`
            },
            '100%': {
              boxShadow: `0 2px 8px ${alpha(theme.palette.error.main, 0.25)}`
            }
          }
        }}
      >
        {error}
      </Alert>
    </Collapse>
  );
};

export default LoginErrorAlert;
