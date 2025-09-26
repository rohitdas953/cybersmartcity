/**
 * Demo Data Generator for Smart City Security Operations Center
 * 
 * This module provides functions to generate realistic demo data for the
 * presentation of the Smart City Security Operations Center application.
 * It creates simulated security incidents, device activities, and attack patterns
 * that demonstrate the capabilities of the system.
 */

import { THREAT_TYPES, SEVERITY } from '../utils/threatDetection';
import { RESPONSE_PHASES, RESPONSE_TEAMS } from '../utils/incidentResponse';
import { generateDevices, generateRandomLogs, generateThreatAlerts } from './simulatedDatabase';

// Time constants
const HOUR = 3600000;
const DAY = 24 * HOUR;

/**
 * Generate a timeline of security events for the demo
 * @param {Number} duration - Duration of the demo in milliseconds
 * @param {Date} startTime - Start time of the demo
 * @returns {Array} Array of timeline events
 */
export const generateDemoTimeline = (duration = DAY, startTime = new Date()) => {
  const timeline = [];
  const endTime = new Date(startTime.getTime() + duration);
  
  // Generate a series of events throughout the timeline
  const numEvents = Math.floor(duration / (HOUR * 2)) + 5; // Approximately one event every 2 hours, plus 5 extra
  
  for (let i = 0; i < numEvents; i++) {
    const eventTime = new Date(startTime.getTime() + Math.random() * duration);
    
    // Determine event type based on probability
    const eventTypeProbability = Math.random();
    let eventType;
    
    if (eventTypeProbability < 0.4) {
      // 40% chance of suspicious activity
      eventType = 'suspicious_activity';
    } else if (eventTypeProbability < 0.7) {
      // 30% chance of attack attempt
      eventType = 'attack_attempt';
    } else if (eventTypeProbability < 0.9) {
      // 20% chance of system alert
      eventType = 'system_alert';
    } else {
      // 10% chance of major incident
      eventType = 'major_incident';
    }
    
    // Create the event
    const event = {
      id: `event-${i + 1}`,
      timestamp: eventTime,
      type: eventType,
      details: generateEventDetails(eventType, eventTime)
    };
    
    timeline.push(event);
  }
  
  // Sort timeline by timestamp
  timeline.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  
  return timeline;
};

/**
 * Generate details for a specific event type
 * @param {String} eventType - Type of event
 * @param {Date} timestamp - Time of the event
 * @returns {Object} Event details
 */
const generateEventDetails = (eventType, timestamp) => {
  switch (eventType) {
    case 'suspicious_activity':
      return generateSuspiciousActivity(timestamp);
    case 'attack_attempt':
      return generateAttackAttempt(timestamp);
    case 'system_alert':
      return generateSystemAlert(timestamp);
    case 'major_incident':
      return generateMajorIncident(timestamp);
    default:
      return {};
  }
};

/**
 * Generate suspicious activity event details
 * @param {Date} timestamp - Time of the event
 * @returns {Object} Suspicious activity details
 */
const generateSuspiciousActivity = (timestamp) => {
  const devices = generateDevices(1);
  const device = devices[0];
  
  const activities = [
    'Unusual login pattern detected',
    'Unexpected configuration change',
    'Abnormal network traffic',
    'Unusual data access pattern',
    'Unexpected service restart',
    'Unusual resource usage spike',
    'Unexpected firmware update attempt',
    'Abnormal API call pattern',
    'Unusual database query pattern',
    'Unexpected user privilege escalation'
  ];
  
  const activity = activities[Math.floor(Math.random() * activities.length)];
  
  return {
    title: activity,
    description: `${activity} on device ${device.name} (${device.id}) in ${device.zone}.`,
    device,
    severity: SEVERITY.LOW,
    confidence: Math.floor(Math.random() * 40) + 30, // 30-70% confidence
    recommendedActions: [
      'Monitor device for continued suspicious activity',
      'Review device logs for additional context',
      'Check for recent configuration changes'
    ]
  };
};

/**
 * Generate attack attempt event details
 * @param {Date} timestamp - Time of the event
 * @returns {Object} Attack attempt details
 */
