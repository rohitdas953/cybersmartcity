import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Slider, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Chip,
  Stack,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  PlayArrow, 
  Stop, 
  Speed, 
  Refresh, 
  Add, 
  Warning,
  Security,
  NetworkCheck
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const SimulationControls = () => {
  const { 
    simulationActive, 
    simulationSpeed, 
    currentScenario, 
    availableScenarios, 
    simulationTime, 
    simulationStats, 
    startSimulation, 
    stopSimulation, 
    changeSimulationSpeed, 
    addCustomEvent 
  } = useSimulation();
  
  const [selectedScenario, setSelectedScenario] = useState('');
  const [customEventType, setCustomEventType] = useState('threat');
  const [customEventSeverity, setCustomEventSeverity] = useState('medium');
  
  // Handle scenario selection
  const handleScenarioChange = (event) => {
    setSelectedScenario(event.target.value);
  };
  
  // Handle start simulation
  const handleStartSimulation = () => {
    if (selectedScenario) {
      startSimulation(selectedScenario);
    }
  };
  
  // Handle speed change
  const handleSpeedChange = (event, newValue) => {
    changeSimulationSpeed(newValue);
  };
  
  // Handle custom event
  const handleAddCustomEvent = (type) => {
    // Get a random device ID from 1-20
    const randomDeviceId = Math.floor(Math.random() * 20) + 1;
    
    // Create event based on type
    let event;
    
    switch (type) {
      case 'threat':
        event = {
          type: 'threat',
          deviceId: randomDeviceId,
          threatType: ['malware', 'intrusion', 'ddos', 'dataExfiltration'][Math.floor(Math.random() * 4)],
          severity: customEventSeverity
        };
        break;
        
      case 'system':
        event = {
          type: 'system',
          deviceId: randomDeviceId,
          action: ['offline', 'reboot', 'update', 'error'][Math.floor(Math.random() * 4)]
        };
        break;
        
      case 'network':
        event = {
          type: 'system',
          deviceId: randomDeviceId,
          action: ['connection_lost', 'latency_spike', 'packet_loss', 'bandwidth_drop'][Math.floor(Math.random() * 4)]
        };
        break;
        
      default:
        return;
    }
    
    // Add event to queue
    addCustomEvent(event);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Simulation Controls
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
              <InputLabel>Select Scenario</InputLabel>
              <Select
                value={selectedScenario}
                onChange={handleScenarioChange}
                label="Select Scenario"
                disabled={simulationActive}
              >
                {availableScenarios && availableScenarios.length > 0 ? availableScenarios.map((scenario) => (
                  <MenuItem key={scenario?.id || 'unknown'} value={scenario?.id || 'unknown'}>
                    {scenario?.name || 'Unknown Scenario'}
                  </MenuItem>
                )) : <MenuItem value="">No scenarios available</MenuItem>}
              </Select>
            </FormControl>
            
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PlayArrow />}
                onClick={handleStartSimulation}
                disabled={simulationActive || !selectedScenario}
                fullWidth
              >
                Start
              </Button>
              
              <Button
                variant="outlined"
                color="error"
                startIcon={<Stop />}
                onClick={stopSimulation}
                disabled={!simulationActive}
                fullWidth
              >
                Stop
              </Button>
              
              <Button
                variant="outlined"
                color="info"
                startIcon={<Refresh />}
                onClick={() => window.location.reload()}
                fullWidth
              >
                Reset
              </Button>
            </Stack>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Simulation Speed: {simulationSpeed}x
            </Typography>
            
            <Stack direction="row" spacing={2} alignItems="center">
              <Speed color="action" />
              <Slider
                value={simulationSpeed}
                onChange={handleSpeedChange}
                step={1}
                marks
                min={1}
                max={10}
                disabled={!simulationActive}
                valueLabelDisplay="auto"
              />
            </Stack>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Add Custom Events
            </Typography>
            
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Severity</InputLabel>
                <Select
                  value={customEventSeverity}
                  onChange={(e) => setCustomEventSeverity(e.target.value)}
                  label="Severity"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>
              
              <Tooltip title="Add Threat Event">
                <IconButton 
                  color="error" 
                  onClick={() => handleAddCustomEvent('threat')}
                  disabled={!simulationActive}
                >
                  <Warning />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Add System Event">
                <IconButton 
                  color="info" 
                  onClick={() => handleAddCustomEvent('system')}
                  disabled={!simulationActive}
                >
                  <Security />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Add Network Event">
                <IconButton 
                  color="primary" 
                  onClick={() => handleAddCustomEvent('network')}
                  disabled={!simulationActive}
                >
                  <NetworkCheck />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Simulation Statistics
            </Typography>
            
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip 
                label={`Events: ${simulationStats?.eventsProcessed || 0}`} 
                color="default" 
                size="small" 
                variant="outlined" 
              />
              <Chip 
                label={`Threats: ${simulationStats?.threatsDetected || 0}`} 
                color="error" 
                size="small" 
                variant="outlined" 
              />
              <Chip 
                label={`Resolved: ${simulationStats?.incidentsResolved || 0}`} 
                color="success" 
                size="small" 
                variant="outlined" 
              />
              <Chip 
                label={`Compromised: ${simulationStats?.systemsCompromised || 0}`} 
                color="warning" 
                size="small" 
                variant="outlined" 
              />
            </Stack>
          </Box>
          
          {currentScenario ? (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Current Scenario: {currentScenario?.name || 'Unknown'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentScenario?.description || 'No description available'}
              </Typography>
            </Box>
          ) : null}
          
          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary">
              Simulation Time: {simulationTime ? simulationTime.toLocaleTimeString() : 'Not started'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SimulationControls;