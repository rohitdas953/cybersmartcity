import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Context Providers
import { DeviceProvider } from './context/DeviceContext';
import { IncidentProvider } from './context/IncidentContext';
import { AnalyticsProvider } from './context/AnalyticsContext';
import { MapProvider } from './context/MapContext';
import { ThreatProvider } from './context/ThreatContext';
import { ResponseProvider } from './context/ResponseContext';
import { SimulationProvider } from './context/SimulationContext';

// Pages
import Dashboard from './pages/Dashboard';
import CityMap from './pages/CityMap';
import Incidents from './pages/Incidents';
import Analytics from './pages/Analytics';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    success: {
      main: '#4caf50',
    },
    warning: {
      main: '#ff9800',
    },
    error: {
      main: '#f44336',
    },
    info: {
      main: '#2196f3',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <MapProvider>
        <DeviceProvider>
          <ThreatProvider>
            <ResponseProvider>
              <IncidentProvider>
                <AnalyticsProvider>
                  <SimulationProvider>
                    <Router>
              <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <div className="flex flex-col flex-1 overflow-hidden">
                  <Navbar />
                  <motion.main 
                    className="flex-1 overflow-y-auto p-4 bg-dark"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/map" element={<CityMap />} />
                      <Route path="/incidents" element={<Incidents />} />
                      <Route path="/analytics" element={<Analytics />} />
                    </Routes>
                  </motion.main>
                </div>
              </div>
                    </Router>
                  </SimulationProvider>
                </AnalyticsProvider>
              </IncidentProvider>
            </ResponseProvider>
          </ThreatProvider>
        </DeviceProvider>
      </MapProvider>
    </ThemeProvider>
  );
}

export default App;