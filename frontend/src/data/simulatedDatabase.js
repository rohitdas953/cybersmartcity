/**
 * Simulated Database for Smart City Security Operations Center
 * 
 * This module provides simulated data for devices, logs, and attack reports
 * to demonstrate the functionality of the security operations center without
 * requiring an actual backend database connection.
 */

import { SEVERITY, THREAT_TYPES, THREAT_STATUS } from '../utils/threatDetection';

// Device types in the smart city infrastructure
export const DEVICE_TYPES = {
  TRAFFIC_LIGHT: 'Traffic Light',
  SURVEILLANCE_CAMERA: 'Surveillance Camera',
  ENVIRONMENTAL_SENSOR: 'Environmental Sensor',
  SMART_METER: 'Smart Utility Meter',
  PUBLIC_WIFI: 'Public WiFi Access Point',
  PARKING_SENSOR: 'Parking Sensor',
  EMERGENCY_BEACON: 'Emergency Beacon',
  DIGITAL_BILLBOARD: 'Digital Billboard',
  WASTE_MANAGEMENT: 'Smart Waste Container',
  STREET_LIGHTING: 'Smart Street Light',
  VEHICLE_COUNTER: 'Vehicle Counter',
  WEATHER_STATION: 'Weather Station',
  FLOOD_SENSOR: 'Flood Sensor',
  AIR_QUALITY_MONITOR: 'Air Quality Monitor',
  TRAFFIC_CAMERA: 'Traffic Camera',
  PEDESTRIAN_COUNTER: 'Pedestrian Counter',
  EV_CHARGING: 'EV Charging Station',
  PUBLIC_TRANSPORT_BEACON: 'Public Transport Beacon',
  NOISE_SENSOR: 'Noise Level Sensor',
  WATER_QUALITY_SENSOR: 'Water Quality Sensor'
};

// City zones for device locations
export const CITY_ZONES = {
  DOWNTOWN: 'Downtown',
  RESIDENTIAL_NORTH: 'Residential - North',
  RESIDENTIAL_SOUTH: 'Residential - South',
  INDUSTRIAL: 'Industrial Zone',
  WATERFRONT: 'Waterfront',
  UNIVERSITY: 'University District',
  COMMERCIAL: 'Commercial District',
  PARK: 'Central Park',
  TRANSPORTATION_HUB: 'Transportation Hub',
  GOVERNMENT: 'Government District',
  MEDICAL: 'Medical District',
  ENTERTAINMENT: 'Entertainment District',
  SPORTS_COMPLEX: 'Sports Complex',
  SUBURBAN_EAST: 'Suburban - East',
  SUBURBAN_WEST: 'Suburban - West',
  PORT: 'Port Area',
  AIRPORT: 'Airport Vicinity',
  HISTORIC: 'Historic District',
  TECH_CORRIDOR: 'Technology Corridor',
  SHOPPING_DISTRICT: 'Shopping District'
};

// Device status options
export const DEVICE_STATUS = {
  ONLINE: 'Online',
  OFFLINE: 'Offline',
  MAINTENANCE: 'Maintenance',
  WARNING: 'Warning',
  CRITICAL: 'Critical'
};

// Log types for device activity
export const LOG_TYPES = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical',
  SECURITY: 'security',
  MAINTENANCE: 'maintenance',
  SYSTEM: 'system',
  NETWORK: 'network',
  USER: 'user',
  DATA: 'data'
};

/**
 * Generate a random date within a specified range
 * @param {Date} start - Start date
 * @param {Date} end - End date
 * @returns {Date} Random date between start and end
 */
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

/**
 * Generate a random IP address
 * @returns {String} Random IP address
 */
const randomIP = () => {
  return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
};

/**
 * Generate a random MAC address
 * @returns {String} Random MAC address
 */
const randomMAC = () => {
  const hexDigits = '0123456789ABCDEF';
  let mac = '';
  
  for (let i = 0; i < 6; i++) {
    mac += hexDigits.charAt(Math.floor(Math.random() * 16));
    mac += hexDigits.charAt(Math.floor(Math.random() * 16));
    if (i < 5) mac += ':';
  }
  
  return mac;
};

