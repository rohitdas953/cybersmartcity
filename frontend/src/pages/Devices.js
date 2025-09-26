import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { DeviceContext } from '../context/DeviceContext';
import { IncidentContext } from '../context/IncidentContext';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Card,
  CardContent,
  CardActions,
  Divider,
  LinearProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';

const Devices = () => {
  const { devices, updateDeviceStatus, deployCountermeasure, simulateAttack } = useContext(DeviceContext);
  const { createIncident } = useContext(IncidentContext);
  
  // State for filtering and searching
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // State for dialogs
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [countermeasureDialog, setCountermeasureDialog] = useState(false);
  const [selectedCountermeasure, setSelectedCountermeasure] = useState('');
  const [attackDialog, setAttackDialog] = useState(false);
  const [attackType, setAttackType] = useState('');
  
  // State for notifications
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  
  // Filter devices based on search and filters
  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          device.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || device.type === filterType;
    const matchesStatus = filterStatus === 'all' || device.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });
  
  // Get unique device types for filter dropdown
  const deviceTypes = [...new Set(devices.map(device => device.type))];
  
  // Handle countermeasure deployment
  const handleDeployCountermeasure = () => {
    if (selectedDevice && selectedCountermeasure) {
      deployCountermeasure(selectedDevice.id, selectedCountermeasure)
        .then(result => {
          setNotification({
            open: true,
            message: result.success 
              ? `Countermeasure ${selectedCountermeasure} deployed successfully` 
              : `Deployment failed: ${result.message}`,
            severity: result.success ? 'success' : 'error'
          });
          
          // Create an incident record for the countermeasure
          if (result.success) {
            createIncident({
              deviceId: selectedDevice.id,
              deviceName: selectedDevice.name,
              type: 'Countermeasure Deployment',
              description: `${selectedCountermeasure} deployed on ${selectedDevice.name}`,
              severity: 'medium',
              status: 'resolved'
            });
          }
        });
      setCountermeasureDialog(false);
      setSelectedCountermeasure('');
    }
  };
  
  // Handle attack simulation
  const handleSimulateAttack = () => {
    if (selectedDevice && attackType) {
      simulateAttack(selectedDevice.id, attackType)
        .then(result => {
          setNotification({
            open: true,
            message: `Attack simulation started: ${attackType} on ${selectedDevice.name}`,
            severity: 'warning'
          });
          
          // Create an incident for the attack
          createIncident({
            deviceId: selectedDevice.id,
            deviceName: selectedDevice.name,
            type: attackType,
            description: `${attackType} attack detected on ${selectedDevice.name}`,
            severity: 'high',
            status: 'investigating'
          });
        });
      setAttackDialog(false);
      setAttackType('');
    }
  };
  
  // Get status color based on device status
  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'success';
      case 'offline': return 'error';
      case 'compromised': return 'warning';
      case 'maintenance': return 'info';
      default: return 'default';
    }
  };
  
  // Get security level color
  const getSecurityLevelColor = (level) => {
    switch (level) {
      case 'high': return 'success';
      case 'medium': return 'warning';
      case 'low': return 'error';
      default: return 'default';
    }
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Smart City Devices
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Monitor and manage all connected infrastructure devices
        </Typography>
      </motion.div>
      
      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }} elevation={2}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search devices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Device Type</InputLabel>
              <Select
                value={filterType}
                label="Device Type"
                onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value="all">All Types</MenuItem>
                {deviceTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
                <MenuItem value="compromised">Compromised</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="outlined" 
              startIcon={<RefreshIcon />}
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterStatus('all');
              }}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Devices Grid */}
      <Grid container spacing={3}>
        {filteredDevices.map(device => (
          <Grid item xs={12} sm={6} md={4} key={device.id}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }} elevation={3}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {device.name}
                    </Typography>
                    <Chip 
                      label={device.status} 
                      color={getStatusColor(device.status)} 
                      size="small" 
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Type:</strong> {device.type}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Location:</strong> {device.location}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>IP Address:</strong> {device.ipAddress}
                  </Typography>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2">
                      <strong>Security Level:</strong>
                    </Typography>
                    <Chip 
                      label={device.securityLevel} 
                      color={getSecurityLevelColor(device.securityLevel)} 
                      size="small" 
                      icon={<SecurityIcon />}
                    />
                  </Box>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Health:</strong> {device.health}%
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={device.health} 
                      color={device.health > 70 ? 'success' : device.health > 30 ? 'warning' : 'error'}
                      sx={{ height: 8, borderRadius: 5 }}
                    />
                  </Box>
                  
                  {device.status === 'compromised' && (
                    <Alert severity="warning" sx={{ mt: 2 }} icon={<WarningIcon />}>
                      This device is potentially compromised
                    </Alert>
                  )}
                </CardContent>
                
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    size="small" 
                    variant="contained" 
                    color="primary"
                    onClick={() => {
                      setSelectedDevice(device);
                      setCountermeasureDialog(true);
                    }}
                  >
                    Secure
                  </Button>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color="warning"
                    onClick={() => {
                      setSelectedDevice(device);
                      setAttackDialog(true);
                    }}
                  >
                    Simulate Attack
                  </Button>
                </CardActions>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
      
      {filteredDevices.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2, mt: 3 }}>
          <Typography variant="h6" color="text.secondary">
            No devices match your search criteria
          </Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }}
            startIcon={<RefreshIcon />}
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
              setFilterStatus('all');
            }}
          >
            Reset Filters
          </Button>
        </Paper>
      )}
      
      {/* Countermeasure Dialog */}
      <Dialog open={countermeasureDialog} onClose={() => setCountermeasureDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Deploy Countermeasure</DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            Select a countermeasure to deploy on {selectedDevice?.name}
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Countermeasure</InputLabel>
            <Select
              value={selectedCountermeasure}
              label="Countermeasure"
              onChange={(e) => setSelectedCountermeasure(e.target.value)}
            >
              <MenuItem value="">Select a countermeasure</MenuItem>
              <MenuItem value="firewall_update">Firewall Update</MenuItem>
              <MenuItem value="malware_scan">Malware Scan</MenuItem>
              <MenuItem value="patch_deployment">Security Patch Deployment</MenuItem>
              <MenuItem value="traffic_filtering">Traffic Filtering</MenuItem>
              <MenuItem value="system_isolation">System Isolation</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCountermeasureDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleDeployCountermeasure} 
            variant="contained" 
            color="primary"
            disabled={!selectedCountermeasure}
          >
            Deploy
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Attack Simulation Dialog */}
      <Dialog open={attackDialog} onClose={() => setAttackDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Simulate Attack</DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            Select an attack type to simulate on {selectedDevice?.name}
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            This is for educational purposes only. No actual attacks will be performed.
          </Alert>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Attack Type</InputLabel>
            <Select
              value={attackType}
              label="Attack Type"
              onChange={(e) => setAttackType(e.target.value)}
            >
              <MenuItem value="">Select an attack type</MenuItem>
              <MenuItem value="DDoS Attack">DDoS Attack</MenuItem>
              <MenuItem value="Malware Infection">Malware Infection</MenuItem>
              <MenuItem value="Phishing Attempt">Phishing Attempt</MenuItem>
              <MenuItem value="Brute Force">Brute Force</MenuItem>
              <MenuItem value="SQL Injection">SQL Injection</MenuItem>
              <MenuItem value="Man-in-the-Middle">Man-in-the-Middle</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAttackDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSimulateAttack} 
            variant="contained" 
            color="warning"
            disabled={!attackType}
          >
            Simulate
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notification Snackbar */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Devices;