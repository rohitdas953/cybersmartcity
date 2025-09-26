import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create context
const AnalyticsContext = createContext();

// Custom hook to use the analytics context
export const useAnalytics = () => useContext(AnalyticsContext);

// Provider component
export const AnalyticsProvider = ({ children }) => {
  const [threatStats, setThreatStats] = useState(null);
  const [attackTypes, setAttackTypes] = useState(null);
  const [vulnerabilityData, setVulnerabilityData] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [timeRange, setTimeRange] = useState('24h'); // '24h', '7d', '30d', 'all'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch threat statistics
  const fetchThreatStats = async () => {
    try {
      setLoading(true);
      // In a production app, this would be an actual API call
      // For now, we'll use a simulated API response with setTimeout
      setTimeout(() => {
        // Sample data - in production, replace with actual API call
        const sampleThreatStats = {
          total: 128,
          critical: 18,
          high: 42,
          medium: 53,
          low: 15,
          mitigated: 87,
          active: 41,
          trend: [
            { date: '2023-06-09', count: 12 },
            { date: '2023-06-10', count: 15 },
            { date: '2023-06-11', count: 8 },
            { date: '2023-06-12', count: 20 },
            { date: '2023-06-13', count: 14 },
            { date: '2023-06-14', count: 32 },
            { date: '2023-06-15', count: 27 }
          ],
          // Add hourly threats data for the Dashboard chart
          hourlyThreats: [
            { hour: '00:00', count: 5 },
            { hour: '01:00', count: 3 },
            { hour: '02:00', count: 2 },
            { hour: '03:00', count: 1 },
            { hour: '04:00', count: 0 },
            { hour: '05:00', count: 2 },
            { hour: '06:00', count: 4 },
            { hour: '07:00', count: 7 },
            { hour: '08:00', count: 12 },
            { hour: '09:00', count: 15 },
            { hour: '10:00', count: 10 },
            { hour: '11:00', count: 8 },
            { hour: '12:00', count: 13 },
            { hour: '13:00', count: 11 },
            { hour: '14:00', count: 9 },
            { hour: '15:00', count: 14 },
            { hour: '16:00', count: 16 },
            { hour: '17:00', count: 12 },
            { hour: '18:00', count: 8 },
            { hour: '19:00', count: 6 },
            { hour: '20:00', count: 4 },
            { hour: '21:00', count: 7 },
            { hour: '22:00', count: 9 },
            { hour: '23:00', count: 6 }
          ]
        };
        
        setThreatStats(sampleThreatStats);
        setLoading(false);
      }, 1000);
      
      // When API is ready, uncomment this code:
      // const response = await axios.get(`/api/analytics/threats?timeRange=${timeRange}`);
      // setThreatStats(response.data);
      // setLoading(false);
    } catch (err) {
      setError('Failed to fetch threat statistics');
      setLoading(false);
      console.error('Error fetching threat statistics:', err);
    }
  };

  // Fetch attack types distribution
  const fetchAttackTypes = async () => {
    try {
      setLoading(true);
      // In a production app, this would be an actual API call
      setTimeout(() => {
        // Sample data - in production, replace with actual API call
        const sampleAttackTypes = [
          { type: 'Brute Force', count: 32, percentage: 25 },
          { type: 'DDoS', count: 28, percentage: 22 },
          { type: 'Data Manipulation', count: 24, percentage: 19 },
          { type: 'Firmware Tampering', count: 18, percentage: 14 },
          { type: 'Suspicious Access', count: 16, percentage: 12 },
          { type: 'Other', count: 10, percentage: 8 }
        ];
        
        setAttackTypes(sampleAttackTypes);
        setLoading(false);
      }, 1000);
      
      // When API is ready, uncomment this code:
      // const response = await axios.get(`/api/analytics/attack-types?timeRange=${timeRange}`);
      // setAttackTypes(response.data);
      // setLoading(false);
    } catch (err) {
      setError('Failed to fetch attack types distribution');
      setLoading(false);
      console.error('Error fetching attack types:', err);
    }
  };

  // Fetch device vulnerability data
  const fetchVulnerabilityData = async () => {
    try {
      setLoading(true);
      // In a production app, this would be an actual API call
      setTimeout(() => {
        // Sample data - in production, replace with actual API call
        const sampleVulnerabilityData = {
          deviceTypes: [
            { type: 'Traffic Lights', vulnerabilityScore: 78, count: 42 },
            { type: 'CCTV Cameras', vulnerabilityScore: 65, count: 128 },
            { type: 'Water Sensors', vulnerabilityScore: 82, count: 36 },
            { type: 'Power Grid Nodes', vulnerabilityScore: 92, count: 18 },
            { type: 'Smart Parking', vulnerabilityScore: 58, count: 64 },
            { type: 'Environmental Sensors', vulnerabilityScore: 45, count: 52 }
          ],
          topVulnerableDevices: [
            { id: 'PG-003', name: 'Power Grid Node #3', score: 98, issues: ['Outdated firmware', 'Weak encryption', 'Default credentials'] },
            { id: 'WS-017', name: 'Water Sensor #17', score: 94, issues: ['Unpatched CVE-2023-1234', 'Exposed API', 'Weak authentication'] },
            { id: 'TL-042', name: 'Traffic Light #42', score: 91, issues: ['Insecure communication', 'Physical access vulnerability', 'No input validation'] },
            { id: 'CC-008', name: 'CCTV Camera #08', score: 89, issues: ['Default password', 'Unencrypted data storage', 'Remote code execution vulnerability'] },
            { id: 'TL-028', name: 'Traffic Light #28', score: 87, issues: ['Outdated OS', 'No secure boot', 'Weak access controls'] }
          ]
        };
        
        setVulnerabilityData(sampleVulnerabilityData);
        setLoading(false);
      }, 1000);
      
      // When API is ready, uncomment this code:
      // const response = await axios.get(`/api/analytics/vulnerabilities?timeRange=${timeRange}`);
      // setVulnerabilityData(response.data);
      // setLoading(false);
    } catch (err) {
      setError('Failed to fetch vulnerability data');
      setLoading(false);
      console.error('Error fetching vulnerability data:', err);
    }
  };

  // Fetch system health metrics
  const fetchSystemHealth = async () => {
    try {
      setLoading(true);
      // In a production app, this would be an actual API call
      setTimeout(() => {
        // Sample data - in production, replace with actual API call
        const sampleSystemHealth = {
          overall: 82,
          metrics: [
            { name: 'Network Integrity', value: 78, trend: 'stable' },
            { name: 'Data Security', value: 85, trend: 'improving' },
            { name: 'Device Availability', value: 92, trend: 'stable' },
            { name: 'Authentication Systems', value: 88, trend: 'improving' },
            { name: 'Intrusion Detection', value: 76, trend: 'declining' },
            { name: 'Backup Systems', value: 94, trend: 'stable' }
          ],
          alerts: [
            { id: 1, level: 'warning', message: 'Network traffic anomalies detected in sector 3', time: '2023-06-15T14:30:00' },
            { id: 2, level: 'info', message: 'Scheduled security patches applied to 42 devices', time: '2023-06-15T12:15:00' },
            { id: 3, level: 'critical', message: 'Intrusion detection system requires maintenance', time: '2023-06-15T10:45:00' },
            { id: 4, level: 'warning', message: 'Unusual authentication patterns from admin subnet', time: '2023-06-14T22:30:00' }
          ]
        };
        
        setSystemHealth(sampleSystemHealth);
        setLoading(false);
      }, 1000);
      
      // When API is ready, uncomment this code:
      // const response = await axios.get(`/api/analytics/system-health?timeRange=${timeRange}`);
      // setSystemHealth(response.data);
      // setLoading(false);
    } catch (err) {
      setError('Failed to fetch system health metrics');
      setLoading(false);
      console.error('Error fetching system health:', err);
    }
  };

  // Fetch all analytics data
  const fetchAllAnalytics = async () => {
    setLoading(true);
    await Promise.all([
      fetchThreatStats(),
      fetchAttackTypes(),
      fetchVulnerabilityData(),
      fetchSystemHealth()
    ]);
    setLoading(false);
  };

  // Update time range and refresh data
  const updateTimeRange = (range) => {
    setTimeRange(range);
    // This will trigger the useEffect below to refresh all data
  };

  // Generate a random threat for simulation
  const simulateNewThreat = () => {
    if (!threatStats) return;
    
    // Increment total and active threats
    const updatedStats = {
      ...threatStats,
      total: threatStats.total + 1,
      active: threatStats.active + 1
    };
    
    // Randomly choose severity
    const severities = ['critical', 'high', 'medium', 'low'];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    updatedStats[severity] += 1;
    
    // Update trend data for today
    const today = new Date().toISOString().split('T')[0];
    const updatedTrend = [...threatStats.trend];
    const todayIndex = updatedTrend.findIndex(item => item.date === today);
    
    if (todayIndex >= 0) {
      updatedTrend[todayIndex] = {
        ...updatedTrend[todayIndex],
        count: updatedTrend[todayIndex].count + 1
      };
    } else {
      updatedTrend.push({ date: today, count: 1 });
    }
    
    // Update hourly threats data
    if (threatStats.hourlyThreats) {
      const currentHour = new Date().getHours();
      const hourFormat = currentHour.toString().padStart(2, '0') + ':00';
      
      const updatedHourlyThreats = [...threatStats.hourlyThreats];
      const hourIndex = updatedHourlyThreats.findIndex(item => item.hour === hourFormat);
      
      if (hourIndex >= 0) {
        updatedHourlyThreats[hourIndex] = {
          ...updatedHourlyThreats[hourIndex],
          count: updatedHourlyThreats[hourIndex].count + 1
        };
      }
      
      updatedStats.hourlyThreats = updatedHourlyThreats;
    }
    
    updatedStats.trend = updatedTrend;
    setThreatStats(updatedStats);
    
    // Also update attack types if available
    if (attackTypes) {
      const attackTypeIndex = Math.floor(Math.random() * attackTypes.length);
      const updatedAttackTypes = [...attackTypes];
      updatedAttackTypes[attackTypeIndex] = {
        ...updatedAttackTypes[attackTypeIndex],
        count: updatedAttackTypes[attackTypeIndex].count + 1
      };
      
      // Recalculate percentages
      const totalCount = updatedAttackTypes.reduce((sum, type) => sum + type.count, 0);
      updatedAttackTypes.forEach(type => {
        type.percentage = Math.round((type.count / totalCount) * 100);
      });
      
      setAttackTypes(updatedAttackTypes);
    }
    
    return severity;
  };

  // Load all analytics data when time range changes
  useEffect(() => {
    fetchAllAnalytics();
  }, [timeRange]);

  // Context value
  const value = {
    threatStats,
    attackTypes,
    vulnerabilityData,
    systemHealth,
    timeRange,
    loading,
    error,
    updateTimeRange,
    fetchAllAnalytics,
    simulateNewThreat
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};