/**
 * Generate a random firmware version
 * @returns {String} Random firmware version
 */
const randomFirmwareVersion = () => {
  return `v${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`;
};

/**
 * Generate a random location within the city
 * @returns {Object} Location with latitude and longitude
 */
const randomLocation = () => {
  // Centered around a fictional city
  const centerLat = 34.0522;
  const centerLng = -118.2437;
  
  // Generate a location within ~5km of the center
  const lat = centerLat + (Math.random() - 0.5) * 0.1;
  const lng = centerLng + (Math.random() - 0.5) * 0.1;
  
  return { lat, lng };
};

/**
 * Generate a random element from an array
 * @param {Array} array - Array to select from
 * @returns {*} Random element from the array
 */
const randomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Generate a random element from an object's values
 * @param {Object} obj - Object to select from
 * @returns {*} Random value from the object
 */
const randomEnumValue = (obj) => {
  const values = Object.values(obj);
  return values[Math.floor(Math.random() * values.length)];
};

/**
 * Generate a random device ID
 * @returns {String} Random device ID
 */
const generateDeviceId = () => {
  return `DEV-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
};

/**
 * Generate a list of simulated devices
 * @param {Number} count - Number of devices to generate
 * @returns {Array} List of device objects
 */
export const generateDevices = (count = 100) => {
  const devices = [];
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  
  for (let i = 0; i < count; i++) {
    const deviceType = randomEnumValue(DEVICE_TYPES);
    const zone = randomEnumValue(CITY_ZONES);
    const location = randomLocation();
    const installDate = randomDate(oneYearAgo, now);
    const deviceId = generateDeviceId();
    
    // Generate a name based on type and zone
    const deviceName = `${deviceType} ${zone} #${Math.floor(Math.random() * 100) + 1}`;
    
    devices.push({
      id: deviceId,
      name: deviceName,
      type: deviceType,
      status: randomEnumValue(DEVICE_STATUS),
      zone,
      location,
      ipAddress: randomIP(),
      macAddress: randomMAC(),
      firmwareVersion: randomFirmwareVersion(),
      lastMaintenance: randomDate(installDate, now).toISOString(),
      installDate: installDate.toISOString(),
      lastActive: randomDate(installDate, now).toISOString(),
      batteryLevel: deviceType.includes('Sensor') ? Math.floor(Math.random() * 100) : null,
      manufacturer: randomElement([
        'SmartCity Tech', 'UrbanSense', 'CityWorks', 'MetroTech', 'IntelliUrban',
        'SmartPole Inc.', 'ConnectedCity', 'UrbanIoT', 'CityScape Systems', 'SmartInfra'
      ]),
      model: randomElement([
        'CityNode Pro', 'UrbanSense 2000', 'SmartPole X3', 'CityLink 5G', 'UrbanMesh',
        'SmartGrid 3.0', 'MetroConnect', 'CityWatcher Pro', 'SmartSense Ultra', 'UrbanNode'
      ]),
      operatingHours: Math.floor(Math.random() * 8760), // Hours in a year
      maintenanceSchedule: randomElement(['Monthly', 'Quarterly', 'Bi-annually', 'Annually']),
      sensors: deviceType.includes('Sensor') ? 
        randomElement([['Temperature', 'Humidity'], ['Motion', 'Light'], ['Pollution', 'Noise'], ['Vibration', 'Tilt']]) : 
        [],
      communicationType: randomElement(['5G', 'LTE', 'WiFi', 'LoRaWAN', 'Zigbee', 'Bluetooth Mesh']),
      powerSource: randomElement(['Grid', 'Solar', 'Battery', 'Hybrid']),
      dataTransmissionRate: `${Math.floor(Math.random() * 100) + 1} ${randomElement(['KB/s', 'MB/s'])}`
    });
  }
  
  return devices;
};

