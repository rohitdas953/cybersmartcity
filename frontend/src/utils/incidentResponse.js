/**
 * Incident Response Simulation System
 * 
 * This module simulates an incident response system for a smart city
 * security operations center. It includes functions for managing incident
 * lifecycle, coordinating response teams, and implementing mitigation strategies.
 */

import { SEVERITY, THREAT_STATUS, THREAT_TYPES } from './threatDetection';

// Response team types
export const RESPONSE_TEAMS = {
  TIER1: 'Tier 1 - Initial Response',
  TIER2: 'Tier 2 - Technical Response',
  TIER3: 'Tier 3 - Advanced Response',
  FORENSICS: 'Digital Forensics Team',
  PHYSICAL: 'Physical Security Team',
  MANAGEMENT: 'Crisis Management Team'
};

// Response phases
export const RESPONSE_PHASES = {
  IDENTIFICATION: 'identification',
  CONTAINMENT: 'containment',
  ERADICATION: 'eradication',
  RECOVERY: 'recovery',
  LESSONS_LEARNED: 'lessons_learned'
};

// Response status
export const RESPONSE_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

/**
 * Creates a response team with specialties
 * @param {String} name - Team name
 * @param {Array} specialties - List of specialties
 * @returns {Object} Response team object
 */
export const createResponseTeam = (name, specialties) => {
  return {
    id: `team-${Math.random().toString(36).substring(2, 9)}`,
    name,
    specialties,
    members: generateTeamMembers(3 + Math.floor(Math.random() * 3)), // 3-5 members
    availability: 'available',
    currentAssignments: 0,
    responseTime: 5 + Math.floor(Math.random() * 10) // 5-15 minutes
  };
};

/**
 * Generates random team members
 * @param {Number} count - Number of members to generate
 * @returns {Array} List of team members
 */
const generateTeamMembers = (count) => {
  const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn', 'Skyler', 'Dakota'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const roles = ['Analyst', 'Engineer', 'Specialist', 'Technician', 'Coordinator', 'Lead'];
  
  const members = [];
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];
    
    members.push({
      id: `member-${Math.random().toString(36).substring(2, 9)}`,
      name: `${firstName} ${lastName}`,
      role: role,
      expertise: Math.floor(Math.random() * 5) + 1, // 1-5 expertise level
      availability: Math.random() > 0.2 ? 'available' : 'busy' // 80% chance of being available
    });
  }
  
  return members;
};

/**
 * Initiates a response to an incident
 * @param {Object} incidentData - Data about the incident
 * @returns {Object} Response object
 */
export const initiateResponse = (incidentData) => {
  const { incidentId, incidentType, severity, affectedSystems, responseTeam, startTime, description } = incidentData;
  
  // Create a unique ID for this response
  const responseId = `response-${Math.random().toString(36).substring(2, 9)}`;
  
  // Create timeline with estimated completion times for each phase
  const timeline = createResponseTimeline(incidentType, severity);
  
  // Generate response steps based on incident type and severity
  const responseSteps = generateResponseSteps(incidentType, severity, affectedSystems);
  
  return {
    id: responseId,
    incidentId,
    incidentType,
    severity,
    affectedSystems,
    responseTeam,
    status: RESPONSE_STATUS.IN_PROGRESS,
    phase: RESPONSE_PHASES.IDENTIFICATION,
    timeline,
    responseSteps,
    startTime: startTime || new Date().toISOString(),
    estimatedCompletionTime: calculateEstimatedCompletionTime(timeline),
    endTime: null,
    description,
    notes: [],
    report: null
  };
};

/**
 * Determines which response teams should be involved based on threat type and severity
 * @param {String} threatType - The type of threat
 * @param {String} severity - The threat severity
 * @returns {Array} List of assigned response teams
 */
