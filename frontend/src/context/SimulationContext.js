import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { demoData } from '../data/demoData';
import { useThreat } from './ThreatContext';
import { useResponse } from './ResponseContext';

// Create context
const SimulationContext = createContext();

// Custom hook to use the simulation context
export const useSimulation = () => useContext(SimulationContext);

// Provider component
export const SimulationProvider = ({ children }) => {
  const [simulationActive, setSimulationActive] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1); // 1x speed
  const [currentScenario, setCurrentScenario] = useState(null);
  const [availableScenarios, setAvailableScenarios] = useState([]);
  const [simulationTime, setSimulationTime] = useState(new Date());
  const [simulationStats, setSimulationStats] = useState({
    eventsProcessed: 0,
    threatsDetected: 0,
    incidentsResolved: 0,
    systemsCompromised: 0
  });
  
  // Get contexts
  const threatContext = useThreat();
  const responseContext = useResponse();
  
  // Destructure functions after ensuring context is available
  const simulateNewAlert = threatContext?.simulateNewAlert;
  const createNewResponse = responseContext?.createNewResponse;
  
  // Refs for intervals
  const simulationIntervalRef = useRef(null);
  const eventQueueRef = useRef([]);
  
  // Initialize simulation data
  useEffect(() => {
    // Set available scenarios from demo data
    setAvailableScenarios(demoData.scenarios);
    
    // Cleanup on unmount
    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    };
  }, []);
  
  // Check for context dependencies
  useEffect(() => {
    if (!threatContext || !responseContext) {
      console.warn('ThreatContext or ResponseContext not available');
    }
  }, [threatContext, responseContext]);
  
  // Start simulation
  const startSimulation = (scenarioId) => {
    // Check if required functions are available
    if (typeof simulateNewAlert !== 'function') {
      console.error('Cannot start simulation: simulateNewAlert function is not available');
      return;
    }
    
    // Find scenario
    const scenario = availableScenarios.find(s => s.id === scenarioId);
    if (!scenario) return;
    
    // Set current scenario
    setCurrentScenario(scenario);
    
    // Reset stats
    setSimulationStats({
      eventsProcessed: 0,
      threatsDetected: 0,
      incidentsResolved: 0,
      systemsCompromised: 0
    });
    
    // Set initial time
    setSimulationTime(new Date());
    
    // Queue events from scenario
    eventQueueRef.current = [...scenario.events].sort((a, b) => a.delay - b.delay);
    
    // Start simulation interval
    setSimulationActive(true);
    
    // Clear any existing interval
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
    }
    
    // Set new interval
    simulationIntervalRef.current = setInterval(() => {
      // Update simulation time
      setSimulationTime(prevTime => {
        const newTime = new Date(prevTime);
        newTime.setSeconds(newTime.getSeconds() + simulationSpeed);
        return newTime;
      });
      
      // Process events
      processNextEvents();
    }, 1000); // Tick every second
  };
  
  // Stop simulation
  const stopSimulation = () => {
    setSimulationActive(false);
    
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
  };
  
  // Change simulation speed
  const changeSimulationSpeed = (speed) => {
    setSimulationSpeed(speed);
    
    // Restart interval with new speed if active
    if (simulationActive && simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      
      simulationIntervalRef.current = setInterval(() => {
        // Update simulation time
        setSimulationTime(prevTime => {
          const newTime = new Date(prevTime);
          newTime.setSeconds(newTime.getSeconds() + speed);
          return newTime;
        });
        
        // Process events
        processNextEvents();
      }, 1000);
    }
  };
  
  // Process next events in queue
  const processNextEvents = () => {
    // Get current simulation time in seconds since start
    const currentTimeSeconds = Math.floor((simulationTime - new Date(simulationTime).setHours(0, 0, 0, 0)) / 1000);
    
    // Find events that should be processed
    const eventsToProcess = [];
    const remainingEvents = [];
    
    eventQueueRef.current.forEach(event => {
      if (event.delay <= currentTimeSeconds * simulationSpeed) {
        eventsToProcess.push(event);
      } else {
        remainingEvents.push(event);
      }
    });
    
    // Update queue
    eventQueueRef.current = remainingEvents;
    
    // Process events
    eventsToProcess.forEach(event => {
      processEvent(event);
    });
    
    // Update stats
    if (eventsToProcess.length > 0) {
      setSimulationStats(prevStats => ({
        ...prevStats,
        eventsProcessed: prevStats.eventsProcessed + eventsToProcess.length
      }));
    }
    
    // Check if simulation is complete
    if (eventQueueRef.current.length === 0 && simulationActive) {
      // Auto-stop when all events processed
      stopSimulation();
    }
  };
  
  // Process a single event
  const processEvent = (event) => {
    switch (event.type) {
      case 'threat':
        // Check if simulateNewAlert is available
        if (typeof simulateNewAlert === 'function') {
          // Create a new threat alert
          const alert = simulateNewAlert(
            event.deviceId,
            event.threatType,
            event.severity
          );
          
          // Update stats
          setSimulationStats(prevStats => ({
            ...prevStats,
            threatsDetected: prevStats.threatsDetected + 1,
            systemsCompromised: event.severity === 'critical' ? 
              prevStats.systemsCompromised + 1 : prevStats.systemsCompromised
          }));
          
          // Create incident response if severe enough and if createNewResponse is available
          if (['high', 'critical'].includes(event.severity) && typeof createNewResponse === 'function') {
            createNewResponse({
              id: `incident-${alert?.id || Math.random().toString(36).substring(2, 9)}`,
              type: event.threatType,
              severity: event.severity,
              affectedSystems: [event.deviceId],
              description: `Automated response to ${event.threatType} threat on device ${event.deviceId}`
            });
          }
        } else {
          console.error('simulateNewAlert function is not available');
        }
        break;
        
      case 'system':
        // System event (like a device going offline)
        console.log('System event:', event);
        // Would update device status in a real implementation
        break;
        
      case 'response':
        // Response team action
        console.log('Response event:', event);
        // Would update response status in a real implementation
        
        // Update stats for resolved incidents
        if (event.action === 'resolve') {
          setSimulationStats(prevStats => ({
            ...prevStats,
            incidentsResolved: prevStats.incidentsResolved + 1
          }));
        }
        break;
        
      default:
        console.log('Unknown event type:', event);
    }
  };
  
  // Add a custom event to the queue
  const addCustomEvent = (event) => {
    // Calculate delay based on current simulation time
    const currentTimeSeconds = Math.floor((simulationTime - new Date(simulationTime).setHours(0, 0, 0, 0)) / 1000);
    const eventWithDelay = {
      ...event,
      delay: event.delay || currentTimeSeconds + 5 // Default to 5 seconds from now
    };
    
    // Add to queue
    eventQueueRef.current.push(eventWithDelay);
    
    // Sort queue by delay
    eventQueueRef.current.sort((a, b) => a.delay - b.delay);
  };
  
  return (
    <SimulationContext.Provider
      value={{
        simulationActive,
        simulationSpeed,
        currentScenario,
        availableScenarios,
        simulationTime,
        simulationStats,
        startSimulation,
        stopSimulation,
        changeSimulationSpeed,
        addCustomEvent
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};