/**
 * Generate a random log message based on device type and log type
 * @param {String} deviceType - Type of device
 * @param {String} logType - Type of log
 * @returns {String} Generated log message
 */
const generateLogMessage = (deviceType, logType) => {
  const infoMessages = {
    [DEVICE_TYPES.TRAFFIC_LIGHT]: [
      'Signal timing adjusted based on traffic flow',
      'Pedestrian crossing button activated',
      'Switching to night mode operation',
      'Routine signal test completed successfully',
      'Connected to traffic management system'
    ],
    [DEVICE_TYPES.SURVEILLANCE_CAMERA]: [
      'Motion detection activated',
      'Recording started',
      'Pan-tilt-zoom operation performed',
      'Video analytics processing started',
      'Switching to night vision mode'
    ],
    [DEVICE_TYPES.ENVIRONMENTAL_SENSOR]: [
      'Sensor readings within normal parameters',
      'Data transmission completed successfully',
      'Calibration check passed',
      'Weather conditions updated',
      'Pollution index calculated'
    ],
    default: [
      'Device status check completed',
      'Routine operation performed',
      'Data transmission successful',
      'Connected to network',
      'Configuration updated'
    ]
  };
  
  const warningMessages = {
    [DEVICE_TYPES.TRAFFIC_LIGHT]: [
      'Signal timing deviation detected',
      'Minor communication delay with traffic management system',
      'Pedestrian button response delayed',
      'Light sensor partially obstructed',
      'Power fluctuation detected'
    ],
    [DEVICE_TYPES.SURVEILLANCE_CAMERA]: [
      'Low light conditions affecting image quality',
      'Camera lens may require cleaning',
      'Storage capacity at 80%',
      'Minor network latency detected',
      'Camera housing temperature elevated'
    ],
    [DEVICE_TYPES.ENVIRONMENTAL_SENSOR]: [
      'Battery level below 30%',
      'Sensor readings approaching threshold limits',
      'Calibration may be required soon',
      'Minor data transmission delay',
      'Environmental interference detected'
    ],
    default: [
      'Battery level below 30%',
      'Minor network connectivity issues',
      'Firmware update recommended',
      'Performance slightly below optimal',
      'Maintenance schedule approaching'
    ]
  };
  
  const errorMessages = {
    [DEVICE_TYPES.TRAFFIC_LIGHT]: [
      'Signal timing system error',
      'Communication failure with traffic management system',
      'Pedestrian button malfunction',
      'Light bulb failure detected',
      'Controller error code: TL-E45'
    ],
    [DEVICE_TYPES.SURVEILLANCE_CAMERA]: [
      'Camera feed interrupted',
      'Storage write error',
      'Pan-tilt mechanism failure',
      'Video processing error',
      'Network connection lost'
    ],
    [DEVICE_TYPES.ENVIRONMENTAL_SENSOR]: [
      'Sensor reading error',
      'Calibration failure',
      'Data transmission error',
      'Power supply issue',
      'Sensor component failure'
    ],
    default: [
      'Device error detected',
      'Connection failure',
      'Hardware malfunction',
      'Software error code: GEN-E404',
      'Operation timeout'
    ]
  };
  
  const criticalMessages = {
    [DEVICE_TYPES.TRAFFIC_LIGHT]: [
      'CRITICAL: Traffic light controller failure',
      'CRITICAL: All signals non-responsive',
      'CRITICAL: Power supply failure',
      'CRITICAL: Safety monitoring system failure',
      'CRITICAL: Multiple bulb failure detected'
    ],
    [DEVICE_TYPES.SURVEILLANCE_CAMERA]: [
      'CRITICAL: Camera completely offline',
      'CRITICAL: Physical tampering detected',
      'CRITICAL: Water ingress detected',
      'CRITICAL: Power supply failure',
      'CRITICAL: Critical hardware failure'
    ],
    [DEVICE_TYPES.ENVIRONMENTAL_SENSOR]: [
      'CRITICAL: Sensor completely offline',
      'CRITICAL: Multiple component failures',
      'CRITICAL: Extreme reading values detected',
      'CRITICAL: Power system failure',
      'CRITICAL: Physical damage detected'
    ],
    default: [
      'CRITICAL: Device completely offline',
      'CRITICAL: System failure',
      'CRITICAL: Multiple critical errors',
      'CRITICAL: Hardware failure',
      'CRITICAL: Immediate maintenance required'
    ]
  };
  
  const securityMessages = {
    [DEVICE_TYPES.TRAFFIC_LIGHT]: [
      'Unauthorized access attempt detected',
      'Unusual command sequence detected',
      'Configuration change from unrecognized source',
      'Communication protocol anomaly',
      'Suspicious timing change request'
    ],
    [DEVICE_TYPES.SURVEILLANCE_CAMERA]: [
      'Unauthorized access attempt to video feed',
      'Suspicious login attempt',
      'Unusual data extraction pattern',
      'Potential replay attack detected',
      'Camera direction change from unauthorized source'
    ],
    [DEVICE_TYPES.ENVIRONMENTAL_SENSOR]: [
      'Unauthorized configuration change attempt',
      'Suspicious data query pattern',
      'Unusual access pattern detected',
      'Potential data manipulation attempt',
      'Firmware verification failure'
    ],
    default: [
      'Unauthorized access attempt',
      'Suspicious network activity',
      'Unusual command sequence',
      'Potential security breach attempt',
      'Authentication failure'
    ]
  };
  
  let messageSet;
  
  switch (logType) {
    case LOG_TYPES.INFO:
      messageSet = infoMessages;
      break;
    case LOG_TYPES.WARNING:
      messageSet = warningMessages;
      break;
    case LOG_TYPES.ERROR:
      messageSet = errorMessages;
      break;
    case LOG_TYPES.CRITICAL:
      messageSet = criticalMessages;
      break;
    case LOG_TYPES.SECURITY:
      messageSet = securityMessages;
      break;
    default:
      messageSet = infoMessages;
  }
  
  const deviceMessages = messageSet[deviceType] || messageSet.default;
  return randomElement(deviceMessages);
};

