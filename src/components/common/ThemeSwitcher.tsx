import { useState, useEffect } from 'react';
import { IconButton, Tooltip, useMediaQuery } from '@mui/material';
// Cambiamos la forma de importar los iconos para compatibilidad
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { useTheme } from '../../contexts/ThemeContext';

// Componente para cambiar entre tema claro y oscuro
export default function ThemeSwitcher() {
  // Obtenemos el modo del tema y la función para cambiarlo desde nuestro contexto
  const { mode, toggleTheme, setMode } = useTheme();
  
  // Detectamos la preferencia del sistema (claro u oscuro)
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  // Estado para controlar la animación al cambiar el tema
  const [animate, setAnimate] = useState(false);

  // Sincronizar con la preferencia del sistema al montar el componente
  useEffect(() => {
    // Solo sincronizamos automáticamente si el usuario no ha elegido un tema manualmente
    const userTheme = localStorage.getItem('themeMode');
    if (!userTheme) {
      setMode(prefersDarkMode ? 'dark' : 'light');
    }
  }, [prefersDarkMode, setMode]);
  
  // Manejador para cambiar el tema
  const handleToggleTheme = () => {
    setAnimate(true);
    toggleTheme();
    setTimeout(() => setAnimate(false), 500);
  };

  return (
    <Tooltip title={mode === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}>
      <IconButton
        onClick={handleToggleTheme}
        color="inherit"
        className={animate ? 'theme-switch-animate' : ''}
        sx={{
          transition: 'transform 0.5s ease-in-out',
          animation: animate ? 'pulse 0.5s' : 'none',
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.2)' },
            '100%': { transform: 'scale(1)' },
          },
        }}
      >
        {mode === 'light' ? (
          <Brightness4Icon 
            sx={{ 
              color: '#5f6368',
              transition: 'color 0.3s ease',
              '&:hover': { color: '#202124' }
            }} 
          />
        ) : (
          <Brightness7Icon 
            sx={{ 
              color: '#e8eaed',
              transition: 'color 0.3s ease',
              '&:hover': { color: '#ffffff' }
            }} 
          />
        )}
      </IconButton>
    </Tooltip>
  );
}