const generateAttackAttempt = (timestamp) => {
  const devices = generateDevices(1);
  const device = devices[0];
  
  const attackTypes = [
    { type: THREAT_TYPES.BRUTE_FORCE, name: 'Brute Force Attack' },
    { type: THREAT_TYPES.DDOS, name: 'DDoS Attack' },
    { type: THREAT_TYPES.MALWARE, name: 'Malware Infection Attempt' },
    { type: THREAT_TYPES.PHISHING, name: 'Phishing Attempt' },
    { type: THREAT_TYPES.SQL_INJECTION, name: 'SQL Injection Attempt' },
    { type: THREAT_TYPES.XSS, name: 'Cross-Site Scripting Attempt' },
    { type: THREAT_TYPES.MAN_IN_THE_MIDDLE, name: 'Man-in-the-Middle Attack' },
    { type: THREAT_TYPES.RANSOMWARE, name: 'Ransomware Attack' }
  ];
  
  const attack = attackTypes[Math.floor(Math.random() * attackTypes.length)];
  
  const sources = [
    { ip: '45.227.253.' + Math.floor(Math.random() * 255), country: 'Russia' },
    { ip: '121.18.238.' + Math.floor(Math.random() * 255), country: 'China' },
    { ip: '195.154.119.' + Math.floor(Math.random() * 255), country: 'Ukraine' },
    { ip: '185.156.73.' + Math.floor(Math.random() * 255), country: 'Iran' },
    { ip: '94.102.49.' + Math.floor(Math.random() * 255), country: 'Netherlands' },
    { ip: '185.220.101.' + Math.floor(Math.random() * 255), country: 'Germany' },
    { ip: '171.25.193.' + Math.floor(Math.random() * 255), country: 'Romania' },
    { ip: '109.237.103.' + Math.floor(Math.random() * 255), country: 'Bulgaria' }
  ];
  
  const source = sources[Math.floor(Math.random() * sources.length)];
  
  return {
    title: `${attack.name} Detected`,
    description: `${attack.name} targeting device ${device.name} (${device.id}) in ${device.zone} from IP ${source.ip} (${source.country}).`,
    device,
    threatType: attack.type,
    source,
    severity: SEVERITY.MEDIUM,
    confidence: Math.floor(Math.random() * 20) + 70, // 70-90% confidence
    recommendedActions: [
      'Block source IP address',
      'Update firewall rules',
      'Scan device for vulnerabilities',
      'Review device logs for indicators of compromise'
    ],
    affectedSystems: [
      { name: device.name, type: device.type, impact: 'Potential data breach' },
      { name: 'Network Segment ' + device.zone, type: 'Network', impact: 'Increased traffic' }
    ]
  };
};

/**
 * Generate system alert event details
 * @param {Date} timestamp - Time of the event
 * @returns {Object} System alert details
 */
const generateSystemAlert = (timestamp) => {
  const devices = generateDevices(1);
  const device = devices[0];
  
  const alertTypes = [
    'System Resource Depletion',
    'Service Unavailable',
    'Configuration Error',
    'Certificate Expiration',
    'Software Update Available',
    'Hardware Failure Warning',
    'Backup Failure',
    'Storage Capacity Warning',
    'Network Connectivity Issue',
    'API Rate Limit Exceeded'
  ];
  
  const alert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
  
  return {
    title: alert,
    description: `${alert} detected on device ${device.name} (${device.id}) in ${device.zone}.`,
    device,
    severity: SEVERITY.MEDIUM,
    systemComponent: device.type,
    status: Math.random() > 0.3 ? 'Active' : 'Resolved',
    recommendedActions: [
      'Check system resources',
      'Verify configuration settings',
      'Restart affected services',
      'Apply available updates'
    ]
  };
};

/**
 * Generate major incident event details
 * @param {Date} timestamp - Time of the event
 * @returns {Object} Major incident details
 */