/**
 * Generate device logs for a specific device
 * @param {Object} device - Device to generate logs for
 * @param {Number} count - Number of logs to generate
 * @returns {Array} List of log objects
 */
export const generateDeviceLogs = (device, count = 20) => {
  const logs = [];
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  // Weight the log types to make info more common
  const logTypeWeights = [
    LOG_TYPES.INFO, LOG_TYPES.INFO, LOG_TYPES.INFO, LOG_TYPES.INFO,
    LOG_TYPES.WARNING, LOG_TYPES.WARNING,
    LOG_TYPES.ERROR,
    LOG_TYPES.CRITICAL,
    LOG_TYPES.SECURITY, LOG_TYPES.SECURITY,
    LOG_TYPES.MAINTENANCE,
    LOG_TYPES.SYSTEM, LOG_TYPES.SYSTEM,
    LOG_TYPES.NETWORK, LOG_TYPES.NETWORK,
    LOG_TYPES.USER,
    LOG_TYPES.DATA, LOG_TYPES.DATA
  ];
  
  for (let i = 0; i < count; i++) {
    const logType = randomElement(logTypeWeights);
    const timestamp = randomDate(oneDayAgo, now).toISOString();
    
    logs.push({
      id: `LOG-${device.id}-${i}`,
      deviceId: device.id,
      deviceName: device.name,
      deviceType: device.type,
      timestamp,
      type: logType,
      message: generateLogMessage(device, logType, 'info'),
      sourceIp: device.ipAddress,
      relatedTo: Math.random() > 0.8 ? randomElement([
        'firmware update', 'configuration change', 'maintenance', 'user action', 'system event'
      ]) : null
    });
  }
  
  // Sort logs by timestamp (newest first)
  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

/**
 * Generate random logs across multiple devices
 * @param {Array} devices - List of devices to generate logs for
 * @param {Number} totalCount - Total number of logs to generate
 * @returns {Array} List of log objects distributed across devices
 */
export const generateRandomLogs = (devices, totalCount = 100) => {
  const logs = [];
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  // Weight the log types to make info more common
  const logTypeWeights = [
    LOG_TYPES.INFO, LOG_TYPES.INFO, LOG_TYPES.INFO, LOG_TYPES.INFO,
    LOG_TYPES.WARNING, LOG_TYPES.WARNING,
    LOG_TYPES.ERROR,
    LOG_TYPES.CRITICAL,
    LOG_TYPES.SECURITY, LOG_TYPES.SECURITY,
    LOG_TYPES.MAINTENANCE,
    LOG_TYPES.SYSTEM, LOG_TYPES.SYSTEM,
    LOG_TYPES.NETWORK, LOG_TYPES.NETWORK,
    LOG_TYPES.USER,
    LOG_TYPES.DATA, LOG_TYPES.DATA
  ];
  
  // Distribute logs among devices
  for (let i = 0; i < totalCount; i++) {
    const device = randomElement(devices);
    const logType = randomElement(logTypeWeights);
    const timestamp = randomDate(oneWeekAgo, now).toISOString();
    
    logs.push({
      id: `LOG-RANDOM-${i}`,
      deviceId: device.id,
      deviceName: device.name,
      deviceType: device.type,
      deviceZone: device.zone,
      timestamp,
      type: logType,
      message: generateLogMessage(device.type, logType),
      sourceIp: device.ipAddress,
      relatedTo: Math.random() > 0.8 ? randomElement([
        'firmware update', 'configuration change', 'maintenance', 'user action', 'system event'
      ]) : null
    });
  }
  
  // Sort logs by timestamp (newest first)
  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

/**
 * Generate a random threat description based on threat type
 * @param {String} threatType - Type of threat
 * @returns {String} Threat description
 */
const generateThreatDescription = (threatType) => {
  const descriptions = {
    [THREAT_TYPES.UNAUTHORIZED_ACCESS]: [
      'Unauthorized login attempt with multiple password failures',
      'Access detected from unusual geographic location',
      'Suspicious access pattern outside normal operating hours',
      'Attempted privilege escalation detected',
      'Multiple failed authentication attempts from same source'
    ],
    [THREAT_TYPES.DATA_MANIPULATION]: [
      'Abnormal data modification pattern detected',
      'Sensor readings manipulated outside physical possibility',
      'Configuration values altered without authorization',
      'Database integrity check failed',
      'Suspicious data overwrite attempts'
    ],
    [THREAT_TYPES.FIRMWARE_TAMPERING]: [
      'Firmware integrity check failed',
      'Unauthorized firmware modification detected',
      'Bootloader signature verification failed',
      'Suspicious firmware update from unverified source',
      'Device operating with unsigned firmware'
    ],
    [THREAT_TYPES.DENIAL_OF_SERVICE]: [
      'Abnormal traffic volume targeting device',
      'Service availability degraded due to request flooding',
      'Resource exhaustion attack detected',
      'Network interface overwhelmed with traffic',
      'Distributed attack pattern identified'
    ],
    [THREAT_TYPES.MALWARE]: [
      'Malicious code execution detected',
      'Suspicious process behavior identified',
      'Known malware signature detected in traffic',
      'Anomalous system call pattern',
      'Command and control communication attempted'
    ],
    [THREAT_TYPES.PHYSICAL_TAMPERING]: [
      'Enclosure tamper detection triggered',
      'Unexpected device movement detected',
      'Physical interface tampering detected',
      'Unauthorized device opening detected',
      'Sensor indicates physical shock event'
    ],
    [THREAT_TYPES.MAN_IN_THE_MIDDLE]: [
      'TLS certificate validation failure',
      'Unexpected ARP table modification',
      'DNS response inconsistency detected',
      'Traffic routing anomaly detected',
      'Encryption downgrade attempt'
    ],
    [THREAT_TYPES.RANSOMWARE]: [
      'Mass file encryption activity detected',
      'Ransomware note detected in filesystem',
      'Known ransomware communication pattern',
      'Critical system files being encrypted',
      'Suspicious encryption key management'
    ]
  };
  
  return randomElement(descriptions[threatType] || [
    'Suspicious activity detected',
    'Security policy violation',
    'Unusual device behavior',
    'Potential security threat identified',
    'Security anomaly detected'
  ]);
};

/**
 * Generate a list of simulated threat alerts
 * @param {Array} devices - List of devices to generate threats for
 * @param {Number} count - Number of threats to generate
 * @returns {Array} List of threat alert objects
 */
export const generateThreatAlerts = (devices, count = 15) => {
  const threats = [];
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  // Select random devices to have threats
  const selectedDevices = [];
  while (selectedDevices.length < Math.min(count, devices.length)) {
    const device = randomElement(devices);
    if (!selectedDevices.find(d => d.id === device.id)) {
      selectedDevices.push(device);
    }
  }
  
  for (let i = 0; i < count; i++) {
    // Cycle through selected devices if we need more threats than devices
    const device = selectedDevices[i % selectedDevices.length];
    const threatType = randomEnumValue(THREAT_TYPES);
    const severity = randomElement([
      SEVERITY.LOW, SEVERITY.LOW, SEVERITY.MEDIUM, SEVERITY.MEDIUM, 
      SEVERITY.MEDIUM, SEVERITY.HIGH, SEVERITY.HIGH, SEVERITY.CRITICAL
    ]); // Weight medium and high more
    
    // Generate a detection time within the last week
    const detectionTime = randomDate(oneWeekAgo, now).toISOString();
    
    // Import functions from threatDetection.js
    const { analyzeDeviceBehavior, classifyThreat, generateThreatAlert } = require('../utils/threatDetection');
    
    // Create a simulated device behavior analysis
    const behaviorAnalysis = analyzeDeviceBehavior({
      deviceId: device.id,
      deviceType: device.type,
      activityPattern: 'abnormal',
      dataTransmission: Math.random() > 0.5 ? 'unusual' : 'normal',
      connectionAttempts: Math.random() > 0.7 ? 'excessive' : 'normal',
      resourceUsage: Math.random() > 0.6 ? 'high' : 'normal',
      firmwareStatus: Math.random() > 0.8 ? 'modified' : 'verified',
      authenticationLogs: Math.random() > 0.7 ? 'failed_attempts' : 'normal'
    });
    
    // Classify the threat
    const threatClassification = classifyThreat(behaviorAnalysis);
    
    // Generate the alert
    const alert = generateThreatAlert(device, threatClassification);
    
    threats.push({
      id: `THREAT-${i + 1}`,
      deviceId: device.id,
      deviceName: device.name,
      deviceType: device.type,
      deviceZone: device.zone,
      deviceLocation: device.location,
      threatType,
      severity,
      status: randomElement([
        THREAT_STATUS.DETECTED, THREAT_STATUS.DETECTED, 
        THREAT_STATUS.ANALYZING, THREAT_STATUS.ANALYZING,
        THREAT_STATUS.MITIGATING, THREAT_STATUS.MITIGATING,
        THREAT_STATUS.RESOLVED, THREAT_STATUS.FALSE_POSITIVE
      ]),
      detectionTime,
      description: generateThreatDescription(threatType),
      sourceIp: Math.random() > 0.3 ? randomIP() : device.ipAddress,
      affectedSystems: alert.affectedSystems,
      potentialImpact: alert.potentialImpact,
      recommendedActions: alert.recommendedActions,
      confidence: Math.floor(Math.random() * 30) + 70, // 70-99%
      analysisDetails: behaviorAnalysis,
      relatedThreats: Math.random() > 0.7 ? [
        `THREAT-${Math.floor(Math.random() * count) + 1}`
      ] : []
    });
  }
  
  // Sort threats by detection time (newest first)
  return threats.sort((a, b) => new Date(b.detectionTime) - new Date(a.detectionTime));
};

/**
 * Generate all simulated data for the application
 * @returns {Object} Object containing devices, logs, and threats
 */
export const generateAllData = () => {
  // Generate devices
  const devices = generateDevices(100);
  
  // Generate logs for each device
  const logs = [];
  devices.forEach(device => {
    const deviceLogs = generateDeviceLogs(device, 20);
    logs.push(...deviceLogs);
  });
  
  // Generate threat alerts
  const threats = generateThreatAlerts(devices, 15);
  
  return {
    devices,
    logs,
    threats
  };
};

// Export a singleton instance of the database
export const simulatedDatabase = generateAllData();

/**
 * Get all devices from the simulated database
 * @returns {Promise} Promise resolving to array of devices
 */
export const getDevices = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(simulatedDatabase.devices);
    }, 500); // Simulate network delay
  });
};

