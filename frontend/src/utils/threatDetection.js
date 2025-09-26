/**
 * AI Threat Detection Engine Simulation
 * 
 * This module simulates an AI-powered threat detection system for a smart city
 * security operations center. It includes functions for analyzing device behavior,
 * detecting anomalies, classifying threats, and generating alerts.
 */

// Threat severity levels
export const SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Threat types
export const THREAT_TYPES = {
  UNAUTHORIZED_ACCESS: 'Unauthorized Access',
  DATA_MANIPULATION: 'Data Manipulation',
  DENIAL_OF_SERVICE: 'Denial of Service',
  MALWARE: 'Malware Infection',
  RANSOMWARE: 'Ransomware',
  FIRMWARE_TAMPERING: 'Firmware Tampering',
  COMMUNICATION_HIJACKING: 'Communication Hijacking',
  CREDENTIAL_THEFT: 'Credential Theft',
  PHYSICAL_TAMPERING: 'Physical Tampering',
  SOCIAL_ENGINEERING: 'Social Engineering'
};

// Threat status
export const THREAT_STATUS = {
  NEW: 'new',
  INVESTIGATING: 'investigating',
  MITIGATING: 'mitigating',
  RESOLVED: 'resolved',
  FALSE_POSITIVE: 'false_positive',
  DETECTED: 'detected',
  ANALYZING: 'analyzing',
  CONTAINED: 'contained',
  MITIGATED: 'mitigated'
};

/**
 * Analyzes device behavior to detect anomalies
 * @param {Object} device - The device to analyze
 * @param {Array} historicalData - Historical behavior data for comparison
 * @returns {Object} Analysis results with anomaly score and detected patterns
 */
export const analyzeDeviceBehavior = (device, historicalData = []) => {
  // In a real system, this would use machine learning models to analyze patterns
  // For simulation, we'll generate random anomaly scores
  
  const anomalyScore = Math.random();
  const patterns = [];
  
  // Simulate detecting different patterns based on device type and anomaly score
  if (device.type === 'camera' && anomalyScore > 0.7) {
    patterns.push('Unusual access pattern');
    patterns.push('Irregular data transmission');
  } else if (device.type === 'trafficLight' && anomalyScore > 0.8) {
    patterns.push('Signal timing manipulation');
    patterns.push('Unexpected configuration changes');
  } else if (device.type === 'waterSensor' && anomalyScore > 0.75) {
    patterns.push('Reading fluctuation outside normal parameters');
    patterns.push('Calibration drift');
  } else if (anomalyScore > 0.9) {
    patterns.push('Communication protocol violation');
    patterns.push('Unexpected firmware behavior');
  }
  
  return {
    deviceId: device.id,
    anomalyScore,
    patterns,
    timestamp: new Date().toISOString(),
    isAnomaly: anomalyScore > 0.7
  };
};

/**
 * Classifies a threat based on type, severity, and behavior
 * @param {String} threatType - The type of threat
 * @param {String} severity - The severity level
 * @param {Object} behavior - Behavior analysis data
 * @returns {Object} Classified threat with details and recommendations
 */