const generateMajorIncident = (timestamp) => {
  const devices = generateDevices(Math.floor(Math.random() * 3) + 2); // 2-4 devices
  const primaryDevice = devices[0];
  
  const incidentTypes = [
    { type: THREAT_TYPES.RANSOMWARE, name: 'Ransomware Attack' },
    { type: THREAT_TYPES.ADVANCED_PERSISTENT_THREAT, name: 'Advanced Persistent Threat' },
    { type: THREAT_TYPES.DATA_BREACH, name: 'Data Breach' },
    { type: THREAT_TYPES.DDOS, name: 'Major DDoS Attack' },
    { type: THREAT_TYPES.INSIDER_THREAT, name: 'Insider Threat' }
  ];
  
  const incident = incidentTypes[Math.floor(Math.random() * incidentTypes.length)];
  
  // Generate affected systems
  const affectedSystems = devices.map(device => ({
    name: device.name,
    type: device.type,
    impact: generateSystemImpact(incident.type)
  }));
  
  // Add network infrastructure
  affectedSystems.push({
    name: 'Network Segment ' + primaryDevice.zone,
    type: 'Network',
    impact: 'Degraded performance'
  });
  
  // Generate response team assignments
  const responseTeams = [];
  const availableTeams = [...Object.values(RESPONSE_TEAMS)];
  
  // Assign 2-3 teams
  const numTeams = Math.floor(Math.random() * 2) + 2;
  for (let i = 0; i < numTeams; i++) {
    if (availableTeams.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableTeams.length);
      responseTeams.push(availableTeams[randomIndex]);
      availableTeams.splice(randomIndex, 1);
    }
  }
  
  return {
    title: incident.name,
    description: `${incident.name} affecting multiple systems in ${primaryDevice.zone}. Incident response teams have been activated.`,
    devices,
    threatType: incident.type,
    severity: SEVERITY.HIGH,
    confidence: Math.floor(Math.random() * 10) + 90, // 90-100% confidence
    responsePhase: RESPONSE_PHASES.CONTAINMENT,
    responseTeams,
    affectedSystems,
    estimatedImpact: {
      operational: Math.floor(Math.random() * 40) + 60, // 60-100%
      financial: `$${(Math.floor(Math.random() * 900) + 100).toLocaleString()}K`,
      reputational: Math.floor(Math.random() * 40) + 60 // 60-100%
    },
    recommendedActions: [
      'Isolate affected systems',
      'Deploy countermeasures',
      'Activate incident response plan',
      'Notify stakeholders',
      'Prepare for system recovery'
    ]
  };
};

/**
 * Generate system impact description based on threat type
 * @param {String} threatType - Type of threat
 * @returns {String} Impact description
 */
const generateSystemImpact = (threatType) => {
  const impacts = {
    [THREAT_TYPES.RANSOMWARE]: [
      'Encrypted file system',
      'Services unavailable',
      'Data inaccessible'
    ],
    [THREAT_TYPES.ADVANCED_PERSISTENT_THREAT]: [
      'Unauthorized access',
      'Data exfiltration',
      'Backdoor installed',
      'Compromised credentials'
    ],
    [THREAT_TYPES.DATA_BREACH]: [
      'Sensitive data exposed',
      'Unauthorized data access',
      'Data integrity compromised'
    ],
    [THREAT_TYPES.DDOS]: [
      'Service unavailable',
      'Network congestion',
      'Degraded performance',
      'Resource exhaustion'
    ],
    [THREAT_TYPES.INSIDER_THREAT]: [
      'Unauthorized configuration changes',
      'Data manipulation',
      'Privilege escalation',
      'Sabotage'
    ]
  };
  
  const threatImpacts = impacts[threatType] || [
    'System compromised',
    'Service disruption',
    'Data at risk'
  ];
  
  return threatImpacts[Math.floor(Math.random() * threatImpacts.length)];
};

/**
 * Generate a series of attack stages for a demonstration
 * @param {Number} numStages - Number of attack stages to generate
 * @returns {Array} Array of attack stages
 */
