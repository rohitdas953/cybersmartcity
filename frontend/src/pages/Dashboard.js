import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaExclamationTriangle, FaServer, FaNetworkWired } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Box, Typography, Grid, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { useDevices } from '../context/DeviceContext';
import { useIncidents } from '../context/IncidentContext';
import { useAnalytics } from '../context/AnalyticsContext';
import { useSimulation } from '../context/SimulationContext';
import { useThreat } from '../context/ThreatContext';
import SimulationControls from '../components/SimulationControls';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard = () => {
  const { devices } = useDevices();
  const { incidents } = useIncidents();
  const { threatStats, attackTypesDistribution } = useAnalytics();
  const { simulationActive, simulationStats } = useSimulation();
  const { alerts, activeThreats } = useThreat();
  
  // No need for the interval as we now have the simulation controls
  
  // Stats derived from context data
  const stats = [
    { 
      title: 'Protected Devices', 
      value: devices?.length || 0, 
      icon: <FaServer />, 
      color: 'primary.main' 
    },
    { 
      title: 'Active Threats', 
      value: activeThreats?.length || 0, 
      icon: <FaShieldAlt />, 
      color: 'error.main' 
    },
    { 
      title: 'Active Alerts', 
      value: (alerts || []).filter(alert => alert?.status !== 'resolved').length || 0, 
      icon: <FaExclamationTriangle />, 
      color: 'warning.main' 
    },
    { 
      title: 'Simulation Events', 
      value: simulationStats?.eventsProcessed || 0, 
      icon: <FaNetworkWired />, 
      color: 'info.main' 
    },
  ];
  
  // Get recent incidents from context
  const recentIncidents = incidents?.slice(0, 5) || [];

  return (
    <Box sx={{ p: 3 }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Security Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Real-time overview of your smart city security
        </Typography>
      </motion.div>

      {/* Simulation Controls */}
      <Grid container spacing={3} sx={{ mt: 2, mb: 2 }}>
        <Grid item xs={12} md={4}>
          <SimulationControls />
        </Grid>
      </Grid>

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={stat.title}>
              <motion.div 
                whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <Paper 
                  sx={{ 
                    p: 3, 
                    display: 'flex', 
                    alignItems: 'center',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    height: '100%'
                  }}
                  elevation={2}
                >
                  <Box 
                    sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      mr: 2, 
                      bgcolor: stat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {stat.value}
                    </Typography>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Paper sx={{ p: 3, borderRadius: 2 }} elevation={2}>
              <Typography variant="h6" gutterBottom>Threat Activity (24h)</Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={threatStats?.hourlyThreats || []}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="hour" stroke="rgba(255,255,255,0.7)" />
                    <YAxis stroke="rgba(255,255,255,0.7)" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a202c', border: 'none' }} 
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="count" stroke="#0078ff" fill="#0078ff" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        <Grid item xs={12} lg={6}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Paper sx={{ p: 3, borderRadius: 2 }} elevation={2}>
              <Typography variant="h6" gutterBottom>Attack Types</Typography>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attackTypesDistribution || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name || 'Unknown'} ${(percent * 100).toFixed(0)}%`}
                    >
                      {(attackTypesDistribution || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a202c', border: 'none' }} 
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>

      {/* Recent Incidents */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Paper sx={{ p: 3, mt: 3, borderRadius: 2 }} elevation={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Recent Security Incidents</Typography>
            <Button variant="contained" color="primary" size="small">View All</Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Device</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Severity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentIncidents?.map((incident) => (
                  <TableRow 
                    key={incident?.id || 'unknown'}
                    hover
                    sx={{ '&:hover': { backgroundColor: 'rgba(45, 55, 72, 0.5)' } }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FaNetworkWired style={{ marginRight: 8, color: '#0078ff' }} />
                        <Typography variant="body2">{incident?.deviceName || 'Unknown'}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{incident?.type || 'Unknown'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">{incident?.timestamp || 'Unknown'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={incident?.status || 'unknown'} 
                        size="small"
                        color={
                          incident?.status === 'investigating' ? 'warning' : 
                          incident?.status === 'resolved' ? 'success' : 
                          'primary'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={incident?.severity || 'unknown'} 
                        size="small"
                        color={
                          incident?.severity === 'critical' ? 'error' : 
                          incident?.severity === 'high' ? 'warning' : 
                          'secondary'
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Dashboard;