export const classifyThreat = (threatType, severity, behavior) => {
  // Default values
  let confidence = 0.7;
  let impactLevel = 'moderate';
  let recommendedActions = [];
  let description = '';
  
  // Adjust confidence based on behavior anomaly score if available
  if (behavior && behavior.anomalyScore) {
    confidence = 0.5 + (behavior.anomalyScore * 0.4); // Scale between 0.5 and 0.9
  }
  
  // Set impact level based on severity
  switch (severity) {
    case SEVERITY.CRITICAL:
      impactLevel = 'severe';
      break;
    case SEVERITY.HIGH:
      impactLevel = 'significant';
      break;
    case SEVERITY.MEDIUM:
      impactLevel = 'moderate';
      break;
    case SEVERITY.LOW:
      impactLevel = 'minor';
      break;
    default:
      impactLevel = 'unknown';
  }
  
  // Generate description and recommended actions based on threat type
  switch (threatType) {
    case THREAT_TYPES.UNAUTHORIZED_ACCESS:
      description = 'Unauthorized access attempt detected with unusual authentication patterns';
      recommendedActions = [
        'Lock affected accounts',
        'Force password reset',
        'Review access logs',
        'Enable additional authentication factors'
      ];
      break;
    case THREAT_TYPES.DATA_MANIPULATION:
      description = 'Abnormal data modification detected outside of expected parameters';
      recommendedActions = [
        'Restore from backup',
        'Verify data integrity',
        'Audit recent changes',
        'Implement additional validation checks'
      ];
      break;
    case THREAT_TYPES.FIRMWARE_TAMPERING:
       description = 'Unauthorized firmware modifications or configuration changes detected';
       recommendedActions = [
         'Restore original firmware',
         'Isolate affected device',
         'Scan for malicious code',
         'Update security patches'
       ];
       break;
     case THREAT_TYPES.COMMUNICATION_HIJACKING:
       description = 'Abnormal communication patterns indicating potential hijacking';
       recommendedActions = [
         'Isolate affected systems',
         'Reset communication channels',
         'Implement additional encryption',
         'Monitor for unusual traffic patterns'
       ];
       break;
     case THREAT_TYPES.MALWARE:
       description = 'Malicious software detected with abnormal system behavior';
       recommendedActions = [
         'Isolate affected systems',
         'Run full system scan',
         'Remove identified malware',
         'Update antivirus definitions'
       ];
       break;
     case THREAT_TYPES.RANSOMWARE:
       description = 'Potential ransomware activity with file encryption patterns';
       recommendedActions = [
         'Disconnect from network immediately',
         'Isolate affected systems',
         'Restore from clean backups',
         'Report to authorities'
       ];
       break;
     case THREAT_TYPES.DENIAL_OF_SERVICE:
       description = 'Abnormal traffic patterns indicating potential DoS attack';
       recommendedActions = [
         'Implement traffic filtering',
         'Scale resources if possible',
         'Contact network provider',
         'Analyze traffic patterns'
       ];
       break;
     case THREAT_TYPES.CREDENTIAL_THEFT:
       description = 'Suspicious authentication attempts indicating credential theft';
       recommendedActions = [
         'Force password reset',
         'Enable multi-factor authentication',
         'Review access logs',
         'Monitor for unusual account activity'
       ];
       break;
     default:
       description = 'Unknown threat type detected with suspicious behavior';
       recommendedActions = [
         'Monitor system activity',
         'Backup critical data',
         'Review security logs',
         'Prepare for escalation if needed'
       ];
   }
   
   return {
     type: threatType,
     severity,
     confidence,
     impactLevel,
     description,
     recommendedActions,
     timestamp: new Date().toISOString(),
     status: THREAT_STATUS.DETECTED
   };
};

/**
 * Generates a detailed threat alert based on classification
 * @param {Object} device - The affected device
 * @param {Object} threatData - The classified threat data
 * @returns {Object} Complete threat alert with recommendations
 */
export const generateThreatAlert = (device, threatData) => {
  const { threatType, severity, confidence } = threatData;
  
  // Generate a unique ID for the incident
  const incidentId = `INC-${Date.now().toString(36).toUpperCase()}`;
  
  // Generate description based on threat type and device
  let description = `Potential ${threatType} detected on ${device.name} (${device.type})`;
  if (confidence > 0.8) {
    description += ` with high confidence (${(confidence * 100).toFixed(0)}%).`;
  } else if (confidence > 0.6) {
    description += ` with moderate confidence (${(confidence * 100).toFixed(0)}%).`;
  } else {
    description += ` with low confidence (${(confidence * 100).toFixed(0)}%).`;
  }
  
  // Generate recommended actions based on threat type and severity
  const recommendedActions = generateRecommendedActions(threatType, severity, device);
  
  // Calculate risk score based on severity and confidence
  let riskScore = 0;
  switch (severity) {
    case SEVERITY.CRITICAL:
      riskScore = 90 + Math.floor(Math.random() * 10); // 90-99
      break;
    case SEVERITY.HIGH:
      riskScore = 70 + Math.floor(Math.random() * 20); // 70-89
      break;
    case SEVERITY.MEDIUM:
      riskScore = 40 + Math.floor(Math.random() * 30); // 40-69
      break;
    case SEVERITY.LOW:
      riskScore = 10 + Math.floor(Math.random() * 30); // 10-39
      break;
    default:
      riskScore = 5 + Math.floor(Math.random() * 15); // 5-19
  }
  
  // Adjust risk score based on confidence
  riskScore = Math.min(99, riskScore + (confidence * 10));
  
  return {
    id: incidentId,
    deviceId: device.id,
    deviceName: device.name,
    deviceType: device.type,
    threatType,
    severity,
    confidence,
    description,
    timestamp: new Date().toISOString(),
    status: THREAT_STATUS.NEW,
    recommendedActions,
    affectedSystems: determineAffectedSystems(device, threatType),
    potentialImpact: determinePotentialImpact(severity, device.type),
    riskScore,
    mitigationStatus: 'pending',
    assignedTo: null,
    relatedAlerts: []
  };
};

