import React from 'react';
import { Box, Container, Typography, Link, Divider } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Divider />
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 2
        }}>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: { xs: 2, sm: 0 } }}>
            © {new Date().getFullYear()} PADEL APP. Todos los derechos reservados.
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 3,
            justifyContent: 'center'
          }}>
            <Link href="#" color="inherit" underline="hover">
              Términos y Condiciones
            </Link>
            <Link href="#" color="inherit" underline="hover">
              Privacidad
            </Link>
            <Link href="#" color="inherit" underline="hover">
              Contacto
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
