import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { demoData } from '../data/demoData';

// Create context
const DeviceContext = createContext();

// Custom hook to use the device context
export const useDevices = () => useContext(DeviceContext);

// Provider component
export const DeviceProvider = ({ children }) => {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all devices
  const fetchDevices = async () => {
    try {
      setLoading(true);
      // In a production app, this would be an actual API call
      // For now, we'll use our demo data
      setTimeout(() => {
        // Use devices from our demo data
        const deviceData = demoData.devices.map(device => {
          // Generate random coordinates for visualization
          const x = Math.floor(Math.random() * 800) + 50;
          const y = Math.floor(Math.random() * 500) + 50;
          
          // Get logs for this device
          const deviceLogs = demoData.logs
            .filter(log => log.deviceId === device.id)
            .map(log => log.message);
          
          // Get alerts for this device
          const deviceAlerts = demoData.alerts
            .filter(alert => alert.deviceId === device.id);
          
          // Determine device status based on alerts
          let status = 'safe';
          if (deviceAlerts.length > 0) {
            const highestSeverityAlert = deviceAlerts.reduce((prev, current) => {
              const severityOrder = { 'critical': 3, 'high': 2, 'medium': 1, 'low': 0 };
              return severityOrder[current.severity] > severityOrder[prev.severity] ? current : prev;
            }, deviceAlerts[0]);
            
            switch (highestSeverityAlert.severity) {
              case 'critical':
                status = 'compromised';
                break;
              case 'high':
                status = 'attacked';
                break;
              case 'medium':
                status = 'suspicious';
                break;
              case 'low':
                status = 'warning';
                break;
              default:
                status = 'safe';
            }
          }
          
          return {
            id: device.id,
            type: device.type.toLowerCase(),
            name: device.name,
            zone: device.zone,
            location: { x, y },
            status,
            logs: deviceLogs.length > 0 ? deviceLogs : ['Normal operation', 'System online', 'Regular monitoring active'],
            alerts: deviceAlerts,
            lastUpdated: new Date().toISOString()
          };
        });
        
        // Add device connections from demo data
        const connectionsMap = {};
        demoData.connections.forEach(conn => {
          if (!connectionsMap[conn.source]) {
            connectionsMap[conn.source] = [];
          }
          if (!connectionsMap[conn.target]) {
            connectionsMap[conn.target] = [];
          }
          
          connectionsMap[conn.source].push({
            targetId: conn.target,
            type: conn.type,
            status: conn.status,
            traffic: conn.traffic
          });
          
          connectionsMap[conn.target].push({
            targetId: conn.source,
            type: conn.type,
            status: conn.status,
            traffic: conn.traffic
          });
        });
        
        // Add connections to devices
        const devicesWithConnections = deviceData.map(device => ({
          ...device,
          connections: connectionsMap[device.id] || []
        }));
        
        setDevices(devicesWithConnections);
        setLoading(false);
      }, 1000);
      
      // When API is ready, uncomment this code:
      // const response = await axios.get('/api/devices');
      // setDevices(response.data);
      // setLoading(false);
    } catch (err) {
      setError('Failed to fetch devices');
      setLoading(false);
      console.error('Error fetching devices:', err);
    }
  };

  // Get a specific device by ID
  const getDeviceById = async (id) => {
    try {
      const device = devices.find(d => d.id === id);
      if (device) {
        setSelectedDevice(device);
        return device;
      }
      
      // If not found in local state, fetch from API
      // In production, uncomment this code:
      // const response = await axios.get(`/api/devices/${id}`);
      // setSelectedDevice(response.data);
      // return response.data;
      
      return null;
    } catch (err) {
      setError('Failed to fetch device details');
      console.error('Error fetching device:', err);
      return null;
    }
  };

  // Update device status
  const updateDeviceStatus = async (id, status) => {
    try {
      // In production, uncomment this code:
      // const response = await axios.put(`/api/devices/${id}/status`, { status });
      // const updatedDevice = response.data;
      
      // For now, update local state directly
      const updatedDevices = devices.map(device => {
        if (device.id === id) {
          const updatedDevice = { 
            ...device, 
            status, 
            lastUpdated: new Date().toISOString() 
          };
          
          // If this is the selected device, update that too
          if (selectedDevice && selectedDevice.id === id) {
            setSelectedDevice(updatedDevice);
          }
          
          return updatedDevice;
        }
        return device;
      });
      
      setDevices(updatedDevices);
      return true;
    } catch (err) {
      setError('Failed to update device status');
      console.error('Error updating device status:', err);
      return false;
    }
  };

  // Get device logs
  const getDeviceLogs = async (id) => {
    try {
      const device = devices.find(d => d.id === id);
      if (device) {
        return device.logs;
      }
      
      // In production, uncomment this code:
      // const response = await axios.get(`/api/devices/${id}/logs`);
      // return response.data;
      
      return [];
    } catch (err) {
      setError('Failed to fetch device logs');
      console.error('Error fetching device logs:', err);
      return [];
    }
  };

  // Deploy countermeasures to a device
  const deployCountermeasure = async (id, countermeasureType) => {
    try {
      // In production, this would call the API
      // const response = await axios.post(`/api/devices/${id}/countermeasures`, { type: countermeasureType });
      
      // For now, simulate a response
      const device = devices.find(d => d.id === id);
      if (!device) return null;
      
      // Simulate deployment time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the device status (90% chance of success)
      const success = Math.random() < 0.9;
      if (success) {
        // If it was under attack, change to suspicious
        // If it was suspicious, change to safe
        let newStatus = device.status;
        if (device.status === 'attack') newStatus = 'suspicious';
        else if (device.status === 'suspicious') newStatus = 'safe';
        
        await updateDeviceStatus(id, newStatus);
      }
      
      return {
        success,
        deviceId: id,
        countermeasureType,
        timestamp: new Date().toISOString(),
        message: success ? 'Countermeasure deployed successfully' : 'Countermeasure deployment failed',
        actions: success ? [
          'Threat contained',
          'Security protocols updated',
          'Monitoring increased'
        ] : []
      };
    } catch (err) {
      setError('Failed to deploy countermeasure');
      console.error('Error deploying countermeasure:', err);
      return null;
    }
  };

  // Simulate a random attack on a device
  const simulateAttack = async (id = null) => {
    try {
      // If no ID provided, pick a random device
      const targetId = id || devices[Math.floor(Math.random() * devices.length)].id;
      
      // Update the device status to 'attack'
      await updateDeviceStatus(targetId, 'attack');
      
      return true;
    } catch (err) {
      console.error('Error simulating attack:', err);
      return false;
    }
  };

  // Load devices on initial mount
  useEffect(() => {
    fetchDevices();
  }, []);

  // Context value
  const value = {
    devices,
    selectedDevice,
    loading,
    error,
    fetchDevices,
    getDeviceById,
    updateDeviceStatus,
    getDeviceLogs,
    setSelectedDevice,
    deployCountermeasure,
    simulateAttack
  };

  return (
    <DeviceContext.Provider value={value}>
      {children}
    </DeviceContext.Provider>
  );
};