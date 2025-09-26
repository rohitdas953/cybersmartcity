import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Button, Chip, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import SecurityIcon from '@mui/icons-material/Security';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Import context
import { useDevices } from '../context/DeviceContext';
import { useIncidents } from '../context/IncidentContext';

// Styled components
const MapContainer = styled(Paper)(({ theme }) => ({
  position: 'relative',
  height: 'calc(100vh - 180px)',
  width: '100%',
  backgroundColor: '#1a2035',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  padding: theme.spacing(2),
}));

const DeviceMarker = styled(motion.div)(({ theme, status }) => ({
  position: 'absolute',
  width: 30,
  height: 30,
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  zIndex: 10,
  backgroundColor: status === 'normal' 
    ? theme.palette.success.main 
    : status === 'warning' 
      ? theme.palette.warning.main 
      : status === 'critical' 
        ? theme.palette.error.main 
        : theme.palette.info.main,
  boxShadow: `0 0 10px ${status === 'normal' 
    ? theme.palette.success.main 
    : status === 'warning' 
      ? theme.palette.warning.main 
      : status === 'critical' 
        ? theme.palette.error.main 
        : theme.palette.info.main}`,
}));

const MapGrid = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'grid',
  gridTemplateColumns: 'repeat(20, 1fr)',
  gridTemplateRows: 'repeat(20, 1fr)',
}));

const GridLine = styled(Box)(({ theme, direction }) => ({
  position: 'absolute',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  ...(direction === 'horizontal' ? {
    height: '1px',
    width: '100%',
    left: 0,
  } : {
    width: '1px',
    height: '100%',
    top: 0,
  }),
}));

const CityDistrict = styled(Box)(({ theme, district }) => ({
  position: 'absolute',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  color: theme.palette.text.secondary,
  fontSize: '0.75rem',
  pointerEvents: 'none',
}));

const ConnectionLine = styled(motion.div)(({ theme, status }) => ({
  position: 'absolute',
  height: '2px',
  transformOrigin: '0 0',
  backgroundColor: status === 'normal' 
    ? 'rgba(76, 175, 80, 0.5)' 
    : status === 'warning' 
      ? 'rgba(255, 152, 0, 0.5)' 
      : status === 'critical' 
        ? 'rgba(244, 67, 54, 0.5)' 
        : 'rgba(33, 150, 243, 0.5)',
  zIndex: 5,
}));

const StatusIcon = ({ status }) => {
  switch (status) {
    case 'normal':
      return <CheckCircleIcon fontSize="small" />;
    case 'warning':
      return <WarningIcon fontSize="small" />;
    case 'critical':
      return <ErrorIcon fontSize="small" />;
    default:
      return <SecurityIcon fontSize="small" />;
  }
};