/**
 * Determines other systems that might be affected by the threat
 * @param {Object} device - The affected device
 * @param {String} threatType - The type of threat
 * @returns {Array} List of potentially affected systems
 */
const determineAffectedSystems = (device, threatType) => {
  const affectedSystems = [];
  
  // In a real system, this would use a graph database or network topology map
  // For simulation, we'll use predefined relationships
  if (device.type === 'trafficLight') {
    affectedSystems.push('Traffic Management System');
    if (threatType === THREAT_TYPES.COMMUNICATION_HIJACKING) {
      affectedSystems.push('Emergency Vehicle Routing');
    }
  } else if (device.type === 'camera') {
    affectedSystems.push('Video Surveillance Network');
    if (threatType === THREAT_TYPES.UNAUTHORIZED_ACCESS) {
      affectedSystems.push('Facial Recognition System');
    }
  } else if (device.type === 'waterSensor') {
    affectedSystems.push('Water Quality Monitoring');
    if (threatType === THREAT_TYPES.DATA_MANIPULATION) {
      affectedSystems.push('Public Health Alert System');
    }
  }
  
  // Add general systems for certain threat types
  if (threatType === THREAT_TYPES.MALWARE || threatType === THREAT_TYPES.RANSOMWARE) {
    affectedSystems.push('City Network Infrastructure');
  }
  
  return affectedSystems;
};

/**
 * Determines the potential impact of a threat based on severity and device type
 * @param {String} severity - The threat severity
 * @param {String} deviceType - The type of affected device
 * @returns {String} Description of potential impact
 */
const determinePotentialImpact = (severity, deviceType) => {
  if (severity === SEVERITY.CRITICAL) {
    if (deviceType === 'trafficLight') {
      return 'Potential for traffic accidents, gridlock, and public safety hazards';
    } else if (deviceType === 'camera') {
      return 'Complete surveillance blindspot, potential for undetected criminal activity';
    } else if (deviceType === 'waterSensor') {
      return 'Undetected water contamination, public health emergency risk';
    } else {
      return 'Severe disruption to city services and potential safety hazards';
    }
  } else if (severity === SEVERITY.HIGH) {
    if (deviceType === 'trafficLight') {
      return 'Traffic disruption and increased accident risk';
    } else if (deviceType === 'camera') {
      return 'Surveillance system compromise, security vulnerability';
    } else if (deviceType === 'waterSensor') {
      return 'Inaccurate water quality data, delayed contamination detection';
    } else {
      return 'Significant disruption to affected systems';
    }
  } else if (severity === SEVERITY.MEDIUM) {
    return 'Moderate service disruption and potential for escalation if unaddressed';
  } else {
    return 'Minor service disruption, minimal immediate impact';
  }
};

/**
 * Generates recommended actions based on threat type and severity
 * @param {String} threatType - The type of threat
 * @param {String} severity - The threat severity
 * @param {Object} device - The affected device
 * @returns {Array} List of recommended actions
 */
const generateRecommendedActions = (threatType, severity, device) => {
  const actions = [];
  
  // Common actions for all threats
  actions.push('Isolate affected device from network');
  actions.push('Capture current device state for forensic analysis');
  
  // Specific actions based on threat type
  if (threatType === THREAT_TYPES.UNAUTHORIZED_ACCESS) {
    actions.push('Reset all access credentials');
    actions.push('Review access logs for suspicious patterns');
    if (severity === SEVERITY.CRITICAL || severity === SEVERITY.HIGH) {
      actions.push('Implement additional authentication measures');
    }
  } else if (threatType === THREAT_TYPES.DATA_MANIPULATION) {
    actions.push('Restore data from last known good backup');
    actions.push('Verify data integrity across connected systems');
    if (severity === SEVERITY.CRITICAL) {
      actions.push('Manually verify sensor readings with physical inspection');
    }
  } else if (threatType === THREAT_TYPES.FIRMWARE_TAMPERING) {
    actions.push('Reflash device with verified firmware');
    actions.push('Implement firmware signature verification');
  } else if (threatType === THREAT_TYPES.MALWARE || threatType === THREAT_TYPES.RANSOMWARE) {
    actions.push('Deploy anti-malware countermeasures');
    actions.push('Scan connected systems for infection spread');
    if (severity === SEVERITY.CRITICAL || severity === SEVERITY.HIGH) {
      actions.push('Activate incident response team');
    }
  }
  
  // Additional actions for critical severity
  if (severity === SEVERITY.CRITICAL) {
    actions.push('Notify city emergency response coordinator');
    actions.push('Prepare public communication if services are affected');
  }
  
  // Device-specific actions
  if (device.type === 'trafficLight' && (severity === SEVERITY.CRITICAL || severity === SEVERITY.HIGH)) {
    actions.push('Switch to manual traffic control if necessary');
  } else if (device.type === 'camera' && threatType === THREAT_TYPES.UNAUTHORIZED_ACCESS) {
    actions.push('Review recorded footage for evidence of tampering');
  }
  
  return actions;
};

