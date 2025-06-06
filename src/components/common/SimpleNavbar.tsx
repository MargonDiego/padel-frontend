import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Box, 
  Button, 
  IconButton, 
  Avatar, 
  Menu, 
  MenuItem, 
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import GroupsIcon from '@mui/icons-material/Groups';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useAuth } from '../../contexts/AuthContext';
import ThemeSwitcher from './ThemeSwitcher';

const SimpleNavbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  
  // Estados
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  
  // Handlers
  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => setUserMenuAnchor(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchor(null);
  const handleLogout = () => {
    handleUserMenuClose();
    logout();
    navigate('/login');
  };
  
  // Verificar ruta activa
  const isActive = (path: string) => location.pathname.startsWith(path);
  
  // Elementos de navegación
  const navItems = [
    { text: 'Torneos', path: '/tournaments', icon: <EmojiEventsIcon /> },
    { text: 'Partidos', path: '/matches/all', icon: <SportsSoccerIcon /> },
    { text: 'Equipos', path: '/teams', icon: <GroupsIcon /> },
    { text: 'Rankings', path: '/rankings', icon: <LeaderboardIcon /> }
  ];
  
  // Elementos de usuario
  const userItems = [
    { text: 'Mi Perfil', path: '/profile', icon: <PersonIcon /> },
    { text: 'Mis Equipos', path: '/my-teams', icon: <GroupsIcon /> }
  ];
  
  // Elementos de administrador
  const adminItems = user?.userRoleId === 1 ? [
    { text: 'Administrar Usuarios', path: '/admin/users', icon: <AdminPanelSettingsIcon /> }
  ] : [];

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(18,18,18,0.8)' : 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(8px)',
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'primary.main' }}>
            <SportsTennisIcon sx={{ mr: 1, color: 'secondary.main' }} />
            <Box component="span" sx={{ 
              fontWeight: 'bold', 
              fontSize: '1.2rem',
              display: { xs: 'none', sm: 'block' }
            }}>
              PADEL APP
            </Box>
          </Box>
          
          {/* Navegación desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={RouterLink}
                to={item.path}
                color={isActive(item.path) ? 'primary' : 'inherit'}
                sx={{
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.5,
                  fontWeight: isActive(item.path) ? 'bold' : 'normal',
                  position: 'relative',
                  '&::after': isActive(item.path) ? {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '20%',
                    width: '60%',
                    height: 3,
                    bgcolor: 'secondary.main',
                    borderRadius: 3
                  } : {}
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>
          
          {/* Acciones */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ThemeSwitcher />
            
            {isAuthenticated ? (
              <IconButton onClick={handleUserMenuOpen} sx={{ p: 0.5 }}>
                {user?.photo ? (
                  <Avatar 
                    src={`/uploads/user-photo/${user.photo}`} 
                    alt={user.name} 
                    sx={{ 
                      width: 36, 
                      height: 36,
                      border: 2,
                      borderColor: 'secondary.main'
                    }} 
                  />
                ) : (
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {user?.name?.charAt(0) || 'U'}
                  </Avatar>
                )}
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  size="small"
                  component={RouterLink} 
                  to="/login"
                  startIcon={<LoginIcon />}
                >
                  Iniciar
                </Button>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  size="small"
                  component={RouterLink} 
                  to="/register"
                  startIcon={<PersonAddIcon />}
                >
                  Registro
                </Button>
              </Box>
            )}
            
            <IconButton 
              color="inherit" 
              edge="end" 
              onClick={handleDrawerToggle}
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Menú de usuario */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          elevation: 3,
          sx: { 
            mt: 1.5, 
            minWidth: 180,
            borderRadius: 2,
            overflow: 'visible',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          }
        }}
      >
        {userItems.map((item) => (
          <MenuItem 
            key={item.path}
            onClick={() => { handleUserMenuClose(); navigate(item.path); }}
            sx={{ py: 1 }}
          >
            {React.cloneElement(item.icon, { sx: { mr: 1.5, color: 'primary.main' } })}
            {item.text}
          </MenuItem>
        ))}
        
        {adminItems.length > 0 && [
          <Divider key="admin-divider" />,
          ...adminItems.map((item) => (
            <MenuItem 
              key={item.path}
              onClick={() => { handleUserMenuClose(); navigate(item.path); }}
              sx={{ py: 1 }}
            >
              {React.cloneElement(item.icon, { sx: { mr: 1.5, color: 'warning.main' } })}
              {item.text}
            </MenuItem>
          ))
        ]}
        
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ py: 1, color: 'error.main' }}>
          <LogoutIcon sx={{ mr: 1.5 }} />
          Cerrar Sesión
        </MenuItem>
      </Menu>
      
      {/* Drawer para móvil */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: 280,
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            p: 2
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SportsTennisIcon sx={{ mr: 1, color: 'secondary.main' }} />
          <Box component="span" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
            PADEL APP
          </Box>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <List component="nav" sx={{ mb: 2 }}>
          {navItems.map((item) => (
            <ListItemButton
              key={item.path}
              component={RouterLink}
              to={item.path}
              selected={isActive(item.path)}
              onClick={handleDrawerToggle}
              sx={{ 
                borderRadius: 2, 
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'action.selected',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: isActive(item.path) ? 'secondary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
        
        {isAuthenticated ? (
          <>
            <Divider sx={{ my: 2 }} />
            
            <List component="nav" sx={{ mb: 1 }}>
              {userItems.map((item) => (
                <ListItemButton
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  selected={isActive(item.path)}
                  onClick={handleDrawerToggle}
                  sx={{ 
                    borderRadius: 2, 
                    mb: 0.5,
                    '&.Mui-selected': {
                      bgcolor: 'action.selected',
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: isActive(item.path) ? 'primary.main' : 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              ))}
              
              {adminItems.map((item) => (
                <ListItemButton
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  selected={isActive(item.path)}
                  onClick={handleDrawerToggle}
                  sx={{ 
                    borderRadius: 2, 
                    mb: 0.5,
                    '&.Mui-selected': {
                      bgcolor: 'action.selected',
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: 'warning.main' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              ))}
            </List>
            
            <Button
              fullWidth
              variant="contained"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={() => { handleDrawerToggle(); handleLogout(); }}
              sx={{ mt: 2, borderRadius: 2 }}
            >
              Cerrar Sesión
            </Button>
          </>
        ) : (
          <>
            <Divider sx={{ my: 2 }} />
            
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              component={RouterLink}
              to="/login"
              startIcon={<LoginIcon />}
              onClick={handleDrawerToggle}
              sx={{ mb: 1, borderRadius: 2 }}
            >
              Iniciar Sesión
            </Button>
            
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              component={RouterLink}
              to="/register"
              startIcon={<PersonAddIcon />}
              onClick={handleDrawerToggle}
              sx={{ borderRadius: 2 }}
            >
              Registrarse
            </Button>
          </>
        )}
      </Drawer>
    </>
  );
};

export default SimpleNavbar;
