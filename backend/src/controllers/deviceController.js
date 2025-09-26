// Sample device data (in a real app, this would come from a database)
let devices = [
  { 
    id: 1, 
    type: 'trafficLight', 
    name: 'Traffic Light #42', 
    location: { x: 150, y: 100 }, 
    status: 'safe', 
    logs: ['Normal operation', 'Signal timing adjusted', 'Maintenance check passed'],
    lastUpdated: new Date().toISOString()
  },
  { 
    id: 2, 
    type: 'trafficLight', 
    name: 'Traffic Light #17', 
    location: { x: 350, y: 200 }, 
    status: 'safe', 
    logs: ['Normal operation', 'Connection verified', 'System update completed'],
    lastUpdated: new Date().toISOString()
  },
  { 
    id: 3, 
    type: 'camera', 
    name: 'CCTV Camera #08', 
    location: { x: 250, y: 150 }, 
    status: 'suspicious', 
    logs: ['Unusual access pattern detected', 'Investigating connection anomaly', 'Monitoring for further issues'],
    lastUpdated: new Date().toISOString()
  },
  { 
    id: 4, 
    type: 'waterSensor', 
    name: 'Water Sensor #23', 
    location: { x: 450, y: 300 }, 
    status: 'safe', 
    logs: ['Normal readings', 'Data transmission stable', 'Battery level optimal'],
    lastUpdated: new Date().toISOString()
  },
  { 
    id: 5, 
    type: 'powerGrid', 
    name: 'Power Grid Node #3', 
    location: { x: 550, y: 150 }, 
    status: 'attack', 
    logs: ['Multiple login attempts detected', 'Unusual command sequences', 'Isolating node from network', 'Deploying countermeasures'],
    lastUpdated: new Date().toISOString()
  },
  { 
    id: 6, 
    type: 'camera', 
    name: 'CCTV Camera #15', 
    location: { x: 650, y: 250 }, 
    status: 'safe', 
    logs: ['Normal operation', 'Video feed stable', 'No anomalies detected'],
    lastUpdated: new Date().toISOString()
  },
];

// Get all devices
exports.getAllDevices = (req, res) => {
  try {
    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific device by ID
exports.getDeviceById = (req, res) => {
  try {
    const device = devices.find(d => d.id === parseInt(req.params.id));
    
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    
    res.status(200).json(device);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update device status
exports.updateDeviceStatus = (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    const deviceIndex = devices.findIndex(d => d.id === parseInt(req.params.id));
    
    if (deviceIndex === -1) {
      return res.status(404).json({ message: 'Device not found' });
    }
    
    // Update the device status
    devices[deviceIndex] = {
      ...devices[deviceIndex],
      status,
      lastUpdated: new Date().toISOString()
    };
    
    // Add a log entry about the status change
    const statusMessage = `Status changed to ${status}`;
    devices[deviceIndex].logs.unshift(statusMessage);
    
    res.status(200).json(devices[deviceIndex]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get device logs
exports.getDeviceLogs = (req, res) => {
  try {
    const device = devices.find(d => d.id === parseInt(req.params.id));
    
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    
    res.status(200).json(device.logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};