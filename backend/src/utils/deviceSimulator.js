/**
 * Device Data Simulator
 * 
 * This module simulates data generation from various smart city devices.
 * It creates realistic telemetry data that can be used for the threat detection engine.
 */

// Device types and their specific data patterns
const DEVICE_TYPES = {
  TRAFFIC_LIGHT: 'trafficLight',
  CAMERA: 'camera',
  WATER_SENSOR: 'waterSensor',
  POWER_GRID: 'powerGrid'
};

// Generate random telemetry data for a specific device
const generateDeviceTelemetry = (deviceId, deviceType) => {
  const baseData = {
    deviceId,
    deviceType,
    timestamp: new Date().toISOString(),
    ipAddress: generateRandomIP(),
    connectionStatus: Math.random() > 0.05 ? 'connected' : 'intermittent',
    batteryLevel: Math.floor(Math.random() * 100),
    firmwareVersion: `v${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`,
    lastMaintenance: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() // Random date within last 30 days
  };
  
  // Add device-specific telemetry
  switch (deviceType) {
    case DEVICE_TYPES.TRAFFIC_LIGHT:
      return {
        ...baseData,
        currentState: ['red', 'yellow', 'green'][Math.floor(Math.random() * 3)],
        operationalMode: ['normal', 'peak', 'emergency', 'maintenance'][Math.floor(Math.random() * 4)],
        signalTimings: {
          red: 30 + Math.floor(Math.random() * 10),
          yellow: 3 + Math.floor(Math.random() * 2),
          green: 25 + Math.floor(Math.random() * 15)
        },
        intersectionLoad: Math.floor(Math.random() * 100),
        pedestrianWaitTime: Math.floor(Math.random() * 60)
      };
      
    case DEVICE_TYPES.CAMERA:
      return {
        ...baseData,
        isRecording: Math.random() > 0.1,
        resolution: ['720p', '1080p', '4K'][Math.floor(Math.random() * 3)],
        frameRate: [15, 24, 30, 60][Math.floor(Math.random() * 4)],
        storageUsed: Math.floor(Math.random() * 95),
        motionDetected: Math.random() > 0.7,
        lightLevel: Math.floor(Math.random() * 100),
        zoomLevel: Math.floor(Math.random() * 10)
      };
      
    case DEVICE_TYPES.WATER_SENSOR:
      return {
        ...baseData,
        waterLevel: Math.floor(Math.random() * 100),
        flowRate: Math.random() * 50,
        turbidity: Math.random() * 10,
        pH: 6 + Math.random() * 2,
        temperature: 10 + Math.random() * 20,
        dissolvedOxygen: Math.random() * 12,
        conductivity: 200 + Math.random() * 300
      };
      
    case DEVICE_TYPES.POWER_GRID:
      return {
        ...baseData,
        currentLoad: Math.floor(Math.random() * 100),
        voltage: 110 + Math.random() * 10,
        frequency: 59.5 + Math.random(),
        temperature: 30 + Math.random() * 40,
        efficiency: 90 + Math.random() * 9,
        backupPower: Math.floor(Math.random() * 100),
        activeAlerts: Math.random() > 0.9 ? ['High temperature', 'Voltage fluctuation'] : []
      };
      
    default:
      return baseData;
  }
};

// Generate a random IP address
const generateRandomIP = () => {
  return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};

// Generate a batch of telemetry data for multiple devices
const generateBatchTelemetry = (devices) => {
  return devices.map(device => {
    return generateDeviceTelemetry(device.id, device.type);
  });
};

// Simulate an anomaly in device data (for testing threat detection)
const generateAnomalousTelemetry = (deviceId, deviceType, anomalyType) => {
  // Get normal telemetry first
  const normalTelemetry = generateDeviceTelemetry(deviceId, deviceType);
  
  // Apply anomaly based on type
  switch (anomalyType) {
    case 'connection':
      return {
        ...normalTelemetry,
        connectionStatus: 'disconnected',
        ipAddress: generateRandomIP() // Different IP than usual
      };
      
    case 'authentication':
      return {
        ...normalTelemetry,
        lastAuthenticationAttempts: 15 + Math.floor(Math.random() * 20),
        authenticationFailures: 10 + Math.floor(Math.random() * 15),
        lastAuthenticationIP: generateRandomIP() // Suspicious IP
      };
      
    case 'firmware':
      return {
        ...normalTelemetry,
        firmwareVersion: `v${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}-MODIFIED`,
        firmwareChecksum: 'INVALID',
        lastFirmwareUpdate: new Date().toISOString() // Very recent update
      };
      
    case 'traffic':
      return {
        ...normalTelemetry,
        dataTransmitted: 1000 + Math.floor(Math.random() * 9000), // Unusually high
        destinationAddresses: Array(5).fill().map(() => generateRandomIP()), // Multiple destinations
        protocolAnomaly: true
      };
      
    case 'sensor':
      // Modify sensor-specific readings to be out of normal range
      if (deviceType === DEVICE_TYPES.WATER_SENSOR) {
        return {
          ...normalTelemetry,
          pH: 2 + Math.random() * 1, // Very acidic (abnormal)
          turbidity: 50 + Math.random() * 50, // Extremely turbid
          temperature: 50 + Math.random() * 20 // Unusually hot
        };
      } else if (deviceType === DEVICE_TYPES.POWER_GRID) {
        return {
          ...normalTelemetry,
          voltage: 150 + Math.random() * 30, // Dangerous voltage spike
          frequency: 52 + Math.random() * 8, // Frequency out of safe range
          temperature: 80 + Math.random() * 20 // Overheating
        };
      } else if (deviceType === DEVICE_TYPES.TRAFFIC_LIGHT) {
        return {
          ...normalTelemetry,
          signalTimings: {
            red: 1, // Dangerously short red light
            yellow: 1,
            green: 120 // Extremely long green
          },
          operationalMode: 'unknown'
        };
      }
      return normalTelemetry;
      
    default:
      return normalTelemetry;
  }
};

module.exports = {
  DEVICE_TYPES,
  generateDeviceTelemetry,
  generateBatchTelemetry,
  generateAnomalousTelemetry
};