export const generateAttackScenario = (numStages = 5) => {
  const devices = generateDevices(Math.floor(Math.random() * 5) + 5); // 5-10 devices
  
  // Define the attack stages
  const attackStages = [
    {
      name: 'Reconnaissance',
      description: 'Attacker is scanning the network to identify potential targets',
      devices: devices.slice(0, 2),
      duration: 120, // seconds
      animations: ['network-scan', 'data-flow'],
      alerts: [
        { type: 'warning', message: 'Unusual port scanning detected' },
        { type: 'info', message: 'Network mapping attempt identified' }
      ]
    },
    {
      name: 'Initial Access',
      description: 'Attacker has gained access to an edge device through a vulnerability',
      devices: devices.slice(1, 3),
      duration: 90,
      animations: ['attack-detected', 'device-compromise'],
      alerts: [
        { type: 'warning', message: 'Brute force authentication attempt detected' },
        { type: 'danger', message: 'Unauthorized access to edge device' }
      ]
    },
    {
      name: 'Lateral Movement',
      description: 'Attacker is moving through the network to access additional systems',
      devices: devices.slice(2, 5),
      duration: 150,
      animations: ['lateral-movement', 'connection-terminated'],
      alerts: [
        { type: 'danger', message: 'Unusual authentication pattern between devices' },
        { type: 'warning', message: 'Unexpected privileged account usage' }
      ]
    },
    {
      name: 'Data Exfiltration',
      description: 'Attacker is extracting sensitive data from compromised systems',
      devices: devices.slice(3, 6),
      duration: 180,
      animations: ['data-exfiltration', 'alert-notification'],
      alerts: [
        { type: 'danger', message: 'Unusual outbound data transfer detected' },
        { type: 'danger', message: 'Sensitive data access from compromised account' }
      ]
    },
    {
      name: 'Impact',
      description: 'Attacker is causing disruption to critical systems',
      devices: devices.slice(4, 8),
      duration: 120,
      animations: ['malware-spread', 'system-recovery'],
      alerts: [
        { type: 'danger', message: 'Critical service disruption detected' },
        { type: 'danger', message: 'Multiple system failures reported' }
      ]
    },
    {
      name: 'Containment',
      description: 'Security teams are isolating affected systems and blocking the attack',
      devices: devices.slice(2, 7),
      duration: 210,
      animations: ['threat-contained', 'connection-terminated'],
      alerts: [
        { type: 'warning', message: 'Isolating compromised systems' },
        { type: 'success', message: 'Attack vector identified and blocked' }
      ]
    },
    {
      name: 'Eradication',
      description: 'Removing malware and attacker access from all systems',
      devices: devices.slice(1, 6),
      duration: 180,
      animations: ['system-recovery', 'threat-contained'],
      alerts: [
        { type: 'info', message: 'Malware removal in progress' },
        { type: 'success', message: 'System integrity restored' }
      ]
    },
    {
      name: 'Recovery',
      description: 'Restoring systems to normal operation and implementing additional safeguards',
      devices: devices.slice(0, 8),
      duration: 150,
      animations: ['system-recovery', 'alert-notification'],
      alerts: [
        { type: 'info', message: 'Service restoration in progress' },
        { type: 'success', message: 'Enhanced security measures deployed' }
      ]
    }
  ];
  
  // Select a subset of stages if requested
  return attackStages.slice(0, Math.min(numStages, attackStages.length));
};

/**
 * Generate statistics for the dashboard
 * @returns {Object} Dashboard statistics
 */
