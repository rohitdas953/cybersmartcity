import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { demoData } from '../data/demoData';

// Create context
const IncidentContext = createContext();

// Custom hook to use the incident context
export const useIncidents = () => useContext(IncidentContext);

// Provider component
export const IncidentProvider = ({ children }) => {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    severity: 'all',
    search: ''
  });

  // Fetch all incidents
  const fetchIncidents = async () => {
    try {
      setLoading(true);
      // In a production app, this would be an actual API call
      // For now, we'll use our demo data
      setTimeout(() => {
        // Convert timeline events and alerts to incidents
        const timelineIncidents = demoData.timeline.map(event => ({
          id: event.id,
          device: event.details.device ? event.details.device.name : 'Multiple Devices',
          type: event.type === 'major_incident' ? event.details.title : event.type,
          time: event.timestamp.toISOString(),
          status: event.type === 'major_incident' ? 'investigating' : (Math.random() > 0.5 ? 'resolved' : 'investigating'),
          severity: event.details.severity || 'medium',
          description: event.details.description,
          actions: event.details.recommendedActions || []
        }));
        
        // Add alert-based incidents
        const alertIncidents = demoData.alerts.map((alert, index) => ({
          id: `alert-${index + 1}`,
          device: alert.deviceId,
          type: alert.type,
          time: alert.timestamp.toISOString(),
          status: Math.random() > 0.6 ? 'resolved' : 'investigating',
          severity: alert.severity,
          description: alert.message,
          actions: [
            'Isolate affected systems',
            'Analyze attack pattern',
            'Deploy countermeasures'
          ]
        }));
        
        // Add some additional static incidents for variety
        const staticIncidents = [
          { 
            id: 'static-1', 
            device: 'CCTV Camera #08', 
            type: 'Connection Lost', 
            time: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            status: 'resolved', 
            severity: 'medium',
            description: 'Camera connection dropped unexpectedly. Potential denial of service attack.',
            actions: ['Connection restored', 'Network path secured', 'Monitoring implemented']
          },
          { 
            id: 'static-2', 
            device: 'Power Grid Node #3', 
            type: 'Brute Force Attack', 
            time: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
            status: 'mitigated', 
            severity: 'high',
            description: 'Systematic login attempts detected targeting control systems. Potential infrastructure disruption.',
            actions: ['IP blocked', 'Authentication strengthened', 'System isolated']
          },
          { 
            id: 'static-3', 
            device: 'Traffic Light #28', 
            type: 'Firmware Tampering', 
            time: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            status: 'resolved', 
            severity: 'critical',
            description: 'Unauthorized firmware modification detected. Potential traffic disruption averted.',
            actions: ['Original firmware restored', 'Access revoked', 'Audit performed']
          }
        ];
        
        // Combine all incidents
        const allIncidents = [...timelineIncidents, ...alertIncidents, ...staticIncidents];
        
        // Sort incidents by time (newest first)
        const sortedIncidents = [...allIncidents].sort((a, b) => new Date(b.time) - new Date(a.time));
        
        setIncidents(sortedIncidents);
        setLoading(false);
      }, 1000);
      
      // When API is ready, uncomment this code:
      // const response = await axios.get('/api/incidents');
      // setIncidents(response.data);
      // setLoading(false);
    } catch (err) {
      setError('Failed to fetch incidents');
      setLoading(false);
      console.error('Error fetching incidents:', err);
    }
  };

  // Get a specific incident by ID
  const getIncidentById = async (id) => {
    try {
      const incident = incidents.find(i => i.id === id);
      if (incident) {
        setSelectedIncident(incident);
        return incident;
      }
      
      // If not found in local state, fetch from API
      // In production, uncomment this code:
      // const response = await axios.get(`/api/incidents/${id}`);
      // setSelectedIncident(response.data);
      // return response.data;
      
      return null;
    } catch (err) {
      setError('Failed to fetch incident details');
      console.error('Error fetching incident:', err);
      return null;
    }
  };

  // Create a new incident
  const createIncident = async (incidentData) => {
    try {
      // In production, uncomment this code:
      // const response = await axios.post('/api/incidents', incidentData);
      // const newIncident = response.data;
      
      // For now, create a new incident locally
      const newIncident = {
        id: incidents.length + 1,
        ...incidentData,
        time: new Date().toISOString(),
        status: 'investigating',
        actions: []
      };
      
      // Add to incidents list
      setIncidents([newIncident, ...incidents]);
      
      return newIncident;
    } catch (err) {
      setError('Failed to create incident');
      console.error('Error creating incident:', err);
      return null;
    }
  };

  // Update incident status
  const updateIncidentStatus = async (id, status, action = null) => {
    try {
      // In production, uncomment this code:
      // const response = await axios.put(`/api/incidents/${id}/status`, { status, action });
      // const updatedIncident = response.data;
      
      // For now, update local state directly
      const updatedIncidents = incidents.map(incident => {
        if (incident.id === id) {
          const updatedIncident = { 
            ...incident, 
            status
          };
          
          // Add action to the actions array if provided
          if (action) {
            updatedIncident.actions = [action, ...updatedIncident.actions];
          }
          
          // If this is the selected incident, update that too
          if (selectedIncident && selectedIncident.id === id) {
            setSelectedIncident(updatedIncident);
          }
          
          return updatedIncident;
        }
        return incident;
      });
      
      setIncidents(updatedIncidents);
      return true;
    } catch (err) {
      setError('Failed to update incident status');
      console.error('Error updating incident status:', err);
      return false;
    }
  };

  // Filter incidents based on current filters
  const getFilteredIncidents = () => {
    return incidents.filter(incident => {
      // Filter by status
      if (filters.status !== 'all' && incident.status !== filters.status) {
        return false;
      }
      
      // Filter by severity
      if (filters.severity !== 'all' && incident.severity !== filters.severity) {
        return false;
      }
      
      // Filter by search term
      if (filters.search && !(
        incident.device.toLowerCase().includes(filters.search.toLowerCase()) ||
        incident.type.toLowerCase().includes(filters.search.toLowerCase()) ||
        incident.description.toLowerCase().includes(filters.search.toLowerCase())
      )) {
        return false;
      }
      
      return true;
    });
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  // Simulate a new incident
  const simulateNewIncident = async (deviceName = null) => {
    // If no device name provided, pick from a list
    const device = deviceName || [
      'Traffic Light #42',
      'CCTV Camera #08',
      'Water Sensor #23',
      'Power Grid Node #3'
    ][Math.floor(Math.random() * 4)];
    
    // Pick a random incident type
    const incidentTypes = [
      'Suspicious Access',
      'Data Manipulation',
      'Connection Lost',
      'Brute Force Attack',
      'Firmware Tampering',
      'Data Exfiltration'
    ];
    const type = incidentTypes[Math.floor(Math.random() * incidentTypes.length)];
    
    // Pick a random severity
    const severities = ['medium', 'high', 'critical'];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    
    // Generate a description based on type
    let description = '';
    switch (type) {
      case 'Suspicious Access':
        description = 'Multiple unauthorized access attempts detected from unknown IP address.';
        break;
      case 'Data Manipulation':
        description = 'Attempt to manipulate device readings detected. Potential impact on system integrity.';
        break;
      case 'Connection Lost':
        description = 'Device connection dropped unexpectedly. Potential denial of service attack.';
        break;
      case 'Brute Force Attack':
        description = 'Systematic login attempts detected targeting control systems. Potential infrastructure disruption.';
        break;
      case 'Firmware Tampering':
        description = 'Unauthorized firmware modification detected. Potential service disruption averted.';
        break;
      case 'Data Exfiltration':
        description = 'Unusual data transmission patterns detected. Possible privacy breach.';
        break;
      default:
        description = 'Security incident detected. Investigation in progress.';
    }
    
    // Create the new incident
    return await createIncident({
      device,
      type,
      severity,
      description
    });
  };

  // Load incidents on initial mount
  useEffect(() => {
    fetchIncidents();
  }, []);

  // Context value
  const value = {
    incidents,
    selectedIncident,
    loading,
    error,
    filters,
    fetchIncidents,
    getIncidentById,
    createIncident,
    updateIncidentStatus,
    setSelectedIncident,
    getFilteredIncidents,
    updateFilters,
    simulateNewIncident
  };

  return (
    <IncidentContext.Provider value={value}>
      {children}
    </IncidentContext.Provider>
  );
};