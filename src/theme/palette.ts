// Definición de la paleta de colores para la aplicación de pádel
// Colores inspirados en canchas de pádel profesionales y equipamiento deportivo

// Paleta de colores principal
export const lightPalette = {
  // Verde pádel profesional como color principal
  primary: {
    main: '#3DA5D9', // Azul vibrante (color distintivo)
    light: '#64B5E3',
    dark: '#2980B9',
    contrastText: '#FFFFFF',
  },
  // Color de acento inspirado en pelotas de pádel
  secondary: {
    main: '#FF9800', // Naranja energético
    light: '#FFB74D',
    dark: '#F57C00',
    contrastText: '#000000',
  },
  // Color de acento terciario (para destacar elementos)
  tertiary: {
    main: '#8BC34A', // Verde lima (representa el césped de las pistas)
    light: '#AED581',
    dark: '#689F38',
    contrastText: '#000000',
  },
  // Fondo y papel
  background: {
    default: '#F8F9FA', // Gris muy claro
    paper: '#FFFFFF',
    alternate: '#F0F4F8', // Para alternar filas en tablas
  },
  // Colores semánticos
  error: {
    main: '#E53935',
    light: '#EF5350',
    dark: '#C62828',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#FFC107',
    light: '#FFD54F',
    dark: '#FFA000',
    contrastText: '#000000',
  },
  info: {
    main: '#29B6F6',
    light: '#4FC3F7',
    dark: '#0288D1',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#66BB6A',
    light: '#81C784',
    dark: '#388E3C',
    contrastText: '#FFFFFF',
  },
  // Textos
  text: {
    primary: '#263238', // Casi negro
    secondary: '#546E7A', // Gris oscuro
    disabled: '#90A4AE', // Gris medio
  },
  // Divisores y bordes
  divider: 'rgba(0, 0, 0, 0.12)',
};

// Paleta oscura para modo nocturno
export const darkPalette = {
  primary: {
    main: '#2196F3', // Azul más brillante para destacar en fondo oscuro
    light: '#64B5F6',
    dark: '#1976D2',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#FF9800', // Mantenemos el naranja para consistencia
    light: '#FFB74D',
    dark: '#F57C00',
    contrastText: '#000000',
  },
  tertiary: {
    main: '#8BC34A', // Verde lima (representa el césped de las pistas)
    light: '#AED581',
    dark: '#689F38',
    contrastText: '#000000',
  },
  background: {
    default: '#121212', // Fondo casi negro estándar de Material Design
    paper: '#1E1E1E', // Un poco más claro que el fondo
    alternate: '#282828', // Para alternar filas en tablas
  },
  error: {
    main: '#F44336',
    light: '#E57373',
    dark: '#D32F2F',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#FFC107',
    light: '#FFD54F',
    dark: '#FFA000',
    contrastText: '#000000',
  },
  info: {
    main: '#29B6F6',
    light: '#4FC3F7',
    dark: '#0288D1',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#66BB6A',
    light: '#81C784',
    dark: '#388E3C',
    contrastText: '#FFFFFF',
  },
  text: {
    primary: '#FFFFFF', // Blanco para contraste
    secondary: '#B0BEC5', // Gris claro
    disabled: '#78909C', // Gris medio
  },
  divider: 'rgba(255, 255, 255, 0.12)',
};
