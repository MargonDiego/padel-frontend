import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Menu, MenuItem, Avatar, Divider } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../../contexts/AuthContext';
import ThemeSwitcher from './ThemeSwitcher';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleMenuClose();
    navigate('/login');
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Logo y título */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <SportsTennisIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 'bold',
            }}
          >
            PADEL APP
          </Typography>
        </Box>

        {/* Menú de navegación para pantallas grandes */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          <Button color="inherit" component={RouterLink} to="/tournaments">
            Torneos
          </Button>
          <Button color="inherit" component={RouterLink} to="/matches/all">
            Partidos
          </Button>
          <Button color="inherit" component={RouterLink} to="/teams">
            Equipos
          </Button>
          <Button color="inherit" component={RouterLink} to="/rankings">
            Rankings
          </Button>
          
          <ThemeSwitcher />
          
          {isAuthenticated ? (
            <>
              <IconButton 
                color="inherit" 
                onClick={handleMenuOpen}
                sx={{ ml: 1 }}
              >
                {user?.photo ? (
                  <Avatar 
                    src={`/uploads/user-photo/${user.photo}`} 
                    alt={user.name} 
                    sx={{ width: 32, height: 32 }}
                  />
                ) : (
                  <AccountCircleIcon />
                )}
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={() => {
                  handleMenuClose();
                  navigate('/profile');
                }}>
                  Mi Perfil
                </MenuItem>
                <MenuItem onClick={() => {
                  handleMenuClose();
                  navigate('/my-teams');
                }}>
                  Mis Equipos
                </MenuItem>
                {/* Mostrar opciones de administración solo si es admin */}
                {user?.userRoleId === 1 && [
                  <Divider key="admin-divider" />,
                  <MenuItem key="admin-users" onClick={() => {
                    handleMenuClose();
                    navigate('/admin/users');
                  }}>
                    Administrar Usuarios
                  </MenuItem>
                ]}
                <Divider />
                <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Iniciar Sesión
              </Button>
              <Button color="inherit" variant="outlined" component={RouterLink} to="/register">
                Registrarse
              </Button>
            </>
          )}
        </Box>

        {/* Menú móvil */}
        <IconButton
          color="inherit"
          aria-label="open menu"
          edge="end"
          onClick={handleMobileMenuToggle}
          sx={{ display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Menú móvil desplegable */}
      {mobileMenuOpen && (
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            flexDirection: 'column',
            bgcolor: 'primary.dark',
            p: 2,
          }}
        >
          <Button color="inherit" component={RouterLink} to="/tournaments" sx={{ my: 0.5 }}>
            Torneos
          </Button>
          <Button color="inherit" component={RouterLink} to="/matches/all" sx={{ my: 0.5 }}>
            Partidos
          </Button>
          <Button color="inherit" component={RouterLink} to="/teams" sx={{ my: 0.5 }}>
            Equipos
          </Button>
          <Button color="inherit" component={RouterLink} to="/rankings" sx={{ my: 0.5 }}>
            Rankings
          </Button>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
            <ThemeSwitcher />
          </Box>
          
          {isAuthenticated ? (
            <>
              <Button color="inherit" component={RouterLink} to="/profile" sx={{ my: 0.5 }}>
                Mi Perfil
              </Button>
              <Button color="inherit" component={RouterLink} to="/my-teams" sx={{ my: 0.5 }}>
                Mis Equipos
              </Button>
              {user?.userRoleId === 1 && (
                <Button color="inherit" component={RouterLink} to="/admin/users" sx={{ my: 0.5 }}>
                  Administrar Usuarios
                </Button>
              )}
              <Button color="inherit" onClick={handleLogout} sx={{ my: 0.5 }}>
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login" sx={{ my: 0.5 }}>
                Iniciar Sesión
              </Button>
              <Button color="inherit" component={RouterLink} to="/register" sx={{ my: 0.5 }}>
                Registrarse
              </Button>
            </>
          )}
        </Box>
      )}
    </AppBar>
  );
};

export default Navbar;