export const generateDashboardStats = () => {
  return {
    activeThreats: Math.floor(Math.random() * 5) + 1,
    resolvedIncidents: Math.floor(Math.random() * 50) + 150,
    vulnerableDevices: Math.floor(Math.random() * 10) + 5,
    securityScore: Math.floor(Math.random() * 15) + 75, // 75-90%
    threatDistribution: {
      [THREAT_TYPES.MALWARE]: Math.floor(Math.random() * 20) + 20,
      [THREAT_TYPES.PHISHING]: Math.floor(Math.random() * 15) + 15,
      [THREAT_TYPES.DDOS]: Math.floor(Math.random() * 10) + 5,
      [THREAT_TYPES.BRUTE_FORCE]: Math.floor(Math.random() * 15) + 10,
      [THREAT_TYPES.SQL_INJECTION]: Math.floor(Math.random() * 10) + 5,
      [THREAT_TYPES.XSS]: Math.floor(Math.random() * 10) + 5,
      [THREAT_TYPES.RANSOMWARE]: Math.floor(Math.random() * 5) + 3,
      [THREAT_TYPES.OTHER]: Math.floor(Math.random() * 10) + 5
    },
    severityDistribution: {
      [SEVERITY.LOW]: Math.floor(Math.random() * 20) + 40,
      [SEVERITY.MEDIUM]: Math.floor(Math.random() * 20) + 30,
      [SEVERITY.HIGH]: Math.floor(Math.random() * 10) + 10,
      [SEVERITY.CRITICAL]: Math.floor(Math.random() * 5) + 5
    },
    timeToDetect: Math.floor(Math.random() * 30) + 30, // 30-60 minutes
    timeToRespond: Math.floor(Math.random() * 45) + 45, // 45-90 minutes
    timeToResolve: Math.floor(Math.random() * 120) + 120, // 120-240 minutes
    deviceSecurityStatus: {
      secure: Math.floor(Math.random() * 20) + 70, // 70-90%
      atrisk: Math.floor(Math.random() * 10) + 5, // 5-15%
      compromised: Math.floor(Math.random() * 5) + 1, // 1-6%
      unknown: Math.floor(Math.random() * 5) + 1 // 1-6%
    },
    recentActivities: generateRecentActivities(10)
  };
};

/**
 * Generate recent security activities
 * @param {Number} count - Number of activities to generate
 * @returns {Array} Array of recent activities
 */
const generateRecentActivities = (count = 10) => {
  const activities = [];
  const now = new Date();
  
  const activityTypes = [
    'Threat detected',
    'Alert triggered',
    'Incident created',
    'Incident resolved',
    'System patched',
    'Vulnerability fixed',
    'Policy updated',
    'User access changed',
    'Backup completed',
    'Security scan completed'
  ];
  
  for (let i = 0; i < count; i++) {
    const activityTime = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000); // Within last 24 hours
    const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    
    activities.push({
      id: `activity-${i + 1}`,
      type: activityType,
      timestamp: activityTime,
      details: generateActivityDetails(activityType),
      severity: generateActivitySeverity(activityType)
    });
  }
  
  // Sort by timestamp (newest first)
  activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  return activities;
};

/**
 * Generate details for an activity
 * @param {String} activityType - Type of activity
 * @returns {String} Activity details
 */
const generateActivityDetails = (activityType) => {
  const devices = generateDevices(1);
  const device = devices[0];
  
  switch (activityType) {
    case 'Threat detected':
      return `${THREAT_TYPES.MALWARE} detected on ${device.name} in ${device.zone}`;
    case 'Alert triggered':
      return `Unusual network traffic detected in ${device.zone}`;
    case 'Incident created':
      return `New security incident opened for ${device.zone}`;
    case 'Incident resolved':
      return `Security incident in ${device.zone} marked as resolved`;
    case 'System patched':
      return `Security patch applied to ${device.name}`;
    case 'Vulnerability fixed':
      return `Critical vulnerability addressed on ${device.name}`;
    case 'Policy updated':
      return `Security policy updated for ${device.zone} devices`;
    case 'User access changed':
      return `Access permissions modified for ${device.zone} systems`;
    case 'Backup completed':
      return `Scheduled backup completed for ${device.zone} systems`;
    case 'Security scan completed':
      return `Security scan completed for ${device.zone}`;
    default:
      return `Activity related to ${device.name} in ${device.zone}`;
  }
};

/**
 * Generate severity for an activity
 * @param {String} activityType - Type of activity
 * @returns {String} Activity severity
 */
const generateActivitySeverity = (activityType) => {
  switch (activityType) {
    case 'Threat detected':
    case 'Incident created':
      return Math.random() > 0.5 ? SEVERITY.HIGH : SEVERITY.MEDIUM;
    case 'Alert triggered':
    case 'Vulnerability fixed':
      return Math.random() > 0.7 ? SEVERITY.MEDIUM : SEVERITY.LOW;
    case 'Incident resolved':
    case 'System patched':
    case 'Policy updated':
    case 'User access changed':
    case 'Backup completed':
    case 'Security scan completed':
      return SEVERITY.LOW;
    default:
      return SEVERITY.LOW;
  }
};

