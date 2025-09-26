// Sample incidents data (in a real app, this would come from a database)
let incidents = [
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

// Get all incidents
exports.getAllIncidents = (req, res) => {
  try {
    // Sort incidents by time (newest first)
    const sortedIncidents = [...incidents].sort((a, b) => new Date(b.time) - new Date(a.time));
    res.status(200).json(sortedIncidents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific incident by ID
exports.getIncidentById = (req, res) => {
  try {
    const incident = incidents.find(i => i.id === parseInt(req.params.id));
    
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    
    res.status(200).json(incident);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new incident
exports.createIncident = (req, res) => {
  try {
    const { device, type, severity, description } = req.body;
    
    // Validate required fields
    if (!device || !type || !severity || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Create a new incident
    const newIncident = {
      id: incidents.length + 1,
      device,
      type,
      time: new Date().toISOString(),
      status: 'investigating',
      severity,
      description,
      actions: []
    };
    
    incidents.push(newIncident);
    
    res.status(201).json(newIncident);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update incident status
exports.updateIncidentStatus = (req, res) => {
  try {
    const { status, action } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    const incidentIndex = incidents.findIndex(i => i.id === parseInt(req.params.id));
    
    if (incidentIndex === -1) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    
    // Update the incident status
    incidents[incidentIndex] = {
      ...incidents[incidentIndex],
      status
    };
    
    // Add action to the actions array if provided
    if (action) {
      incidents[incidentIndex].actions.unshift(action);
    }
    
    res.status(200).json(incidents[incidentIndex]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};