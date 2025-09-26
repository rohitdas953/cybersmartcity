// Sample analytics data (in a real app, this would come from a database or be calculated)

// Get threat statistics
exports.getThreatStats = (req, res) => {
  try {
    const threatStats = {
      total: 127,
      blocked: 98,
      investigating: 18,
      mitigated: 11,
      byDay: [
        { date: '2023-06-10', count: 12 },
        { date: '2023-06-11', count: 15 },
        { date: '2023-06-12', count: 8 },
        { date: '2023-06-13', count: 20 },
        { date: '2023-06-14', count: 32 },
        { date: '2023-06-15', count: 40 }
      ]
    };
    
    res.status(200).json(threatStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get attack types distribution
exports.getAttackTypes = (req, res) => {
  try {
    const attackTypes = [
      { name: 'Brute Force', count: 42 },
      { name: 'DDoS', count: 28 },
      { name: 'Data Manipulation', count: 19 },
      { name: 'Firmware Tampering', count: 15 },
      { name: 'Man-in-the-Middle', count: 12 },
      { name: 'Other', count: 11 }
    ];
    
    res.status(200).json(attackTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get device vulnerability data
exports.getVulnerabilities = (req, res) => {
  try {
    const vulnerabilities = [
      { deviceType: 'Traffic Lights', count: 12, riskLevel: 'medium' },
      { deviceType: 'CCTV Cameras', count: 24, riskLevel: 'high' },
      { deviceType: 'Water Sensors', count: 8, riskLevel: 'low' },
      { deviceType: 'Power Grid', count: 18, riskLevel: 'critical' },
      { deviceType: 'Smart Parking', count: 6, riskLevel: 'low' }
    ];
    
    res.status(200).json(vulnerabilities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get system health metrics
exports.getSystemHealth = (req, res) => {
  try {
    const systemHealth = {
      uptime: 99.8,
      responseTime: 230, // ms
      activeConnections: 1842,
      cpuUsage: 42,
      memoryUsage: 38,
      alertLevel: 'moderate',
      metrics: [
        { name: 'CPU', current: 42, threshold: 80 },
        { name: 'Memory', current: 38, threshold: 75 },
        { name: 'Disk', current: 62, threshold: 90 },
        { name: 'Network', current: 56, threshold: 85 }
      ],
      history: [
        { timestamp: '2023-06-15T10:00:00', cpu: 38, memory: 35, connections: 1720 },
        { timestamp: '2023-06-15T11:00:00', cpu: 40, memory: 36, connections: 1780 },
        { timestamp: '2023-06-15T12:00:00', cpu: 45, memory: 40, connections: 1850 },
        { timestamp: '2023-06-15T13:00:00', cpu: 42, memory: 38, connections: 1842 }
      ]
    };
    
    res.status(200).json(systemHealth);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};