const determineResponseTeams = (threatType, severity) => {
  const teams = [];
  
  // All incidents get Tier 1 response
  teams.push(RESPONSE_TEAMS.TIER1);
  
  // Assign additional teams based on severity
  if (severity === SEVERITY.MEDIUM || severity === SEVERITY.HIGH || severity === SEVERITY.CRITICAL) {
    teams.push(RESPONSE_TEAMS.TIER2);
  }
  
  if (severity === SEVERITY.HIGH || severity === SEVERITY.CRITICAL) {
    teams.push(RESPONSE_TEAMS.TIER3);
  }
  
  // Assign specialized teams based on threat type
  if (threatType === THREAT_TYPES.UNAUTHORIZED_ACCESS || 
      threatType === THREAT_TYPES.DATA_MANIPULATION || 
      threatType === THREAT_TYPES.MALWARE || 
      threatType === THREAT_TYPES.RANSOMWARE) {
    teams.push(RESPONSE_TEAMS.FORENSICS);
  }
  
  if (threatType === THREAT_TYPES.PHYSICAL_TAMPERING) {
    teams.push(RESPONSE_TEAMS.PHYSICAL);
  }
  
  // For critical incidents, involve management
  if (severity === SEVERITY.CRITICAL) {
    teams.push(RESPONSE_TEAMS.MANAGEMENT);
  }
  
  return teams;
};

/**
 * Creates a timeline for the incident response
 * @param {String} threatType - The type of threat
 * @param {String} severity - The threat severity
 * @returns {Object} Timeline with phases and estimated durations
 */
const createResponseTimeline = (threatType, severity) => {
  // Base durations in minutes for each phase
  let identificationTime = 15;
  let containmentTime = 30;
  let eradicationTime = 45;
  let recoveryTime = 30;
  let lessonsLearnedTime = 60;
  
  // Adjust times based on severity
  const severityMultiplier = {
    [SEVERITY.LOW]: 0.7,
    [SEVERITY.MEDIUM]: 1.0,
    [SEVERITY.HIGH]: 1.5,
    [SEVERITY.CRITICAL]: 2.0
  };
  
  const multiplier = severityMultiplier[severity];
  
  // Adjust times based on threat type
  if (threatType === THREAT_TYPES.RANSOMWARE || threatType === THREAT_TYPES.MALWARE) {
    eradicationTime *= 1.5;
    recoveryTime *= 1.5;
  } else if (threatType === THREAT_TYPES.FIRMWARE_TAMPERING) {
    eradicationTime *= 1.3;
    recoveryTime *= 1.2;
  } else if (threatType === THREAT_TYPES.DATA_MANIPULATION) {
    identificationTime *= 1.2;
    eradicationTime *= 1.1;
  }
  
  // Apply severity multiplier
  identificationTime = Math.round(identificationTime * multiplier);
  containmentTime = Math.round(containmentTime * multiplier);
  eradicationTime = Math.round(eradicationTime * multiplier);
  recoveryTime = Math.round(recoveryTime * multiplier);
  lessonsLearnedTime = Math.round(lessonsLearnedTime * multiplier);
  
  return {
    [RESPONSE_PHASES.IDENTIFICATION]: {
      estimatedDuration: identificationTime,
      startTime: null,
      endTime: null,
      status: RESPONSE_STATUS.PENDING
    },
    [RESPONSE_PHASES.CONTAINMENT]: {
      estimatedDuration: containmentTime,
      startTime: null,
      endTime: null,
      status: RESPONSE_STATUS.PENDING
    },
    [RESPONSE_PHASES.ERADICATION]: {
      estimatedDuration: eradicationTime,
      startTime: null,
      endTime: null,
      status: RESPONSE_STATUS.PENDING
    },
    [RESPONSE_PHASES.RECOVERY]: {
      estimatedDuration: recoveryTime,
      startTime: null,
      endTime: null,
      status: RESPONSE_STATUS.PENDING
    },
    [RESPONSE_PHASES.LESSONS_LEARNED]: {
      estimatedDuration: lessonsLearnedTime,
      startTime: null,
      endTime: null,
      status: RESPONSE_STATUS.PENDING
    }
  };
};