const CityMap = () => {
  const { devices, loading, simulateAttack, deployCountermeasure } = useDevices();
  const { simulateNewIncident } = useIncidents();
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showConnections, setShowConnections] = useState(true);
  const [mapAnimation, setMapAnimation] = useState(false);

  // City districts
  const districts = [
    { id: 1, name: 'Downtown', x: 10, y: 10, width: 35, height: 25 },
    { id: 2, name: 'Industrial Zone', x: 55, y: 15, width: 30, height: 20 },
    { id: 3, name: 'Residential Area', x: 15, y: 45, width: 25, height: 30 },
    { id: 4, name: 'Smart Park', x: 50, y: 50, width: 20, height: 20 },
    { id: 5, name: 'Transport Hub', x: 75, y: 65, width: 15, height: 15 },
  ];

  // Generate grid lines
  const gridLines = [];
  for (let i = 1; i < 20; i++) {
    // Horizontal lines
    gridLines.push(
      <GridLine 
        key={`h-${i}`} 
        direction="horizontal" 
        style={{ top: `${i * 5}%` }} 
      />
    );
    
    // Vertical lines
    gridLines.push(
      <GridLine 
        key={`v-${i}`} 
        direction="vertical" 
        style={{ left: `${i * 5}%` }} 
      />
    );
  }

  // Handle device click
  const handleDeviceClick = (device) => {
    setSelectedDevice(device);
  };

  // Handle attack simulation
  const handleSimulateAttack = async () => {
    if (selectedDevice) {
      await simulateAttack(selectedDevice.id);
      await simulateNewIncident(selectedDevice.name);
      setMapAnimation(true);
      setTimeout(() => setMapAnimation(false), 1000);
    }
  };

  // Handle countermeasure deployment
  const handleDeployCountermeasure = async () => {
    if (selectedDevice && selectedDevice.status !== 'normal') {
      await deployCountermeasure(selectedDevice.id);
    }
  };

  // Calculate connections between devices
  const connections = [];
  if (showConnections && devices && devices.length > 0) {
    // Create connections between devices based on proximity and type
    devices.forEach((device, index) => {
      if (!device || !device.position) return;
      
      // Connect to 2-3 nearby devices
      const connectedDevices = devices
        .filter(d => d && d.id !== device.id && d.position)
        .sort((a, b) => {
          const distA = Math.sqrt(
            Math.pow((device.position?.x || 0) - (a.position?.x || 0), 2) + 
            Math.pow((device.position?.y || 0) - (a.position?.y || 0), 2)
          );
          const distB = Math.sqrt(
            Math.pow((device.position?.x || 0) - (b.position?.x || 0), 2) + 
            Math.pow((device.position?.y || 0) - (b.position?.y || 0), 2)
          );
          return distA - distB;
        })
        .slice(0, 2 + Math.floor(Math.random() * 2)); // Connect to 2-3 devices
      
      connectedDevices.forEach(target => {
        if (!target || !target.position) return;
        
        // Only create connection if target device id is greater than current device id
        // This prevents duplicate connections
        if (target.id > device.id) {
          // Calculate angle for the line
          const dx = (target.position?.x || 0) - (device.position?.x || 0);
          const dy = (target.position?.y || 0) - (device.position?.y || 0);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          const length = Math.sqrt(dx * dx + dy * dy);
          
          // Determine connection status (worst of the two devices)
          const connectionStatus = 
            device.status === 'critical' || target.status === 'critical' ? 'critical' :
            device.status === 'warning' || target.status === 'warning' ? 'warning' :
            'normal';
          
          connections.push(
            <ConnectionLine
              key={`connection-${device.id}-${target.id}`}
              status={connectionStatus}
              style={{
                left: `${device.position?.x || 0}%`,
                top: `${device.position?.y || 0}%`,
                width: `${length}%`,
                transform: `rotate(${angle}deg)`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 1 }}
            />
          );
        }
      });
    });
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Smart City Infrastructure Map
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<RefreshIcon />}
            onClick={() => setMapAnimation(true)}
            sx={{ mr: 1 }}
          >
            Refresh Map
          </Button>
          <Button 
            variant="outlined" 
            color="secondary"
            onClick={() => setShowConnections(!showConnections)}
          >
            {showConnections ? 'Hide' : 'Show'} Connections
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          <MapContainer>
            {/* Map grid */}
            <MapGrid>
              {gridLines}
              
              {/* City districts */}
              {districts.map(district => (
                <CityDistrict
                  key={district.id}
                  district={district}
                  style={{
                    left: `${district.x}%`,
                    top: `${district.y}%`,
                    width: `${district.width}%`,
                    height: `${district.height}%`,
                  }}
                >
                  <Typography variant="caption">{district.name}</Typography>
                </CityDistrict>
              ))}
              
              {/* Device connections */}
              {connections}
              
              {/* Device markers */}
              {devices && devices.map(device => (
                device && device.position ? (
                  <Tooltip 
                    key={device.id} 
                    title={`${device.name} (${device.type}) - ${device.status.toUpperCase()}`}
                    arrow
                  >
                    <DeviceMarker
                      status={device.status}
                      style={{
                        left: `${device.position?.x || 0}%`,
                        top: `${device.position?.y || 0}%`,
                      }}
                      onClick={() => handleDeviceClick(device)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      animate={{
                        scale: mapAnimation || 
                          (selectedDevice && selectedDevice.id === device.id) || 
                          device.status === 'critical' ? 
                          [1, 1.2, 1] : 1,
                        boxShadow: device.status === 'critical' ? 
                          ['0 0 10px #f44336', '0 0 20px #f44336', '0 0 10px #f44336'] : 
                          undefined,
                      }}
                      transition={{
                        scale: { repeat: device.status === 'critical' ? Infinity : 0, duration: 1 },
                        boxShadow: { repeat: Infinity, duration: 1 },
                      }}
                    >
                      <StatusIcon status={device.status} />
                    </DeviceMarker>
                  </Tooltip>
                ) : null
              ))}
            </MapGrid>
          </MapContainer>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            {selectedDevice ? (
              <>
                <Typography variant="h6" gutterBottom>
                  {selectedDevice.name}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={selectedDevice.type}
                    size="small"
                    icon={<LocationOnIcon />}
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip 
                    label={selectedDevice.status.toUpperCase()}
                    size="small"
                    color={
                      selectedDevice.status === 'normal' ? 'success' :
                      selectedDevice.status === 'warning' ? 'warning' : 'error'
                    }
                    icon={<StatusIcon status={selectedDevice.status} />}
                    sx={{ mb: 1 }}
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {selectedDevice.description}
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Last Updated: {new Date(selectedDevice.lastUpdated).toLocaleString()}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    IP Address: {selectedDevice.ipAddress}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    Firmware: {selectedDevice.firmware}
                  </Typography>
                </Box>
                
                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button 
                    variant="contained" 
                    color="error"
                    onClick={handleSimulateAttack}
                    startIcon={<WarningIcon />}
                    disabled={selectedDevice.status === 'critical'}
                  >
                    Simulate Attack
                  </Button>
                  
                  <Button 
                    variant="contained" 
                    color="success"
                    onClick={handleDeployCountermeasure}
                    startIcon={<SecurityIcon />}
                    disabled={selectedDevice.status === 'normal'}
                  >
                    Deploy Countermeasure
                  </Button>
                </Box>
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <LocationOnIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No Device Selected
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click on any device marker on the map to view its details and perform actions.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CityMap;