/**
 * Get a specific device by ID
 * @param {String} id - Device ID
 * @returns {Promise} Promise resolving to device object
 */
export const getDeviceById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const device = simulatedDatabase.devices.find(d => d.id === id);
      if (device) {
        resolve(device);
      } else {
        reject(new Error(`Device with ID ${id} not found`));
      }
    }, 300);
  });
};

/**
 * Get logs for a specific device
 * @param {String} deviceId - Device ID
 * @returns {Promise} Promise resolving to array of logs
 */
export const getDeviceLogs = (deviceId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const deviceLogs = simulatedDatabase.logs.filter(log => log.deviceId === deviceId);
      resolve(deviceLogs);
    }, 400);
  });
};

/**
 * Get all logs from the simulated database
 * @param {Object} filters - Optional filters for logs
 * @returns {Promise} Promise resolving to array of logs
 */
export const getLogs = (filters = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredLogs = [...simulatedDatabase.logs];
      
      // Apply filters if provided
      if (filters.deviceId) {
        filteredLogs = filteredLogs.filter(log => log.deviceId === filters.deviceId);
      }
      
      if (filters.type) {
        filteredLogs = filteredLogs.filter(log => log.type === filters.type);
      }
      
      if (filters.startDate && filters.endDate) {
        filteredLogs = filteredLogs.filter(log => {
          const logDate = new Date(log.timestamp);
          return logDate >= new Date(filters.startDate) && logDate <= new Date(filters.endDate);
        });
      }
      
      resolve(filteredLogs);
    }, 600);
  });
};