/**
 * Calculates the estimated completion time based on the timeline
 * @param {Object} timeline - The response timeline
 * @returns {Number} Total estimated minutes for completion
 */
const calculateEstimatedCompletionTime = (timeline) => {
  return Object.values(timeline).reduce((total, phase) => {
    return total + phase.estimatedDuration;
  }, 0);
};

/**
 * Generates response steps based on recommended actions and timeline
 * @param {Array} recommendedActions - List of recommended actions
 * @param {Object} timeline - The response timeline
 * @returns {Array} Detailed response steps with assignments and status
 */
const generateResponseSteps = (recommendedActions, timeline) => {
  const steps = [];
  
  // Map actions to appropriate phases
  const phaseMap = {
    'Isolate affected device from network': RESPONSE_PHASES.CONTAINMENT,
    'Capture current device state for forensic analysis': RESPONSE_PHASES.IDENTIFICATION,
    'Reset all access credentials': RESPONSE_PHASES.ERADICATION,
    'Review access logs for suspicious patterns': RESPONSE_PHASES.IDENTIFICATION,
    'Implement additional authentication measures': RESPONSE_PHASES.RECOVERY,
    'Restore data from last known good backup': RESPONSE_PHASES.RECOVERY,
    'Verify data integrity across connected systems': RESPONSE_PHASES.RECOVERY,
    'Manually verify sensor readings with physical inspection': RESPONSE_PHASES.IDENTIFICATION,
    'Reflash device with verified firmware': RESPONSE_PHASES.ERADICATION,
    'Implement firmware signature verification': RESPONSE_PHASES.RECOVERY,
    'Deploy anti-malware countermeasures': RESPONSE_PHASES.ERADICATION,
    'Scan connected systems for infection spread': RESPONSE_PHASES.CONTAINMENT,
    'Activate incident response team': RESPONSE_PHASES.IDENTIFICATION,
    'Notify city emergency response coordinator': RESPONSE_PHASES.IDENTIFICATION,
    'Prepare public communication if services are affected': RESPONSE_PHASES.CONTAINMENT,
    'Switch to manual traffic control if necessary': RESPONSE_PHASES.CONTAINMENT,
    'Review recorded footage for evidence of tampering': RESPONSE_PHASES.IDENTIFICATION
  };
  
  // Team assignments based on action type
  const teamMap = {
    'Isolate affected device from network': RESPONSE_TEAMS.TIER1,
    'Capture current device state for forensic analysis': RESPONSE_TEAMS.FORENSICS,
    'Reset all access credentials': RESPONSE_TEAMS.TIER2,
    'Review access logs for suspicious patterns': RESPONSE_TEAMS.TIER2,
    'Implement additional authentication measures': RESPONSE_TEAMS.TIER3,
    'Restore data from last known good backup': RESPONSE_TEAMS.TIER2,
    'Verify data integrity across connected systems': RESPONSE_TEAMS.TIER2,
    'Manually verify sensor readings with physical inspection': RESPONSE_TEAMS.PHYSICAL,
    'Reflash device with verified firmware': RESPONSE_TEAMS.TIER3,
    'Implement firmware signature verification': RESPONSE_TEAMS.TIER3,
    'Deploy anti-malware countermeasures': RESPONSE_TEAMS.TIER2,
    'Scan connected systems for infection spread': RESPONSE_TEAMS.TIER2,
    'Activate incident response team': RESPONSE_TEAMS.MANAGEMENT,
    'Notify city emergency response coordinator': RESPONSE_TEAMS.MANAGEMENT,
    'Prepare public communication if services are affected': RESPONSE_TEAMS.MANAGEMENT,
    'Switch to manual traffic control if necessary': RESPONSE_TEAMS.PHYSICAL,
    'Review recorded footage for evidence of tampering': RESPONSE_TEAMS.FORENSICS
  };
  
  // Create steps from recommended actions
  recommendedActions.forEach((action, index) => {
    const phase = phaseMap[action] || RESPONSE_PHASES.CONTAINMENT; // Default to containment
    const team = teamMap[action] || RESPONSE_TEAMS.TIER1; // Default to Tier 1
    
    steps.push({
      id: `step-${index + 1}`,
      description: action,
      phase,
      assignedTeam: team,
      status: RESPONSE_STATUS.PENDING,
      estimatedDuration: Math.round(timeline[phase].estimatedDuration / 3), // Rough estimate
      startTime: null,
      endTime: null,
      notes: []
    });
  });
  
  // Add a lessons learned step
  steps.push({
    id: `step-${recommendedActions.length + 1}`,
    description: 'Document incident and update response procedures',
    phase: RESPONSE_PHASES.LESSONS_LEARNED,
    assignedTeam: RESPONSE_TEAMS.MANAGEMENT,
    status: RESPONSE_STATUS.PENDING,
    estimatedDuration: timeline[RESPONSE_PHASES.LESSONS_LEARNED].estimatedDuration,
    startTime: null,
    endTime: null,
    notes: []
  });
  
  return steps;
};

