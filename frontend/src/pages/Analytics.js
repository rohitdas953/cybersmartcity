import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAnalytics } from '../context/AnalyticsContext';
import { useDevices } from '../context/DeviceContext';
import { useIncidents } from '../context/IncidentContext';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Divider,
  Tabs,
  Tab,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Security as SecurityIcon,
  Warning as WarningIcon,
  BugReport as BugReportIcon
} from '@mui/icons-material';
import { FaCalendarAlt, FaChartLine, FaShieldAlt, FaExclamationTriangle, FaServer, FaNetworkWired } from 'react-icons/fa';

// Chart colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Analytics = () => {
  const { threatStats, attackTypesDistribution, deviceVulnerabilities, systemHealth } = useAnalytics();
  const { devices } = useDevices();
  const { incidents } = useIncidents();
  
  const [timeRange, setTimeRange] = useState('week');
  const [tabValue, setTabValue] = useState(0);
  
  // Derived metrics
  const totalDevices = devices.length;
  const compromisedDevices = devices.filter(device => device.status === 'compromised').length;
  const compromisedPercentage = totalDevices > 0 ? (compromisedDevices / totalDevices) * 100 : 0;
  
  const resolvedIncidents = incidents.filter(incident => incident.status === 'resolved').length;
  const totalIncidents = incidents.length;
  const resolutionRate = totalIncidents > 0 ? (resolvedIncidents / totalIncidents) * 100 : 0;
  
  // We now use the simulation controls instead of a timer
  // No need for the interval as the simulation is controlled by the user
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Format data for charts
  const dailyThreatsData = threatStats?.dailyTrends?.map(item => ({
    date: item.date,
    threats: item.detected,
    blocked: item.blocked
  })) || [];
  
  const attackTypeData = attackTypesDistribution || [];
  
  const deviceVulnerabilityData = Object.entries(deviceVulnerabilities?.byDeviceType || {}).map(([name, count]) => ({
    name,
    vulnerabilities: count,
    patched: Math.floor(count * (Math.random() * 0.3 + 0.6)) // Simulate patched count (60-90% of vulnerabilities)
  }));
  
  const responseTimeData = threatStats?.avgResponseTime ? [
    { name: 'Critical', time: threatStats.avgResponseTime.critical },
    { name: 'High', time: threatStats.avgResponseTime.high },
    { name: 'Medium', time: threatStats.avgResponseTime.medium },
    { name: 'Low', time: threatStats.avgResponseTime.low },
  ] : [];
  
  // Sample stats with context data
  const stats = [
    { 
      title: 'Total Threats', 
      value: threatStats.totalThreatsDetected, 
      change: `+${threatStats.percentageIncrease}%`, 
      icon: <FaExclamationTriangle />, 
      color: 'warning' 
    },
    { 
      title: 'Blocked Attacks', 
      value: threatStats.totalThreatsBlocked, 
      change: `+${Math.floor(threatStats.percentageIncrease * 1.2)}%`, 
      icon: <FaShieldAlt />, 
      color: 'success' 
    },
    { 
      title: 'Avg. Response Time', 
      value: `${threatStats.avgResponseTime.overall.toFixed(1)}m`, 
      change: `-${(Math.random() * 0.5).toFixed(1)}m`, 
      icon: <FaChartLine />, 
      color: 'primary' 
    },
    { 
      title: 'System Uptime', 
      value: `${systemHealth.uptime.toFixed(1)}%`, 
      change: `+${(Math.random() * 0.3).toFixed(1)}%`, 
      icon: <FaServer />, 
      color: 'secondary' 
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <div>
            <Typography variant="h4" component="h1" gutterBottom>
              Threat Intelligence
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Comprehensive analytics of security events and system performance
            </Typography>
          </div>
          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="day">Day</MenuItem>
              <MenuItem value="week">Week</MenuItem>
              <MenuItem value="month">Month</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </motion.div>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            >
              <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }} elevation={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box 
                    sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      mr: 2,
                      bgcolor: `${stat.color}.main`,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h4" sx={{ mr: 1 }}>
                    {stat.value}
                  </Typography>
                  <Chip 
                    label={stat.change} 
                    color={stat.change.startsWith('+') ? 'error' : 'success'} 
                    size="small" 
                    variant="outlined"
                  />
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Tabs for different analytics views */}
      <Paper sx={{ mb: 3, borderRadius: 2 }} elevation={2}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Threat Overview" />
          <Tab label="Attack Types" />
          <Tab label="Vulnerabilities" />
          <Tab label="System Health" />
        </Tabs>
        
        {/* Tab Content */}
        <Box sx={{ p: 3 }}>
          {/* Threat Overview Tab */}
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <FaCalendarAlt style={{ marginRight: '8px' }} /> Daily Threat Activity
                </Typography>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={dailyThreatsData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="date" stroke="rgba(255,255,255,0.7)" />
                      <YAxis stroke="rgba(255,255,255,0.7)" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a202c', border: 'none' }} 
                        itemStyle={{ color: '#fff' }}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="threats" stroke="#ff3333" fill="#ff3333" fillOpacity={0.2} name="Threats Detected" />
                      <Area type="monotone" dataKey="blocked" stroke="#33ff57" fill="#33ff57" fillOpacity={0.2} name="Threats Blocked" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <FaExclamationTriangle style={{ marginRight: '8px' }} /> Attack Types
                </Typography>
                <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={attackTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {attackTypeData.map((entry, index) => (
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
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Recent Threat Intelligence
                </Typography>
                <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Threat Type</TableCell>
                        <TableCell>Target</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Severity</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Details</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {threatStats.recentThreats.map((threat) => (
                        <TableRow key={threat.id}>
                          <TableCell>{threat.type}</TableCell>
                          <TableCell>{threat.target}</TableCell>
                          <TableCell>{threat.timestamp}</TableCell>
                          <TableCell>
                            <Chip 
                              label={threat.severity} 
                              color={
                                threat.severity === 'critical' ? 'error' : 
                                threat.severity === 'high' ? 'warning' : 
                                threat.severity === 'medium' ? 'info' : 'default'
                              } 
                              size="small" 
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={threat.status} 
                              color={
                                threat.status === 'blocked' ? 'success' : 
                                threat.status === 'investigating' ? 'warning' : 
                                'error'
                              } 
                              size="small" 
                            />
                          </TableCell>
                          <TableCell>
                            <Button size="small" variant="outlined">View</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          )}
          
          {/* Attack Types Tab */}
          {tabValue === 1 && (
            <Typography variant="body1">Detailed attack type analysis would be displayed here.</Typography>
          )}
          
          {/* Vulnerabilities Tab */}
          {tabValue === 2 && (
            <Typography variant="body1">Vulnerability assessment and management would be displayed here.</Typography>
          )}
          
          {/* System Health Tab */}
          {tabValue === 3 && (
            <Typography variant="body1">System health metrics and monitoring would be displayed here.</Typography>
          )}
        </Box>
      </Paper>

      {/* Device Vulnerabilities and Response Time */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }} elevation={2}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <FaNetworkWired style={{ marginRight: '8px' }} /> Device Vulnerabilities
              </Typography>
              <Box sx={{ height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={deviceVulnerabilityData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
                    <YAxis stroke="rgba(255,255,255,0.7)" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a202c', border: 'none' }} 
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Bar dataKey="vulnerabilities" fill="#ff3333" name="Vulnerabilities" />
                    <Bar dataKey="patched" fill="#33ff57" name="Patched" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }} elevation={2}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <FaChartLine style={{ marginRight: '8px' }} /> Response Time by Severity (minutes)
              </Typography>
              <Box sx={{ height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={responseTimeData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
                    <YAxis stroke="rgba(255,255,255,0.7)" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a202c', border: 'none' }} 
                      itemStyle={{ color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="time" stroke="#0078ff" strokeWidth={2} dot={{ r: 6 }} name="Avg. Response Time" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>

      {/* System Health */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        style={{ marginTop: '24px' }}
      >
        <Paper sx={{ p: 3, borderRadius: 2 }} elevation={2}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <FaServer style={{ marginRight: '8px' }} /> System Health
          </Typography>
          <Grid container spacing={2}>
            {[
              { name: 'Network Latency', value: `${systemHealth.network}ms`, status: systemHealth.network < 30 ? 'optimal' : 'normal' },
              { name: 'CPU Usage', value: `${systemHealth.cpu}%`, status: systemHealth.cpu < 50 ? 'optimal' : systemHealth.cpu < 80 ? 'normal' : 'warning' },
              { name: 'Memory Usage', value: `${systemHealth.memory}%`, status: systemHealth.memory < 60 ? 'optimal' : systemHealth.memory < 85 ? 'normal' : 'warning' },
              { name: 'Storage', value: `${systemHealth.disk}%`, status: systemHealth.disk < 50 ? 'optimal' : systemHealth.disk < 80 ? 'normal' : 'warning' },
            ].map((metric) => (
              <Grid item xs={12} sm={6} md={3} key={metric.name}>
                <Paper sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }} elevation={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">{metric.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        sx={{ 
                          height: 8, 
                          width: 8, 
                          borderRadius: '50%', 
                          bgcolor: metric.status === 'optimal' ? 'success.main' : metric.status === 'normal' ? 'primary.main' : 'warning.main',
                          mr: 0.5 
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                        {metric.status}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="h5">{metric.value}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Analytics;