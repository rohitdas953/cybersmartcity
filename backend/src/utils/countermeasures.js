/**
 * Countermeasures Deployment Simulation
 * 
 * This module simulates the deployment of security countermeasures
 * in response to detected threats in smart city infrastructure.
 */

// Available countermeasure types
const COUNTERMEASURE_TYPES = {
  ISOLATE: 'isolate',
  PATCH: 'patch',
  RESET: 'reset',
  REROUTE: 'reroute',
  HONEYPOT: 'honeypot'
};

// Simulated countermeasure deployment
const deployCountermeasure = (deviceId, threatInfo, countermeasureType) => {
  // In a real system, this would trigger actual security measures
  // For simulation, we'll return a response with timing and status
  
  // Validate countermeasure type
  if (!Object.values(COUNTERMEASURE_TYPES).includes(countermeasureType)) {
    return {
      success: false,
      message: 'Invalid countermeasure type',
      timestamp: new Date().toISOString()
    };
  }
  
  // Simulate deployment time (between 1-3 seconds)
  const deploymentTime = 1000 + Math.random() * 2000;
  
  // Simulate success rate (90% success)
  const isSuccessful = Math.random() < 0.9;
  
  // Generate response based on countermeasure type
  let response = {
    success: isSuccessful,
    deviceId,
    countermeasureType,
    deploymentTime: `${(deploymentTime / 1000).toFixed(2)} seconds`,
    timestamp: new Date().toISOString()
  };
  
  // Add specific details based on countermeasure type
  switch (countermeasureType) {
    case COUNTERMEASURE_TYPES.ISOLATE:
      response.actions = [
        'Network isolation protocol activated',
        'Device quarantined from main network',
        'Secure communication channel established for forensics'
      ];
      response.effectiveDuration = '4 hours';
      break;
      
    case COUNTERMEASURE_TYPES.PATCH:
      response.actions = [
        'Vulnerability assessment completed',
        'Emergency patch deployed',
        'System integrity verified'
      ];
      response.patchVersion = `SEC-${Math.floor(Math.random() * 1000)}`;
      break;
      
    case COUNTERMEASURE_TYPES.RESET:
      response.actions = [
        'Secure boot sequence initiated',
        'Configuration restored from trusted backup',
        'System credentials rotated'
      ];
      response.downtime = `${Math.floor(Math.random() * 30 + 15)} seconds`;
      break;
      
    case COUNTERMEASURE_TYPES.REROUTE:
      response.actions = [
        'Traffic rerouting initiated',
        'Backup systems activated',
        'Service continuity maintained'
      ];
      response.serviceImpact = 'Minimal';
      break;
      
    case COUNTERMEASURE_TYPES.HONEYPOT:
      response.actions = [
        'Decoy environment deployed',
        'Attack traffic redirected',
        'Threat actor behavior monitoring enabled'
      ];
      response.deceptionLevel = 'High';
      break;
      
    default:
      response.actions = ['Generic countermeasure deployed'];
  }
  
  // If not successful, modify the response
  if (!isSuccessful) {
    response.message = 'Countermeasure deployment failed';
    response.failureReason = getRandomFailureReason(countermeasureType);
    response.recommendedAction = 'Attempt manual intervention';
  }
  
  return response;
};

// Helper function to generate random failure reasons
const getRandomFailureReason = (countermeasureType) => {
  const genericReasons = [
    'Network connectivity issues',
    'Insufficient permissions',
    'Device unresponsive',
    'Timeout during critical operation'
  ];
  
  const specificReasons = {
    [COUNTERMEASURE_TYPES.ISOLATE]: [
      'Unable to establish isolation boundary',
      'Critical service dependencies prevented full isolation'
    ],
    [COUNTERMEASURE_TYPES.PATCH]: [
      'Device storage insufficient for patch',
      'Patch verification failed',
      'Incompatible system version'
    ],
    [COUNTERMEASURE_TYPES.RESET]: [
      'Secure boot verification failed',
      'Backup integrity check failed',
      'Hardware security module error'
    ],
    [COUNTERMEASURE_TYPES.REROUTE]: [
      'Backup systems unavailable',
      'Routing table update failed',
      'Service dependencies unresolvable'
    ],
    [COUNTERMEASURE_TYPES.HONEYPOT]: [
      'Insufficient resources for honeypot deployment',
      'Deception environment initialization failed',
      'Traffic redirection rules rejected'
    ]
  };
  
  // Combine generic and specific reasons
  const allReasons = [...genericReasons, ...(specificReasons[countermeasureType] || [])];
  
  // Return a random reason
  return allReasons[Math.floor(Math.random() * allReasons.length)];
};

// Get available countermeasures for a specific threat and device type
const getAvailableCountermeasures = (deviceType, threatStatus) => {
  // Base set of countermeasures available for all devices
  let available = [COUNTERMEASURE_TYPES.ISOLATE];
  
  // Add countermeasures based on device type
  switch (deviceType) {
    case 'trafficLight':
      available.push(COUNTERMEASURE_TYPES.RESET, COUNTERMEASURE_TYPES.REROUTE);
      break;
    case 'camera':
      available.push(COUNTERMEASURE_TYPES.RESET, COUNTERMEASURE_TYPES.PATCH);
      break;
    case 'waterSensor':
      available.push(COUNTERMEASURE_TYPES.RESET, COUNTERMEASURE_TYPES.PATCH);
      break;
    case 'powerGrid':
      available.push(
        COUNTERMEASURE_TYPES.RESET, 
        COUNTERMEASURE_TYPES.PATCH, 
        COUNTERMEASURE_TYPES.REROUTE
      );
      break;
    default:
      available.push(COUNTERMEASURE_TYPES.RESET);
  }
  
  // Add honeypot only for suspicious or attack status
  if (threatStatus === 'suspicious' || threatStatus === 'attack') {
    available.push(COUNTERMEASURE_TYPES.HONEYPOT);
  }
  
  return available;
};

module.exports = {
  COUNTERMEASURE_TYPES,
  deployCountermeasure,
  getAvailableCountermeasures
};