/**
 * Starts the incident response process
 * @param {Object} responsePlan - The incident response plan
 * @returns {Object} Updated response plan with started status
 */
export const startResponse = (responsePlan) => {
  const now = new Date().toISOString();
  const updatedPlan = { ...responsePlan };
  
  // Update overall plan status
  updatedPlan.status = RESPONSE_STATUS.IN_PROGRESS;
  updatedPlan.startTime = now;
  
  // Start the identification phase
  updatedPlan.timeline[RESPONSE_PHASES.IDENTIFICATION].status = RESPONSE_STATUS.IN_PROGRESS;
  updatedPlan.timeline[RESPONSE_PHASES.IDENTIFICATION].startTime = now;
  
  // Start the first steps that are in the identification phase
  updatedPlan.responseSteps.forEach(step => {
    if (step.phase === RESPONSE_PHASES.IDENTIFICATION) {
      step.status = RESPONSE_STATUS.IN_PROGRESS;
      step.startTime = now;
    }
  });
  
  // Add a note
  updatedPlan.notes.push({
    timestamp: now,
    author: 'System',
    content: 'Incident response initiated. Identification phase started.'
  });
  
  return updatedPlan;
};

/**
 * Updates the progress of an incident response
 * @param {Object} responsePlan - The current response plan
 * @param {Number} progressPercentage - Percentage of progress to simulate (0-100)
 * @returns {Object} Updated response plan
 */
