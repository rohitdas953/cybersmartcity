import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTrafficLight, FaVideo, FaTint, FaBolt, FaInfoCircle, FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';

// Sample device data
const initialDevices = [
  { id: 1, type: 'trafficLight', name: 'Traffic Light #42', location: { x: 150, y: 100 }, status: 'safe', logs: ['Normal operation', 'Signal timing adjusted', 'Maintenance check passed'] },
  { id: 2, type: 'trafficLight', name: 'Traffic Light #17', location: { x: 350, y: 200 }, status: 'safe', logs: ['Normal operation', 'Connection verified', 'System update completed'] },
  { id: 3, type: 'camera', name: 'CCTV Camera #08', location: { x: 250, y: 150 }, status: 'suspicious', logs: ['Unusual access pattern detected', 'Investigating connection anomaly', 'Monitoring for further issues'] },
  { id: 4, type: 'waterSensor', name: 'Water Sensor #23', location: { x: 450, y: 300 }, status: 'safe', logs: ['Normal readings', 'Data transmission stable', 'Battery level optimal'] },
  { id: 5, type: 'powerGrid', name: 'Power Grid Node #3', location: { x: 550, y: 150 }, status: 'attack', logs: ['Multiple login attempts detected', 'Unusual command sequences', 'Isolating node from network', 'Deploying countermeasures'] },
  { id: 6, type: 'camera', name: 'CCTV Camera #15', location: { x: 650, y: 250 }, status: 'safe', logs: ['Normal operation', 'Video feed stable', 'No anomalies detected'] },
];

