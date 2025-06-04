import { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Snackbar,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Edit as EditIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/common/Layout';
import statsService from '../services/statsService';
import type { PlayerStat } from '../types/models';

// Componentes modularizados para el perfil
import ProfileHeader from '../components/profile/ProfileHeader';
import PlayerStats from '../components/profile/PlayerStats';
import ProfileForm from '../components/profile/ProfileForm';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  };
}

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [stats, setStats] = useState<PlayerStat | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  useEffect(() => {
    const fetchStats = async () => {
      if (user) {
        setLoadingStats(true);
        try {
          const response = await statsService.getPlayerStats(user.id);
          if (response.success) {
            setStats(response.data);
          }
        } catch (error) {
          console.error('Error fetching player stats:', error);
        } finally {
          setLoadingStats(false);
        }
      }
    };

    fetchStats();
  }, [user]);

  const handleUpdateSuccess = () => {
    setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
  };

  const handleUpdateError = () => {
    setMessage({ type: 'error', text: 'Error al actualizar el perfil' });
  };

  const handleCloseMessage = () => {
    setMessage(null);
  };

  if (!user) {
    return (
      <Layout>
        <Container>
          <Typography variant="h4">Debes iniciar sesión para ver esta página</Typography>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container>
        <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
          Mi Perfil
        </Typography>

        {/* Vista principal del perfil */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="Pestañas de perfil"
              variant="fullWidth"
              sx={{ bgcolor: 'background.default' }}>
              <Tab 
                label="Mi Perfil" 
                icon={<PersonIcon />} 
                iconPosition="start" 
                {...a11yProps(0)} 
              />
              <Tab 
                label="Editar Perfil" 
                icon={<EditIcon />} 
                iconPosition="start" 
                {...a11yProps(1)} 
              />
            </Tabs>
          </Box>
          
          {/* Panel de información personal y estadísticas */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ p: 3 }}>
              <Box sx={{ mb: 4 }}>
                <ProfileHeader user={user} />
              </Box>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Estadísticas del Jugador</Typography>
                <PlayerStats stats={stats} isLoading={loadingStats} />
              </Box>
            </Box>
          </TabPanel>
          
          {/* Panel de edición de perfil */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Editar Información Personal</Typography>
              <ProfileForm 
                user={user} 
                onUpdateUser={async (userData) => {
                  try {
                    const success = await updateUser(userData);
                    if (success) {
                      handleUpdateSuccess();
                      // Cambiar a la pestaña de información después de guardar
                      setTabValue(0);
                    } else {
                      handleUpdateError();
                    }
                    return success;
                  } catch (error) {
                    handleUpdateError();
                    return false;
                  }
                }} 
                onSuccess={handleUpdateSuccess} 
              />
            </Box>
          </TabPanel>
        </Paper>

        <Snackbar open={!!message} autoHideDuration={6000} onClose={handleCloseMessage}>
          <Alert onClose={handleCloseMessage} severity={message?.type} sx={{ width: '100%' }}>
            {message?.text}
          </Alert>
        </Snackbar>
      </Container>
    </Layout>
  );
};

export default ProfilePage;