export const simulateResponseProgress = (responsePlan, progressPercentage = 25) => {
  if (!responsePlan.startTime || responsePlan.status === RESPONSE_STATUS.COMPLETED) {
    return responsePlan;
  }
  
  const now = new Date().toISOString();
  const updatedPlan = { ...responsePlan };
  const phases = Object.keys(RESPONSE_PHASES);
  
  // Determine which phase we should be in based on progress percentage
  let currentPhaseIndex = Math.floor((progressPercentage / 100) * phases.length);
  if (currentPhaseIndex >= phases.length) currentPhaseIndex = phases.length - 1;
  
  const currentPhase = RESPONSE_PHASES[phases[currentPhaseIndex]];
  updatedPlan.currentPhase = currentPhase;
  
  // Update all previous phases to completed
  for (let i = 0; i <= currentPhaseIndex; i++) {
    const phase = RESPONSE_PHASES[phases[i]];
    
    // If this is the current phase, mark as in progress unless we're at 100%
    if (i === currentPhaseIndex && progressPercentage < 100) {
      updatedPlan.timeline[phase].status = RESPONSE_STATUS.IN_PROGRESS;
      if (!updatedPlan.timeline[phase].startTime) {
        updatedPlan.timeline[phase].startTime = now;
      }
    } else {
      // Mark previous phases as completed
      updatedPlan.timeline[phase].status = RESPONSE_STATUS.COMPLETED;
      if (!updatedPlan.timeline[phase].startTime) {
        updatedPlan.timeline[phase].startTime = now;
      }
      if (!updatedPlan.timeline[phase].endTime) {
        updatedPlan.timeline[phase].endTime = now;
      }
    }
  }
  
  // Update steps based on phases
  updatedPlan.responseSteps.forEach(step => {
    const stepPhaseIndex = phases.indexOf(step.phase.toUpperCase());
    
    if (stepPhaseIndex < currentPhaseIndex) {
      // Steps in previous phases are completed
      step.status = RESPONSE_STATUS.COMPLETED;
      if (!step.startTime) step.startTime = now;
      if (!step.endTime) step.endTime = now;
    } else if (stepPhaseIndex === currentPhaseIndex) {
      // Steps in current phase are in progress
      if (progressPercentage === 100) {
        step.status = RESPONSE_STATUS.COMPLETED;
        if (!step.startTime) step.startTime = now;
        if (!step.endTime) step.endTime = now;
      } else {
        step.status = RESPONSE_STATUS.IN_PROGRESS;
        if (!step.startTime) step.startTime = now;
      }
    }
  });
  
  // If we're at 100%, mark the whole plan as completed
  if (progressPercentage >= 100) {
    updatedPlan.status = RESPONSE_STATUS.COMPLETED;
    updatedPlan.actualCompletionTime = now;
    
    // Add a completion note
    updatedPlan.notes.push({
      timestamp: now,
      author: 'System',
      content: 'Incident response completed successfully. All phases finished.'
    });
  } else {
    // Add a progress note
    updatedPlan.notes.push({
      timestamp: now,
      author: 'System',
      content: `Response progress at ${progressPercentage}%. Current phase: ${currentPhase}.`
    });
  }
  
  return updatedPlan;
};

/**
 * Adds a note to the response plan
 * @param {Object} responsePlan - The current response plan
 * @param {String} author - The author of the note
 * @param {String} content - The note content
 * @returns {Object} Updated response plan with the new note
 */
export const addResponseNote = (responsePlan, author, content) => {
  const now = new Date().toISOString();
  const updatedPlan = { ...responsePlan };
  
  updatedPlan.notes.push({
    timestamp: now,
    author,
    content
  });
  
  return updatedPlan;
};

/**
 * Initiates a detailed response for an incident
 * @param {Object} incidentData - Data about the incident
 * @returns {Object} The initiated detailed response object
 */
export const initiateDetailedResponse = (incidentData) => {
  const {
    incidentId,
    incidentType,
    severity,
    affectedSystems,
    responseTeam,
    startTime,
    description
  } = incidentData;
  
  return {
    id: `response-${incidentId}`,
    incidentId,
    type: incidentType,
    severity,
    affectedSystems,
    responseTeam,
    phase: RESPONSE_PHASES.IDENTIFICATION,
    status: RESPONSE_STATUS.IN_PROGRESS,
    startTime,
    endTime: null,
    description,
    notes: [
      {
        timestamp: startTime,
        author: 'System',
        content: `Response initiated for incident: ${description}`
      }
    ]
  };
};

/**
 * Updates the phase of an incident response
 * @param {Object} response - The current response object
 * @param {String} newPhase - The new phase to update to
 * @param {String} notes - Optional notes about the phase change
 * @returns {Object} Updated response object
 */
