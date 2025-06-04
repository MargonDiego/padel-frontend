import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Páginas
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import TeamsPage from './pages/TeamsPage';
import TeamDetailPage from './pages/TeamDetailPage';
import MyTeamsPage from './pages/MyTeamsPage';
import TournamentsPage from './pages/TournamentsPage';
import TournamentDetailPage from './pages/TournamentDetailPage';
import RankingsPage from './pages/RankingsPage';
import MatchesPage from './pages/MatchesPage';
import AllMatchesPage from './pages/AllMatchesPage';

// Contextos y Tema
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { createAppTheme } from './theme/theme';

// Componente contenedor para aplicar el tema de MUI basado en el ThemeContext
function AppWithTheme() {
  // Usamos nuestro hook personalizado para obtener el modo actual del tema
  const { mode } = useTheme();
  
  // Creamos el tema de MUI basado en el modo actual (claro u oscuro)
  const muiTheme = createAppTheme(mode as 'light' | 'dark');

  return (
    <MUIThemeProvider theme={muiTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Rutas de equipos */}
              <Route path="/teams" element={<TeamsPage />} />
              <Route path="/teams/:id" element={<TeamDetailPage />} />
              <Route path="/my-teams" element={<MyTeamsPage />} />
              
              {/* Rutas de torneos */}
              <Route path="/tournaments" element={<TournamentsPage />} />
              <Route path="/tournaments/:id" element={<TournamentDetailPage />} />
              
              {/* Ruta de rankings */}
              <Route path="/rankings" element={<RankingsPage />} />
              
              {/* Rutas de partidos */}
              <Route path="/matches" element={<MatchesPage />} />
              <Route path="/matches/all" element={<AllMatchesPage />} />
              
              {/* Rutas protegidas */}
              <Route path="/profile" element={<ProfilePage />} />
              
              {/* Ruta de redirección para rutas no existentes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </LocalizationProvider>
    </MUIThemeProvider>
  );
}

// Componente raíz de la aplicación
function App() {
  return (
    <ThemeProvider>
      <AppWithTheme />
    </ThemeProvider>
  );
}

export default App;
