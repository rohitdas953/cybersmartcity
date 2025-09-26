import React, { createContext, useContext, useState, useEffect } from 'react';
import { demoData } from '../data/demoData';
import { 
  createResponseTeam, 
  initiateResponse,
  updateResponsePhase,
  generateResponseReport,
  RESPONSE_PHASES,
  RESPONSE_STATUS
} from '../utils/incidentResponse';

// Create context
const ResponseContext = createContext();

// Custom hook to use the response context
export const useResponse = () => useContext(ResponseContext);

// Provider component
export const ResponseProvider = ({ children }) => {
  const [activeResponses, setActiveResponses] = useState([]);
  const [responseTeams, setResponseTeams] = useState([]);
  const [responseHistory, setResponseHistory] = useState([]);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize response data
  useEffect(() => {
    fetchResponseData();
  }, []);
  
  // Fetch response data
  const fetchResponseData = async () => {
    try {
      // In a production app, this would be an actual API call
      // For now, we'll use our demo data
      setTimeout(() => {
        // Create response teams
        const teams = [
          createResponseTeam('Network Security', ['network', 'firewall', 'intrusion']),
          createResponseTeam('Endpoint Protection', ['endpoint', 'device', 'malware']),
          createResponseTeam('Data Security', ['data', 'encryption', 'access']),
          createResponseTeam('Infrastructure', ['infrastructure', 'server', 'cloud']),
          createResponseTeam('IoT Security', ['iot', 'sensor', 'camera'])
        ];
        
        // Process active responses from demo data
        const responses = demoData.incidents
          .filter(incident => incident.status !== 'resolved')
          .map(incident => {
            // Determine appropriate response team
            const teamIndex = Math.floor(Math.random() * teams.length);
            
            // Create response
            return initiateResponse({
              incidentId: incident.id,
              incidentType: incident.type,
              severity: incident.severity,
              affectedSystems: incident.affectedSystems || ['Unknown'],
              responseTeam: teams[teamIndex],
              startTime: new Date(incident.timestamp).toISOString(),
              description: incident.description
            });
          });
        
        // Create response history (completed responses)
        const history = demoData.incidents
          .filter(incident => incident.status === 'resolved')
          .map(incident => {
            // Determine appropriate response team
            const teamIndex = Math.floor(Math.random() * teams.length);
            
            // Create completed response
            const response = initiateResponse({
              incidentId: incident.id,
              incidentType: incident.type,
              severity: incident.severity,
              affectedSystems: incident.affectedSystems || ['Unknown'],
              responseTeam: teams[teamIndex],
              startTime: new Date(incident.timestamp).toISOString(),
              description: incident.description
            });
            
            // Set to completed
            response.phase = RESPONSE_PHASES.RECOVERY;
            response.status = RESPONSE_STATUS.COMPLETED;
            response.endTime = new Date(new Date(incident.timestamp).getTime() + Math.random() * 86400000).toISOString(); // Random time within 24 hours
            response.report = generateResponseReport(response);
            
            return response;
          });
        
        setResponseTeams(teams);
        setActiveResponses(responses);
        setResponseHistory(history);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to fetch response data');
      setLoading(false);
      console.error('Error fetching response data:', err);
    }
  };
  
  // Get response for a specific incident
  const getResponseForIncident = (incidentId) => {
    return activeResponses.find(response => response.incidentId === incidentId) || 
           responseHistory.find(response => response.incidentId === incidentId);
  };
  
  // Update response phase
  const updateResponse = (responseId, newPhase, notes) => {
    setActiveResponses(prevResponses => {
      return prevResponses.map(response => {
        if (response.id === responseId) {
          const updatedResponse = updateResponsePhase(response, newPhase, notes);
          
          // If completed, move to history
          if (updatedResponse.status === RESPONSE_STATUS.COMPLETED) {
            updatedResponse.endTime = new Date().toISOString();
            updatedResponse.report = generateResponseReport(updatedResponse);
            
            // Add to history
            setResponseHistory(prevHistory => [updatedResponse, ...prevHistory]);
            
            // Remove from active
            return null;
          }
          
          return updatedResponse;
        }
        return response;
      }).filter(Boolean); // Remove null entries (completed responses)
    });
  };
  
  // Create a new response for an incident
  const createNewResponse = (incidentData) => {
    // Find appropriate team based on incident type
    const matchingTeam = responseTeams.find(team => {
      return team.specialties.some(specialty => 
        incidentData.type.toLowerCase().includes(specialty)
      );
    }) || responseTeams[0]; // Default to first team if no match
    
    // Create response
    const newResponse = initiateResponse({
      incidentId: incidentData.id,
      incidentType: incidentData.type,
      severity: incidentData.severity,
      affectedSystems: incidentData.affectedSystems || ['Unknown'],
      responseTeam: matchingTeam,
      startTime: new Date().toISOString(),
      description: incidentData.description
    });
    
    // Add to active responses
    setActiveResponses(prevResponses => [newResponse, ...prevResponses]);
    
    return newResponse;
  };
  
  // Select a response for detailed view
  const selectResponse = (responseId) => {
    const response = activeResponses.find(r => r.id === responseId) || 
                    responseHistory.find(r => r.id === responseId);
    setSelectedResponse(response);
  };
  
  return (
    <ResponseContext.Provider
      value={{
        activeResponses,
        responseTeams,
        responseHistory,
        selectedResponse,
        loading,
        error,
        getResponseForIncident,
        updateResponse,
        createNewResponse,
        selectResponse
      }}
    >
      {children}
    </ResponseContext.Provider>
  );
};