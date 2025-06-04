import { createTheme } from '@mui/material/styles';

// Definimos nuestras paletas de colores para modo claro y oscuro
const lightPalette = {
  mode: 'light',
  primary: {
    main: '#3DA5D9',
    light: '#64B5E3',
    dark: '#2980B9',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#FF9800',
    light: '#FFB74D',
    dark: '#F57C00',
    contrastText: '#000000',
  },
  background: {
    default: '#F8F9FA',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#263238',
    secondary: '#546E7A',
  },
};

const darkPalette = {
  mode: 'dark',
  primary: {
    main: '#2196F3',
    light: '#64B5F6',
    dark: '#1976D2',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#FF9800',
    light: '#FFB74D',
    dark: '#F57C00',
    contrastText: '#000000',
  },
  background: {
    default: '#121212',
    paper: '#1E1E1E',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#B0BEC5',
  },
};

// Componentes personalizados para el tema (con type assertion para evitar errores de tipado)
const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        padding: '10px 24px',
        fontWeight: 600,
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        overflow: 'hidden',
      },
    },
  },
} as const;

// Tipografía personalizada (con type assertion para evitar errores de tipado)
const typography = {
  fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    fontWeight: 700,
  },
  h2: {
    fontWeight: 600,
  },
  h3: {
    fontWeight: 600,
  },
} as const;

// Función para crear un tema basado en el modo (claro u oscuro)
export const createAppTheme = (mode: 'light' | 'dark') => {
  const palette = mode === 'light' ? lightPalette : darkPalette;
  
  return createTheme({
    palette: palette as any,
    typography,
    components,
    shape: {
      borderRadius: 8,
    },
  });
};

// Tema predeterminado (claro)
const defaultTheme = createAppTheme('light');

export default defaultTheme;
