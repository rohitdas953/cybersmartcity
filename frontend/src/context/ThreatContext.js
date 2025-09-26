import React, { createContext, useContext, useState, useEffect } from 'react';
import { demoData } from '../data/demoData';
import { analyzeDeviceBehavior, classifyThreat, generateThreatAlert } from '../utils/threatDetection';

// Create context
const ThreatContext = createContext();

// Custom hook to use the threat context
export const useThreat = () => useContext(ThreatContext);

// Provider component
export const ThreatProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [activeThreats, setActiveThreats] = useState([]);
  const [threatStats, setThreatStats] = useState({
    total: 0,
    bySeverity: { critical: 0, high: 0, medium: 0, low: 0 },
    byType: {},
    byZone: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [threatDetectionActive, setThreatDetectionActive] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);
  
  // Initialize threat data
  useEffect(() => {
    fetchThreatData();
  }, []);
  
  // Fetch threat data
  const fetchThreatData = async () => {
    try {
      // In a production app, this would be an actual API call
      // For now, we'll use our demo data
      setTimeout(() => {
        // Process alerts from demo data
        const processedAlerts = demoData.alerts.map(alert => {
          // Find the device for this alert
          const device = demoData.devices.find(d => d.id === alert.deviceId);
          
          // Generate additional threat details using our threat detection utilities
          const behavior = analyzeDeviceBehavior({id: device?.id, type: device?.type, name: device?.name}, alert.indicators);
          const threatDetails = classifyThreat(alert.type, alert.severity, behavior);
          
          return {
            ...alert,
            deviceName: device?.name || 'Unknown Device',
            deviceType: device?.type || 'unknown',
            zone: device?.zone || 'Unknown Zone',
            behavior,
            threatDetails,
            isActive: alert.status !== 'resolved',
            timestamp: new Date(alert.timestamp).toISOString()
          };
        });
        
        // Sort alerts by timestamp (newest first)
        const sortedAlerts = processedAlerts.sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        // Extract active threats
        const threats = sortedAlerts
          .filter(alert => alert.isActive)
          .map(alert => ({
            id: `threat-${alert.id}`,
            alertId: alert.id,
            type: alert.type,
            severity: alert.severity,
            deviceId: alert.deviceId,
            deviceName: alert.deviceName,
            deviceType: alert.deviceType,
            zone: alert.zone,
            timestamp: alert.timestamp,
            details: alert.threatDetails,
            status: alert.status
          }));
        
        // Calculate threat statistics
        const stats = {
          total: sortedAlerts.length,
          bySeverity: {
            critical: sortedAlerts.filter(a => a.severity === 'critical').length,
            high: sortedAlerts.filter(a => a.severity === 'high').length,
            medium: sortedAlerts.filter(a => a.severity === 'medium').length,
            low: sortedAlerts.filter(a => a.severity === 'low').length
          },
          byType: {},
          byZone: {}
        };
        
        // Calculate by type
        sortedAlerts.forEach(alert => {
          if (!stats.byType[alert.type]) {
            stats.byType[alert.type] = 0;
          }
          stats.byType[alert.type]++;
          
          if (!stats.byZone[alert.zone]) {
            stats.byZone[alert.zone] = 0;
          }
          stats.byZone[alert.zone]++;
        });
        
        setAlerts(sortedAlerts);
        setActiveThreats(threats);
        setThreatStats(stats);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to fetch threat data');
      setLoading(false);
      console.error('Error fetching threat data:', err);
    }
  };
  
  // Get alerts for a specific device
  const getAlertsForDevice = (deviceId) => {
    return alerts.filter(alert => alert.deviceId === deviceId);
  };
  
  // Get alerts for a specific zone
  const getAlertsForZone = (zoneName) => {
    return alerts.filter(alert => alert.zone === zoneName);
  };
  
  // Update alert status
  const updateAlertStatus = (alertId, newStatus) => {
    setAlerts(prevAlerts => {
      const updatedAlerts = prevAlerts.map(alert => {
        if (alert.id === alertId) {
          const updatedAlert = { ...alert, status: newStatus };
          // If resolved, mark as inactive
          if (newStatus === 'resolved') {
            updatedAlert.isActive = false;
          }
          return updatedAlert;
        }
        return alert;
      });
      
      // Update active threats if needed
      if (newStatus === 'resolved') {
        setActiveThreats(prevThreats => 
          prevThreats.filter(threat => threat.alertId !== alertId)
        );
      }
      
      return updatedAlerts;
    });
  };
  
  // Generate a new alert (for simulation)
  const simulateNewAlert = (deviceId, threatType, severity) => {
    // Find the device
    const device = demoData.devices.find(d => d.id === deviceId);
    if (!device) return;
    
    // Generate random indicators based on threat type
    const indicators = [
      `Unusual ${threatType} activity detected`,
      `${device.type} showing abnormal behavior`,
      `Security policy violation: ${threatType}`
    ];
    
    // Analyze and classify the threat
    const behavior = analyzeDeviceBehavior({type: device.type}, indicators);
    const threatDetails = classifyThreat(threatType, severity, behavior);
    
    // Generate a new alert
    const newAlert = generateThreatAlert(device, {
      deviceId,
      type: threatType,
      severity,
      indicators,
      behavior,
      threatDetails
    });
    
    // Add device info
    const alertWithDeviceInfo = {
      ...newAlert,
      deviceName: device.name,
      deviceType: device.type,
      zone: device.zone,
      isActive: true,
      timestamp: new Date().toISOString()
    };
    
    // Add to alerts
    setAlerts(prevAlerts => [alertWithDeviceInfo, ...prevAlerts]);
    
    // Add to active threats
    const newThreat = {
      id: `threat-${newAlert.id}`,
      alertId: newAlert.id,
      type: newAlert.type,
      severity: newAlert.severity,
      deviceId: newAlert.deviceId,
      deviceName: device.name,
      deviceType: device.type,
      zone: device.zone,
      timestamp: newAlert.timestamp,
      details: newAlert.threatDetails,
      status: newAlert.status
    };
    
    setActiveThreats(prevThreats => [newThreat, ...prevThreats]);
    
    // Update statistics
    setThreatStats(prevStats => {
      const newStats = { ...prevStats };
      newStats.total++;
      newStats.bySeverity[severity]++;
      
      if (!newStats.byType[threatType]) {
        newStats.byType[threatType] = 0;
      }
      newStats.byType[threatType]++;
      
      if (!newStats.byZone[device.zone]) {
        newStats.byZone[device.zone] = 0;
      }
      newStats.byZone[device.zone]++;
      
      return newStats;
    });
    
    return alertWithDeviceInfo;
  };
  
  // Toggle threat detection
  const toggleThreatDetection = () => {
    setThreatDetectionActive(prev => !prev);
  };
  
  // Select an alert for detailed view
  const selectAlert = (alertId) => {
    const alert = alerts.find(a => a.id === alertId);
    setSelectedAlert(alert);
  };
  
  return (
    <ThreatContext.Provider
      value={{
        alerts,
        activeThreats,
        threatStats,
        loading,
        error,
        threatDetectionActive,
        selectedAlert,
        getAlertsForDevice,
        getAlertsForZone,
        updateAlertStatus,
        simulateNewAlert,
        toggleThreatDetection,
        selectAlert
      }}
    >
      {children}
    </ThreatContext.Provider>
  );
};