/**
 * Get all threat alerts from the simulated database
 * @param {Object} filters - Optional filters for threats
 * @returns {Promise} Promise resolving to array of threats
 */
export const getThreatAlerts = (filters = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredThreats = [...simulatedDatabase.threats];
      
      // Apply filters if provided
      if (filters.deviceId) {
        filteredThreats = filteredThreats.filter(threat => threat.deviceId === filters.deviceId);
      }
      
      if (filters.severity) {
        filteredThreats = filteredThreats.filter(threat => threat.severity === filters.severity);
      }
      
      if (filters.threatType) {
        filteredThreats = filteredThreats.filter(threat => threat.threatType === filters.threatType);
      }
      
      if (filters.status) {
        filteredThreats = filteredThreats.filter(threat => threat.status === filters.status);
      }
      
      if (filters.zone) {
        filteredThreats = filteredThreats.filter(threat => threat.deviceZone === filters.zone);
      }
      
      if (filters.startDate && filters.endDate) {
        filteredThreats = filteredThreats.filter(threat => {
          const threatDate = new Date(threat.detectionTime);
          return threatDate >= new Date(filters.startDate) && threatDate <= new Date(filters.endDate);
        });
      }
      
      resolve(filteredThreats);
    }, 700);
  });
};

/**
 * Get a specific threat alert by ID
 * @param {String} id - Threat ID
 * @returns {Promise} Promise resolving to threat object
 */