export const updateResponsePhase = (response, newPhase, notes = null) => {
  const now = new Date().toISOString();
  const updatedResponse = { ...response };
  
  // Update the phase
  updatedResponse.phase = newPhase;
  
  // If moving to the final phase, mark as completed
  if (newPhase === RESPONSE_PHASES.LESSONS_LEARNED) {
    updatedResponse.status = RESPONSE_STATUS.COMPLETED;
  }
  
  // Add a note about the phase change
  updatedResponse.notes.push({
    timestamp: now,
    author: 'System',
    content: `Response phase updated to: ${newPhase}`
  });
  
  // Add additional notes if provided
  if (notes) {
    updatedResponse.notes.push({
      timestamp: now,
      author: 'Responder',
      content: notes
    });
  }
  
  return updatedResponse;
};

/**
 * Creates a response team with a name and specialties
 * @param {String} name - The name of the response team
 * @param {Array} specialties - List of specialties/keywords this team handles
 * @returns {Object} Response team object
 */
// This function was removed as it was a duplicate of the createResponseTeam function defined earlier

/**
 * Generates a summary report of the incident response
 * @param {Object} responsePlan - The completed response plan
 * @returns {Object} Summary report with key metrics and findings
 */
export const generateResponseReport = (responsePlan) => {
  if (responsePlan.status !== RESPONSE_STATUS.COMPLETED) {
    return {
      incidentId: responsePlan.incidentId,
      status: 'Incomplete',
      message: 'Cannot generate report for incomplete response',
      completionPercentage: calculateCompletionPercentage(responsePlan)
    };
  }
  
  // Calculate response time metrics
  const startTime = new Date(responsePlan.startTime);
  const endTime = new Date(responsePlan.actualCompletionTime);
  const totalResponseTimeMinutes = Math.round((endTime - startTime) / (1000 * 60));
  
  // Calculate phase durations
  const phaseDurations = {};
  Object.entries(responsePlan.timeline).forEach(([phase, data]) => {
    if (data.startTime && data.endTime) {
      const phaseStart = new Date(data.startTime);
      const phaseEnd = new Date(data.endTime);
      phaseDurations[phase] = Math.round((phaseEnd - phaseStart) / (1000 * 60));
    } else {
      phaseDurations[phase] = 0;
    }
  });
  
  // Determine if response was within estimated time
  const withinEstimatedTime = totalResponseTimeMinutes <= responsePlan.estimatedCompletionTime;
  
  return {
    incidentId: responsePlan.incidentId,
    deviceId: responsePlan.deviceId,
    deviceName: responsePlan.deviceName,
    threatType: responsePlan.threatType,
    severity: responsePlan.severity,
    status: 'Completed',
    startTime: responsePlan.startTime,
    completionTime: responsePlan.actualCompletionTime,
    totalResponseTimeMinutes,
    estimatedTimeMinutes: responsePlan.estimatedCompletionTime,
    withinEstimatedTime,
    timeVariance: responsePlan.estimatedCompletionTime - totalResponseTimeMinutes,
    phaseDurations,
    teamsInvolved: responsePlan.assignedTeams,
    stepsCompleted: responsePlan.responseSteps.filter(step => step.status === RESPONSE_STATUS.COMPLETED).length,
    totalSteps: responsePlan.responseSteps.length,
    notes: responsePlan.notes,
    recommendations: generateRecommendations(responsePlan)
  };
};

/**
 * Calculates the completion percentage of a response plan
 * @param {Object} responsePlan - The response plan
 * @returns {Number} Completion percentage (0-100)
 */
const calculateCompletionPercentage = (responsePlan) => {
  if (responsePlan.status === RESPONSE_STATUS.COMPLETED) {
    return 100;
  }
  
  if (responsePlan.status === RESPONSE_STATUS.PENDING) {
    return 0;
  }
  
  // Count completed steps
  const completedSteps = responsePlan.responseSteps.filter(
    step => step.status === RESPONSE_STATUS.COMPLETED
  ).length;
  
  return Math.round((completedSteps / responsePlan.responseSteps.length) * 100);
};

/**
 * Generates recommendations based on the response plan
 * @param {Object} responsePlan - The completed response plan
 * @returns {Array} List of recommendations for future incidents
 */
