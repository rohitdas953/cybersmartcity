import React from 'react';
import { Box, Container } from '@mui/material';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
        <Navbar />
        <Container 
          component="main" 
          maxWidth={false} 
          sx={{ 
            flexGrow: 1, 
            p: 3, 
            overflow: 'auto',
            backgroundColor: 'background.default'
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;