export const getThreatById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const threat = simulatedDatabase.threats.find(t => t.id === id);
      if (threat) {
        resolve(threat);
      } else {
        reject(new Error(`Threat with ID ${id} not found`));
      }
    }, 300);
  });
};

/**
 * Get threat statistics for dashboard
 * @returns {Promise} Promise resolving to threat statistics
 */
export const getThreatStatistics = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const threats = simulatedDatabase.threats;
      
      // Count threats by severity
      const severityCounts = {
        [SEVERITY.LOW]: 0,
        [SEVERITY.MEDIUM]: 0,
        [SEVERITY.HIGH]: 0,
        [SEVERITY.CRITICAL]: 0
      };
      
      threats.forEach(threat => {
        severityCounts[threat.severity]++;
      });
      
      // Count threats by type
      const typeCounts = {};
      Object.values(THREAT_TYPES).forEach(type => {
        typeCounts[type] = 0;
      });
      
      threats.forEach(threat => {
        typeCounts[threat.threatType]++;
      });
      
      // Count threats by status
      const statusCounts = {};
      Object.values(THREAT_STATUS).forEach(status => {
        statusCounts[status] = 0;
      });
      
      threats.forEach(threat => {
        statusCounts[threat.status]++;
      });
      
      // Count threats by zone
      const zoneCounts = {};
      Object.values(CITY_ZONES).forEach(zone => {
        zoneCounts[zone] = 0;
      });
      
      threats.forEach(threat => {
        zoneCounts[threat.deviceZone]++;
      });
      
      // Calculate threat trend (last 7 days)
      const now = new Date();
      const trendData = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        const dayThreats = threats.filter(threat => {
          const threatDate = new Date(threat.detectionTime).toISOString().split('T')[0];
          return threatDate === dateString;
        });
        
        trendData.push({
          date: dateString,
          count: dayThreats.length,
          critical: dayThreats.filter(t => t.severity === SEVERITY.CRITICAL).length,
          high: dayThreats.filter(t => t.severity === SEVERITY.HIGH).length,
          medium: dayThreats.filter(t => t.severity === SEVERITY.MEDIUM).length,
          low: dayThreats.filter(t => t.severity === SEVERITY.LOW).length
        });
      }
      
      resolve({
        total: threats.length,
        active: threats.filter(t => t.status !== THREAT_STATUS.RESOLVED && t.status !== THREAT_STATUS.FALSE_POSITIVE).length,
        critical: severityCounts[SEVERITY.CRITICAL],
        high: severityCounts[SEVERITY.HIGH],
        medium: severityCounts[SEVERITY.MEDIUM],
        low: severityCounts[SEVERITY.LOW],
        byType: typeCounts,
        byStatus: statusCounts,
        byZone: zoneCounts,
        trend: trendData
      });
    }, 800);
  });
};

