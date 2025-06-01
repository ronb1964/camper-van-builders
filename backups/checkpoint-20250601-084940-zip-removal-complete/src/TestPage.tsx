import React from 'react';
import { Container, Typography, Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import TestNewJersey from './components/TestNewJersey';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const TestPage: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Camper Van Builders Test Page
          </Typography>
          <TestNewJersey />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default TestPage;
