import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Tipo de modo del tema
export type ThemeMode = 'light' | 'dark';

// Interfaz del contexto
interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

// Valor por defecto del contexto
const defaultContext: ThemeContextType = {
  mode: 'light',
  toggleTheme: () => {},
  setMode: () => {},
};

// Creación del contexto
export const ThemeContext = createContext<ThemeContextType>(defaultContext);

// Hook para usar el contexto
export const useTheme = () => useContext(ThemeContext);

// Props del proveedor
interface ThemeProviderProps {
  children: ReactNode;
}

// Proveedor del contexto
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Obtenemos el tema guardado en localStorage o usamos 'light' como predeterminado
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode as ThemeMode) || 'light';
  });

  // Función para alternar entre temas
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Guardamos el modo en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    
    // También aplicamos una clase al body para estilos globales si es necesario
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(`${mode}-mode`);
  }, [mode]);

  // Valor del contexto
  const value = {
    mode,
    toggleTheme,
    setMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
