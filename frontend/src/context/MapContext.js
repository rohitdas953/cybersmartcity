import React, { createContext, useContext, useState, useEffect } from 'react';
import { demoData } from '../data/demoData';

// Create context
const MapContext = createContext();

// Custom hook to use the map context
export const useMap = () => useContext(MapContext);

// Provider component
export const MapProvider = ({ children }) => {
  const [mapData, setMapData] = useState({
    zones: [],
    connections: [],
    loading: true,
    error: null
  });
  
  const [selectedZone, setSelectedZone] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewMode, setViewMode] = useState('normal'); // normal, threat, traffic
  
  // Initialize map data
  useEffect(() => {
    fetchMapData();
  }, []);
  
  // Fetch map data
  const fetchMapData = async () => {
    try {
      // In a production app, this would be an actual API call
      // For now, we'll use our demo data
      setTimeout(() => {
        // Extract unique zones from devices
        const uniqueZones = [...new Set(demoData.devices.map(device => device.zone))];
        
        // Create zone objects with devices
        const zones = uniqueZones.map(zoneName => {
          // Generate random coordinates for visualization
          const x = Math.floor(Math.random() * 800) + 100;
          const y = Math.floor(Math.random() * 500) + 100;
          
          // Get devices in this zone
          const zoneDevices = demoData.devices.filter(device => device.zone === zoneName);
          
          // Calculate zone status based on device statuses
          let zoneStatus = 'safe';
          const hasCompromised = zoneDevices.some(device => {
            const deviceAlerts = demoData.alerts.filter(alert => alert.deviceId === device.id);
            return deviceAlerts.some(alert => alert.severity === 'critical');
          });
          
          const hasAttacked = zoneDevices.some(device => {
            const deviceAlerts = demoData.alerts.filter(alert => alert.deviceId === device.id);
            return deviceAlerts.some(alert => alert.severity === 'high');
          });
          
          const hasSuspicious = zoneDevices.some(device => {
            const deviceAlerts = demoData.alerts.filter(alert => alert.deviceId === device.id);
            return deviceAlerts.some(alert => alert.severity === 'medium');
          });
          
          if (hasCompromised) {
            zoneStatus = 'compromised';
          } else if (hasAttacked) {
            zoneStatus = 'attacked';
          } else if (hasSuspicious) {
            zoneStatus = 'suspicious';
          }
          
          return {
            id: zoneName.replace(/\s+/g, '-').toLowerCase(),
            name: zoneName,
            location: { x, y },
            status: zoneStatus,
            deviceCount: zoneDevices.length,
            deviceTypes: [...new Set(zoneDevices.map(device => device.type))],
            securityLevel: Math.floor(Math.random() * 30) + 70 // 70-100%
          };
        });
        
        // Create connections between zones
        const zoneConnections = [];
        demoData.connections
          .filter(conn => conn.type === 'inter-zone')
          .forEach(conn => {
            // Find source and target devices
            const sourceDevice = demoData.devices.find(device => device.id === conn.source);
            const targetDevice = demoData.devices.find(device => device.id === conn.target);
            
            if (sourceDevice && targetDevice && sourceDevice.zone !== targetDevice.zone) {
              // Check if connection already exists
              const connectionExists = zoneConnections.some(zc => 
                (zc.source === sourceDevice.zone && zc.target === targetDevice.zone) ||
                (zc.source === targetDevice.zone && zc.target === sourceDevice.zone)
              );
              
              if (!connectionExists) {
                zoneConnections.push({
                  id: `${sourceDevice.zone}-${targetDevice.zone}`.replace(/\s+/g, '-').toLowerCase(),
                  source: sourceDevice.zone,
                  target: targetDevice.zone,
                  status: conn.status,
                  traffic: conn.traffic
                });
              }
            }
          });
        
        setMapData({
          zones,
          connections: zoneConnections,
          loading: false,
          error: null
        });
      }, 1000);
    } catch (err) {
      setMapData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to fetch map data'
      }));
      console.error('Error fetching map data:', err);
    }
  };
  
  // Select a zone
  const selectZone = (zoneId) => {
    const zone = mapData.zones.find(z => z.id === zoneId);
    setSelectedZone(zone);
  };
  
  // Change view mode
  const changeViewMode = (mode) => {
    setViewMode(mode);
  };
  
  // Change zoom level
  const changeZoomLevel = (level) => {
    setZoomLevel(Math.max(0.5, Math.min(2, level)));
  };
  
  // Get devices in a zone
  const getDevicesInZone = (zoneName) => {
    return demoData.devices.filter(device => device.zone === zoneName);
  };
  
  // Get zone statistics
  const getZoneStatistics = (zoneName) => {
    const zoneDevices = demoData.devices.filter(device => device.zone === zoneName);
    const deviceIds = zoneDevices.map(device => device.id);
    
    // Get alerts for devices in this zone
    const zoneAlerts = demoData.alerts.filter(alert => deviceIds.includes(alert.deviceId));
    
    // Get logs for devices in this zone
    const zoneLogs = demoData.logs.filter(log => deviceIds.includes(log.deviceId));
    
    // Calculate statistics
    return {
      deviceCount: zoneDevices.length,
      alertCount: zoneAlerts.length,
      logCount: zoneLogs.length,
      securityScore: Math.floor(Math.random() * 30) + 70, // 70-100%
      threatLevel: zoneAlerts.length > 5 ? 'high' : (zoneAlerts.length > 2 ? 'medium' : 'low'),
      deviceTypes: [...new Set(zoneDevices.map(device => device.type))],
      deviceStatuses: {
        safe: zoneDevices.filter(device => !zoneAlerts.some(alert => alert.deviceId === device.id)).length,
        warning: zoneDevices.filter(device => zoneAlerts.some(alert => alert.deviceId === device.id && alert.severity === 'low')).length,
        suspicious: zoneDevices.filter(device => zoneAlerts.some(alert => alert.deviceId === device.id && alert.severity === 'medium')).length,
        attacked: zoneDevices.filter(device => zoneAlerts.some(alert => alert.deviceId === device.id && alert.severity === 'high')).length,
        compromised: zoneDevices.filter(device => zoneAlerts.some(alert => alert.deviceId === device.id && alert.severity === 'critical')).length
      }
    };
  };
  
  return (
    <MapContext.Provider
      value={{
        ...mapData,
        selectedZone,
        zoomLevel,
        viewMode,
        selectZone,
        changeViewMode,
        changeZoomLevel,
        getDevicesInZone,
        getZoneStatistics
      }}
    >
      {children}
    </MapContext.Provider>
  );
};