/**
 * Simulates the AI detection process for a given device
 * @param {Object} device - The device to analyze
 * @returns {Object|null} Threat alert if a threat is detected, null otherwise
 */
export const simulateAIDetection = (device) => {
  // Step 1: Analyze device behavior for anomalies
  const anomalyData = analyzeDeviceBehavior(device);
  
  // If no anomaly is detected, return null (no threat)
  if (!anomalyData.isAnomaly) {
    return null;
  }
  
  // Step 2: Determine threat type based on anomaly patterns
  let threatType = THREAT_TYPES.UNAUTHORIZED_ACCESS; // Default
  let severity = SEVERITY.MEDIUM; // Default
  
  // Determine threat type based on patterns
  if (anomalyData.patterns.includes('Unusual access pattern')) {
    threatType = THREAT_TYPES.UNAUTHORIZED_ACCESS;
    severity = SEVERITY.HIGH;
  } else if (anomalyData.patterns.includes('Signal timing manipulation')) {
    threatType = THREAT_TYPES.DATA_MANIPULATION;
    severity = SEVERITY.CRITICAL;
  } else if (anomalyData.patterns.includes('Reading fluctuation outside normal parameters')) {
    threatType = THREAT_TYPES.DATA_MANIPULATION;
    severity = SEVERITY.MEDIUM;
  } else if (anomalyData.patterns.includes('Communication protocol violation')) {
    threatType = THREAT_TYPES.COMMUNICATION_HIJACKING;
    severity = SEVERITY.HIGH;
  } else if (anomalyData.patterns.includes('Unexpected firmware behavior')) {
    threatType = THREAT_TYPES.FIRMWARE_TAMPERING;
    severity = SEVERITY.CRITICAL;
  }
  
  // Step 3: Classify the anomaly into a specific threat
  const threatData = classifyThreat(threatType, severity, anomalyData);
  
  // Step 4: Generate a detailed threat alert
  const threatAlert = generateThreatAlert(device, threatData);
  
  return threatAlert;
};

/**
 * Simulates the deployment of countermeasures against a threat
 * @param {Object} device - The affected device
 * @param {Object} threat - The detected threat
 * @returns {Object} Results of the countermeasure deployment
 */
export const deployCountermeasures = (device, threat) => {
  // Simulate success probability based on threat severity and type
  let successProbability = 0.9; // Base success rate
  
  // Adjust based on severity - more severe threats are harder to mitigate
  if (threat.severity === SEVERITY.CRITICAL) {
    successProbability -= 0.3;
  } else if (threat.severity === SEVERITY.HIGH) {
    successProbability -= 0.2;
  } else if (threat.severity === SEVERITY.MEDIUM) {
    successProbability -= 0.1;
  }
  
  // Certain threats are harder to mitigate
  if (threat.threatType === THREAT_TYPES.FIRMWARE_TAMPERING) {
    successProbability -= 0.15;
  } else if (threat.threatType === THREAT_TYPES.RANSOMWARE) {
    successProbability -= 0.25;
  }
  
  // Determine if countermeasures were successful
  const isSuccessful = Math.random() < successProbability;
  
  // Generate response time (between 10 seconds and 2 minutes)
  const responseTimeMs = Math.floor(Math.random() * (120000 - 10000) + 10000);
  
  // Generate actions taken based on recommended actions
  const actionsTaken = threat.recommendedActions.slice(0, Math.floor(Math.random() * 3) + 2);
  
  return {
    deviceId: device.id,
    threatId: threat.id,
    timestamp: new Date().toISOString(),
    isSuccessful,
    responseTimeMs,
    actionsTaken,
    newDeviceStatus: isSuccessful ? 'safe' : 'compromised',
    newThreatStatus: isSuccessful ? THREAT_STATUS.RESOLVED : THREAT_STATUS.MITIGATING,
    notes: isSuccessful 
      ? 'Threat successfully mitigated. Device returned to normal operation.' 
      : 'Initial countermeasures insufficient. Escalating response and continuing mitigation efforts.'
  };
};