const Map = () => {
  const [devices, setDevices] = useState(initialDevices);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Function to get icon based on device type
  const getDeviceIcon = (type) => {
    switch (type) {
      case 'trafficLight':
        return <FaTrafficLight className="text-xl" />;
      case 'camera':
        return <FaVideo className="text-xl" />;
      case 'waterSensor':
        return <FaTint className="text-xl" />;
      case 'powerGrid':
        return <FaBolt className="text-xl" />;
      default:
        return <FaInfoCircle className="text-xl" />;
    }
  };

  // Function to handle device click
  const handleDeviceClick = (device) => {
    setSelectedDevice(device);
    setShowDetails(true);
  };

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'safe':
        return 'bg-success';
      case 'suspicious':
        return 'bg-warning';
      case 'attack':
        return 'bg-danger';
      default:
        return 'bg-gray-500';
    }
  };

  // Function to simulate response to attack
  const handleRespond = () => {
    if (selectedDevice && (selectedDevice.status === 'suspicious' || selectedDevice.status === 'attack')) {
      // Update the device status
      const updatedDevices = devices.map(device => 
        device.id === selectedDevice.id 
          ? { 
              ...device, 
              status: 'safe',
              logs: [
                'Countermeasures deployed successfully',
                'Threat neutralized',
                'System restored to normal operation',
                ...device.logs
              ]
            } 
          : device
      );
      
      setDevices(updatedDevices);
      setSelectedDevice({
        ...selectedDevice,
        status: 'safe',
        logs: [
          'Countermeasures deployed successfully',
          'Threat neutralized',
          'System restored to normal operation',
          ...selectedDevice.logs
        ]
      });
    }
  };

  // Function to get response recommendations
  const getResponseRecommendations = (status) => {
    if (status === 'suspicious') {
      return [
        'Increase monitoring frequency',
        'Verify authentication credentials',
        'Check for unusual traffic patterns'
      ];
    } else if (status === 'attack') {
      return [
        'Isolate device from network',
        'Deploy active countermeasures',
        'Alert security team',
        'Reroute critical functions'
      ];
    }
    return ['No action needed', 'Continue normal monitoring'];
  };

  return (
    <div className="h-full flex flex-col">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <h1 className="text-3xl font-bold mb-2">Smart City Infrastructure Map</h1>
        <p className="text-gray-400">Real-time monitoring of all connected devices</p>
      </motion.div>

      <div className="flex flex-1 space-x-4 overflow-hidden">
        {/* Map Area */}
        <motion.div 
          className="flex-1 card relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Map Grid Lines */}
          <div className="absolute inset-0 grid grid-cols-12 grid-rows-12">
            {Array(12).fill().map((_, i) => (
              <div key={`col-${i}`} className="border-r border-gray-800 h-full"></div>
            ))}
            {Array(12).fill().map((_, i) => (
              <div key={`row-${i}`} className="border-b border-gray-800 w-full"></div>
            ))}
          </div>

          {/* City Background Elements */}
          <div className="absolute inset-0 p-4">
            {/* Roads */}
            <div className="absolute top-1/4 left-0 right-0 h-8 bg-gray-800 rounded-sm"></div>
            <div className="absolute top-2/3 left-0 right-0 h-8 bg-gray-800 rounded-sm"></div>
            <div className="absolute left-1/4 top-0 bottom-0 w-8 bg-gray-800 rounded-sm"></div>
            <div className="absolute left-3/4 top-0 bottom-0 w-8 bg-gray-800 rounded-sm"></div>
            
            {/* Buildings */}
            <div className="absolute top-10 left-10 w-40 h-30 bg-gray-700 rounded-md"></div>
            <div className="absolute top-60 left-60 w-50 h-40 bg-gray-700 rounded-md"></div>
            <div className="absolute top-30 left-80 w-30 h-60 bg-gray-700 rounded-md"></div>
            <div className="absolute top-80 left-30 w-60 h-30 bg-gray-700 rounded-md"></div>
          </div>

          {/* Devices */}
          {devices.map((device) => (
            <motion.div
              key={device.id}
              className={`absolute cursor-pointer flex items-center justify-center h-12 w-12 rounded-full ${device.status === 'attack' ? 'animate-pulse-slow' : ''}`}
              style={{ 
                left: device.location.x, 
                top: device.location.y,
                backgroundColor: 'rgba(26, 32, 44, 0.8)',
                border: `2px solid ${device.status === 'safe' ? '#33ff57' : device.status === 'suspicious' ? '#ffb400' : '#ff3333'}`
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleDeviceClick(device)}
            >
              {getDeviceIcon(device.type)}
              <div className={`absolute -top-1 -right-1 h-4 w-4 rounded-full ${getStatusColor(device.status)}`}></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Device Details Panel */}
        {showDetails && selectedDevice && (
          <motion.div 
            className="w-96 card overflow-y-auto"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedDevice.name}</h2>
                <button 
                  className="text-gray-400 hover:text-white"
                  onClick={() => setShowDetails(false)}
                >
                  ×
                </button>
              </div>

              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <div className={`h-3 w-3 rounded-full ${getStatusColor(selectedDevice.status)} mr-2`}></div>
                  <span className="capitalize">
                    {selectedDevice.status === 'safe' ? 'Secure' : selectedDevice.status}
                  </span>
                </div>
                <div className="flex items-center">
                  {getDeviceIcon(selectedDevice.type)}
                  <span className="ml-2 capitalize">
                    {selectedDevice.type === 'trafficLight' ? 'Traffic Light' : 
                     selectedDevice.type === 'waterSensor' ? 'Water Sensor' : 
                     selectedDevice.type === 'powerGrid' ? 'Power Grid Node' : 
                     selectedDevice.type}
                  </span>
                </div>
              </div>

              {/* AI Decision */}
              <div className="mb-4 p-3 bg-dark rounded-lg">
                <h3 className="text-sm font-medium text-gray-400 mb-2">AI Threat Assessment</h3>
                <div className="flex items-center">
                  {selectedDevice.status === 'safe' ? (
                    <>
                      <FaShieldAlt className="text-success mr-2" />
                      <span>No threats detected (98% confidence)</span>
                    </>
                  ) : selectedDevice.status === 'suspicious' ? (
                    <>
                      <FaExclamationTriangle className="text-warning mr-2" />
                      <span>Suspicious activity detected (87% confidence)</span>
                    </>
                  ) : (
                    <>
                      <FaExclamationTriangle className="text-danger mr-2" />
                      <span>Active attack in progress (95% confidence)</span>
                    </>
                  )}
                </div>
              </div>

              {/* Response Recommendations */}
              {(selectedDevice.status === 'suspicious' || selectedDevice.status === 'attack') && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Recommended Actions</h3>
                  <ul className="space-y-2">
                    {getResponseRecommendations(selectedDevice.status).map((recommendation, index) => (
                      <li key={index} className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    className="btn-primary w-full mt-3"
                    onClick={handleRespond}
                  >
                    Deploy Countermeasures
                  </button>
                </div>
              )}

              {/* Device Logs */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Device Logs</h3>
                <div className="bg-dark rounded-lg p-3 font-mono text-xs h-40 overflow-y-auto">
                  {selectedDevice.logs.map((log, index) => (
                    <div key={index} className="mb-1">
                      <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span> {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Map;