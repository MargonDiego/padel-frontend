import React from 'react';
import { Box, Divider, Link as MuiLink, Typography, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const LoginFooter: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Divider sx={{ my: 2 }}>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ px: 1 }}
        >
          o
        </Typography>
      </Divider>
      
      <Box sx={{ textAlign: 'center' }}>
        <MuiLink 
          component={RouterLink} 
          to="/register" 
          variant="body1"
          sx={{
            fontWeight: 500,
            borderBottom: '2px solid transparent',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderBottomColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
            }
          }}
        >
          ¿No tienes una cuenta? Regístrate
        </MuiLink>
      </Box>
    </Box>
  );
};

export default LoginFooter;