/**
 * Get device statistics for dashboard
 * @returns {Promise} Promise resolving to device statistics
 */
export const getDeviceStatistics = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const devices = simulatedDatabase.devices;
      
      // Count devices by type
      const typeCounts = {};
      Object.values(DEVICE_TYPES).forEach(type => {
        typeCounts[type] = 0;
      });
      
      devices.forEach(device => {
        typeCounts[device.type]++;
      });
      
      // Count devices by status
      const statusCounts = {};
      Object.values(DEVICE_STATUS).forEach(status => {
        statusCounts[status] = 0;
      });
      
      devices.forEach(device => {
        statusCounts[device.status]++;
      });
      
      // Count devices by zone
      const zoneCounts = {};
      Object.values(CITY_ZONES).forEach(zone => {
        zoneCounts[zone] = 0;
      });
      
      devices.forEach(device => {
        zoneCounts[device.zone]++;
      });
      
      resolve({
        total: devices.length,
        online: devices.filter(d => d.status === DEVICE_STATUS.ONLINE).length,
        offline: devices.filter(d => d.status === DEVICE_STATUS.OFFLINE).length,
        maintenance: devices.filter(d => d.status === DEVICE_STATUS.MAINTENANCE).length,
        warning: devices.filter(d => d.status === DEVICE_STATUS.WARNING).length,
        critical: devices.filter(d => d.status === DEVICE_STATUS.CRITICAL).length,
        byType: typeCounts,
        byStatus: statusCounts,
        byZone: zoneCounts
      });
    }, 600);
  });
};