/**
 * Generate a map of device connections for network visualization
 * @param {Array} devices - Array of devices
 * @returns {Array} Array of connections between devices
 */
export const generateDeviceConnections = (devices) => {
  const connections = [];
  
  // Group devices by zone
  const devicesByZone = {};
  devices.forEach(device => {
    if (!devicesByZone[device.zone]) {
      devicesByZone[device.zone] = [];
    }
    devicesByZone[device.zone].push(device);
  });
  
  // Connect devices within the same zone
  Object.values(devicesByZone).forEach(zoneDevices => {
    if (zoneDevices.length > 1) {
      // Connect each device to 1-3 other devices in the same zone
      zoneDevices.forEach(device => {
        const numConnections = Math.floor(Math.random() * 3) + 1;
        const otherDevices = zoneDevices.filter(d => d.id !== device.id);
        
        for (let i = 0; i < Math.min(numConnections, otherDevices.length); i++) {
          const randomIndex = Math.floor(Math.random() * otherDevices.length);
          const targetDevice = otherDevices[randomIndex];
          
          // Avoid duplicate connections
          const connectionExists = connections.some(conn => 
            (conn.source === device.id && conn.target === targetDevice.id) ||
            (conn.source === targetDevice.id && conn.target === device.id)
          );
          
          if (!connectionExists) {
            connections.push({
              source: device.id,
              target: targetDevice.id,
              type: 'intra-zone',
              status: Math.random() > 0.9 ? 'degraded' : 'normal',
              traffic: Math.floor(Math.random() * 100) + 1 // 1-100 Mbps
            });
          }
          
          // Remove the device to avoid connecting to it again
          otherDevices.splice(randomIndex, 1);
        }
      });
    }
  });
  
  // Connect zones to each other through gateway devices
  const zones = Object.keys(devicesByZone);
  if (zones.length > 1) {
    for (let i = 0; i < zones.length; i++) {
      const sourceZone = zones[i];
      const sourceDevices = devicesByZone[sourceZone];
      
      // Find a gateway device in the source zone
      const sourceGateway = sourceDevices.find(d => d.type === 'gateway' || d.type === 'router') || 
                           sourceDevices[Math.floor(Math.random() * sourceDevices.length)];
      
      // Connect to 1-2 other zones
      const numZoneConnections = Math.floor(Math.random() * 2) + 1;
      for (let j = 0; j < Math.min(numZoneConnections, zones.length - 1); j++) {
        const targetZoneIndex = (i + j + 1) % zones.length;
        const targetZone = zones[targetZoneIndex];
        const targetDevices = devicesByZone[targetZone];
        
        // Find a gateway device in the target zone
        const targetGateway = targetDevices.find(d => d.type === 'gateway' || d.type === 'router') || 
                             targetDevices[Math.floor(Math.random() * targetDevices.length)];
        
        // Create the connection
        connections.push({
          source: sourceGateway.id,
          target: targetGateway.id,
          type: 'inter-zone',
          status: Math.random() > 0.8 ? 'degraded' : 'normal',
          traffic: Math.floor(Math.random() * 200) + 50 // 50-250 Mbps
        });
      }
    }
  }
  
  return connections;
};

/**
 * Initialize the demo data
 * @returns {Object} Complete set of demo data
 */
export const initializeDemoData = () => {
  // Generate devices
  const devices = generateDevices(30);
  
  // Generate device logs
  const logs = generateRandomLogs(devices, 100);
  
  // Generate threat alerts
  const alerts = generateThreatAlerts(devices, 20);
  
  // Generate device connections
  const connections = generateDeviceConnections(devices);
  
  // Generate timeline
  const timeline = generateDemoTimeline();
  
  // Generate attack scenario
  const attackScenario = generateAttackScenario();
  
  // Generate dashboard stats
  const dashboardStats = generateDashboardStats();
  
  return {
    devices,
    logs,
    alerts,
    connections,
    timeline,
    attackScenario,
    dashboardStats
  };
};

// Export a pre-initialized set of demo data
export const demoData = initializeDemoData();