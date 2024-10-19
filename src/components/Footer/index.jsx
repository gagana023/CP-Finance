import React from 'react';
import { Container, Box, Typography, Divider, IconButton } from '@mui/material';
import { Facebook, Twitter, LinkedIn } from '@mui/icons-material'; // Importing icons for social media

const Footer = () => {
  return (
    <Box
      sx={{
        py: 3,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container >
        <Typography variant="h6" align="center" color="black" gutterBottom>
          Personal Finance Manager
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography variant="body2" align="center" color="text.secondary">
          &copy; {new Date().getFullYear()} All Rights Reserved.
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary" gutterBottom>
          Created for FBLA Coding & Programming Competition
        </Typography>

      </Container>
    </Box>
  );
};

export default Footer;