const generateRecommendations = (responsePlan) => {
  const recommendations = [];
  
  // Check if response was within estimated time
  if (responsePlan.actualCompletionTime) {
    const startTime = new Date(responsePlan.startTime);
    const endTime = new Date(responsePlan.actualCompletionTime);
    const totalResponseTimeMinutes = Math.round((endTime - startTime) / (1000 * 60));
    
    if (totalResponseTimeMinutes > responsePlan.estimatedCompletionTime) {
      recommendations.push(
        'Response took longer than estimated. Consider reviewing team allocation and procedures.'
      );
    }
  }
  
  // Add recommendations based on threat type
  switch (responsePlan.threatType) {
    case THREAT_TYPES.UNAUTHORIZED_ACCESS:
      recommendations.push('Implement stronger authentication mechanisms across similar devices.');
      recommendations.push('Review access control policies and procedures.');
      break;
    case THREAT_TYPES.DATA_MANIPULATION:
      recommendations.push('Implement data integrity verification mechanisms.');
      recommendations.push('Consider blockchain or cryptographic solutions for critical data.');
      break;
    case THREAT_TYPES.FIRMWARE_TAMPERING:
      recommendations.push('Implement secure boot and firmware signature verification.');
      recommendations.push('Establish regular firmware update and verification schedule.');
      break;
    case THREAT_TYPES.MALWARE:
    case THREAT_TYPES.RANSOMWARE:
      recommendations.push('Enhance endpoint protection on all connected devices.');
      recommendations.push('Implement network segmentation to limit lateral movement.');
      break;
    default:
      recommendations.push('Review security posture of similar devices in the network.');
  }
  
  // Add general recommendations
  recommendations.push('Conduct training exercises for similar scenarios.');
  recommendations.push('Update incident response playbooks based on lessons learned.');
  
  return recommendations;
};

/**
 * Creates a response plan based on a threat alert
 * @param {Object} threatAlert - The detected threat alert
 * @returns {Object} Response plan object
 */
export const createResponsePlan = (threatAlert) => {
  const responseId = `resp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const responseTeam = createResponseTeam(
    threatAlert.type === 'network' ? 'Network Security' :
    threatAlert.type === 'device' ? 'Endpoint Protection' :
    threatAlert.type === 'data' ? 'Data Security' :
    threatAlert.type === 'infrastructure' ? 'Infrastructure' : 'IoT Security',
    [threatAlert.type]
  );
  
  return {
    id: responseId,
    incidentId: threatAlert.id,
    incidentType: threatAlert.type,
    severity: threatAlert.severity,
    affectedSystems: threatAlert.affectedSystems || [],
    responseTeam,
    status: RESPONSE_STATUS.IN_PROGRESS,
    phase: RESPONSE_PHASES.IDENTIFICATION,
    timeline: createResponseTimeline(),
    steps: generateResponseSteps(threatAlert),
    startTime: new Date().toISOString(),
    estimatedCompletionTime: new Date(Date.now() + 3600000).toISOString() // 1 hour later
  };
};

/**
 * Simulates the entire incident response lifecycle
 * @param {Object} threatAlert - The detected threat alert
 * @param {Number} progressPercentage - Optional progress percentage (0-100)
 * @returns {Object} Complete response simulation including plan and report
 */
export const simulateIncidentResponse = (threatAlert, progressPercentage = 100) => {
  // Create the initial response plan
  let responsePlan = createResponsePlan(threatAlert);
  
  // Start the response
  responsePlan = startResponse(responsePlan);
  
  // Simulate progress
  responsePlan = simulateResponseProgress(responsePlan, progressPercentage);
  
  // Generate report if completed
  const report = progressPercentage >= 100 ? 
    generateResponseReport(responsePlan) : 
    null;
  
  return {
    responsePlan,
    report,
    completionPercentage: calculateCompletionPercentage(responsePlan)
  };
};