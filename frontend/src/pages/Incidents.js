import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaExclamationTriangle, FaNetworkWired, FaShieldAlt, FaHistory } from 'react-icons/fa';

// Sample incidents data
const initialIncidents = [
  { 
    id: 1, 
    device: 'Traffic Light #42', 
    type: 'Suspicious Access', 
    time: '2023-06-15T14:30:00', 
    status: 'investigating', 
    severity: 'high',
    description: 'Multiple unauthorized access attempts detected from unknown IP address.',
    actions: ['Access blocked', 'Credentials reset', 'Monitoring increased']
  },
  { 
    id: 2, 
    device: 'Water Sensor #17', 
    type: 'Data Manipulation', 
    time: '2023-06-15T14:08:00', 
    status: 'resolved', 
    severity: 'critical',
    description: 'Attempt to manipulate sensor readings detected. Potential impact on water quality reporting.',
    actions: ['Connection isolated', 'Backup data restored', 'Firmware updated']
  },
  { 
    id: 3, 
    device: 'CCTV Camera #08', 
    type: 'Connection Lost', 
    time: '2023-06-15T13:45:00', 
    status: 'resolved', 
    severity: 'medium',
    description: 'Camera connection dropped unexpectedly. Potential denial of service attack.',
    actions: ['Connection restored', 'Network path secured', 'Monitoring implemented']
  },
  { 
    id: 4, 
    device: 'Power Grid Node #3', 
    type: 'Brute Force Attack', 
    time: '2023-06-15T11:20:00', 
    status: 'mitigated', 
    severity: 'high',
    description: 'Systematic login attempts detected targeting control systems. Potential infrastructure disruption.',
    actions: ['IP blocked', 'Authentication strengthened', 'System isolated']
  },
  { 
    id: 5, 
    device: 'Traffic Light #28', 
    type: 'Firmware Tampering', 
    time: '2023-06-14T22:15:00', 
    status: 'resolved', 
    severity: 'critical',
    description: 'Unauthorized firmware modification detected. Potential traffic disruption averted.',
    actions: ['Original firmware restored', 'Access revoked', 'Audit performed']
  },
  { 
    id: 6, 
    device: 'Smart Parking Sensor #54', 
    type: 'Data Exfiltration', 
    time: '2023-06-14T16:40:00', 
    status: 'resolved', 
    severity: 'medium',
    description: 'Unusual data transmission patterns detected. Possible privacy breach.',
    actions: ['Connection secured', 'Data transmission rules updated', 'Monitoring implemented']
  },
];

const Incidents = () => {
  const [incidents, setIncidents] = useState(initialIncidents);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');

  // Filter incidents based on search and filters
  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.device.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          incident.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || incident.status === filterStatus;
    const matchesSeverity = filterSeverity === 'all' || incident.severity === filterSeverity;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Handle incident selection
  const handleIncidentClick = (incident) => {
    setSelectedIncident(incident);
  };

  return (
    <div className="h-full flex flex-col">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <h1 className="text-3xl font-bold mb-2">Security Incidents</h1>
        <p className="text-gray-400">Track and manage security events across your smart city infrastructure</p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        className="flex flex-wrap gap-4 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="relative flex-1 min-w-[300px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 rounded-md bg-dark-light border border-gray-700 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            placeholder="Search incidents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <FaFilter className="text-gray-400" />
          <select
            className="bg-dark-light border border-gray-700 rounded-md px-3 py-2 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="investigating">Investigating</option>
            <option value="mitigated">Mitigated</option>
            <option value="resolved">Resolved</option>
          </select>
          
          <select
            className="bg-dark-light border border-gray-700 rounded-md px-3 py-2 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
          >
            <option value="all">All Severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </motion.div>

      <div className="flex flex-1 space-x-4 overflow-hidden">
        {/* Incidents List */}
        <motion.div 
          className="flex-1 card overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="p-4">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Device</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredIncidents.length > 0 ? (
                  filteredIncidents.map((incident) => (
                    <motion.tr 
                      key={incident.id}
                      className={`cursor-pointer ${selectedIncident?.id === incident.id ? 'bg-dark' : ''}`}
                      whileHover={{ backgroundColor: 'rgba(45, 55, 72, 0.5)' }}
                      onClick={() => handleIncidentClick(incident)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaNetworkWired className="text-primary mr-2" />
                          <span>{incident.device}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{incident.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400">{formatDate(incident.time)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${incident.status === 'investigating' ? 'bg-warning text-dark' : incident.status === 'resolved' ? 'bg-success text-dark' : 'bg-primary text-white'}`}>
                          {incident.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${incident.severity === 'critical' ? 'bg-danger text-white' : incident.severity === 'high' ? 'bg-warning text-dark' : incident.severity === 'medium' ? 'bg-primary text-white' : 'bg-gray-500 text-white'}`}>
                          {incident.severity}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                      No incidents found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Incident Details Panel */}
        {selectedIncident ? (
          <motion.div 
            className="w-96 card overflow-y-auto"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{selectedIncident.device}</h2>
                <span className={`px-2 py-1 text-xs rounded-full ${selectedIncident.severity === 'critical' ? 'bg-danger text-white' : selectedIncident.severity === 'high' ? 'bg-warning text-dark' : selectedIncident.severity === 'medium' ? 'bg-primary text-white' : 'bg-gray-500 text-white'}`}>
                  {selectedIncident.severity}
                </span>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <FaExclamationTriangle className="text-warning mr-2" />
                  <span className="font-medium">{selectedIncident.type}</span>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <FaHistory className="mr-2" />
                  <span>{formatDate(selectedIncident.time)}</span>
                </div>
              </div>
              
              <div className="mb-4 p-3 bg-dark rounded-lg">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Description</h3>
                <p>{selectedIncident.description}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Actions Taken</h3>
                <ul className="space-y-2">
                  {selectedIncident.actions.map((action, index) => (
                    <li key={index} className="flex items-center">
                      <FaShieldAlt className="text-primary mr-2 text-sm" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Current Status</h3>
                <div className="flex items-center">
                  <span className={`px-2 py-1 text-xs rounded-full ${selectedIncident.status === 'investigating' ? 'bg-warning text-dark' : selectedIncident.status === 'resolved' ? 'bg-success text-dark' : 'bg-primary text-white'}`}>
                    {selectedIncident.status}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="btn-primary flex-1">Update Status</button>
                <button className="btn-secondary flex-1">View Device</button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="w-96 card flex items-center justify-center text-gray-400"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center p-6">
              <FaExclamationTriangle className="text-4xl mx-auto mb-4 text-gray-500" />
              <p>Select an incident to view details</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Incidents;