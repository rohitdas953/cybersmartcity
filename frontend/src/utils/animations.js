/**
 * Animations and Visual Effects for Attack Detection
 * 
 * This module provides animation utilities for visualizing security incidents
 * and attack patterns in the Smart City Security Operations Center interface.
 */

// Animation types for different security events
export const ANIMATION_TYPES = {
  ATTACK_DETECTED: 'attack-detected',
  DATA_EXFILTRATION: 'data-exfiltration',
  LATERAL_MOVEMENT: 'lateral-movement',
  DEVICE_COMPROMISE: 'device-compromise',
  NETWORK_SCAN: 'network-scan',
  MALWARE_SPREAD: 'malware-spread',
  SYSTEM_RECOVERY: 'system-recovery',
  THREAT_CONTAINED: 'threat-contained',
  ALERT_NOTIFICATION: 'alert-notification',
  CONNECTION_TERMINATED: 'connection-terminated'
};

/**
 * Create a pulsing effect on a map marker or device icon
 * @param {String} elementId - ID of the element to animate
 * @param {String} color - Color of the pulse (e.g., 'red', '#ff0000')
 * @param {Number} duration - Duration of the animation in milliseconds
 * @param {Number} intensity - Intensity of the pulse (1-10)
 * @returns {Object} Animation controller with start/stop methods
 */
export const createPulseEffect = (elementId, color = '#ff0000', duration = 2000, intensity = 5) => {
  // Animation controller object
  const controller = {
    elementId,
    isActive: false,
    intervalId: null,
    
    // Start the pulse animation
    start() {
      if (this.isActive) return;
      
      const element = document.getElementById(elementId);
      if (!element) return;
      
      // Store original styles to restore later
      this.originalStyles = {
        boxShadow: element.style.boxShadow,
        transform: element.style.transform,
        transition: element.style.transition
      };
      
      // Set up the animation
      element.style.transition = `all ${duration / 1000}s ease-in-out`;
      
      // Calculate pulse size based on intensity (1-10)
      const pulseSize = 1 + (intensity * 0.1);
      
      // Start the interval
      this.isActive = true;
      this.intervalId = setInterval(() => {
        // Pulse out
        element.style.boxShadow = `0 0 ${intensity * 2}px ${intensity * 2}px ${color}`;
        element.style.transform = `scale(${pulseSize})`;
        
        // Pulse in after half the duration
        setTimeout(() => {
          if (this.isActive) {
            element.style.boxShadow = `0 0 0 0 ${color}`;
            element.style.transform = 'scale(1)';
          }
        }, duration / 2);
      }, duration);
      
      return this;
    },
    
    // Stop the pulse animation
    stop() {
      if (!this.isActive) return;
      
      clearInterval(this.intervalId);
      this.isActive = false;
      
      // Restore original styles
      const element = document.getElementById(elementId);
      if (element && this.originalStyles) {
        element.style.boxShadow = this.originalStyles.boxShadow;
        element.style.transform = this.originalStyles.transform;
        element.style.transition = this.originalStyles.transition;
      }
      
      return this;
    }
  };
  
  return controller;
};

/**
 * Create a connection line between two points on the map
 * @param {Object} sourcePoint - Source coordinates {x, y} or element ID
 * @param {Object} targetPoint - Target coordinates {x, y} or element ID
 * @param {Object} options - Animation options
 * @returns {Object} Animation controller with start/stop methods
 */
export const createConnectionLine = (sourcePoint, targetPoint, options = {}) => {
  const defaults = {
    color: '#ff0000',
    width: 2,
    dashArray: '5,5',
    animationDuration: 1000,
    pulseEffect: true,
    arrowHead: true,
    container: 'map-container' // ID of the container element
  };
  
  const settings = { ...defaults, ...options };
  
  // Generate a unique ID for the line
  const lineId = `connection-line-${Math.random().toString(36).substr(2, 9)}`;
  
  // Animation controller object
  const controller = {
    lineId,
    isActive: false,
    animationFrameId: null,
    
    // Get coordinates from element or use direct coordinates
    getCoordinates(point) {
      if (typeof point === 'string') {
        const element = document.getElementById(point);
        if (!element) return { x: 0, y: 0 };
        
        const rect = element.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
      }
      
      return point;
    },
    
    // Create the SVG line element
    createLineElement() {
      const container = document.getElementById(settings.container);
      if (!container) return null;
      
      // Create SVG container if it doesn't exist
      let svgContainer = document.getElementById(`${settings.container}-svg-overlay`);
      if (!svgContainer) {
        const containerRect = container.getBoundingClientRect();
        
        svgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgContainer.setAttribute('id', `${settings.container}-svg-overlay`);
        svgContainer.setAttribute('class', 'svg-overlay');
        svgContainer.setAttribute('width', '100%');
        svgContainer.setAttribute('height', '100%');
        svgContainer.style.position = 'absolute';
        svgContainer.style.top = '0';
        svgContainer.style.left = '0';
        svgContainer.style.pointerEvents = 'none';
        svgContainer.style.zIndex = '1000';
        
        container.style.position = 'relative';
        container.appendChild(svgContainer);
      }
      
      // Create the line element
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('id', this.lineId);
      line.setAttribute('stroke', settings.color);
      line.setAttribute('stroke-width', settings.width);
      line.setAttribute('stroke-dasharray', settings.dashArray);
      
      // Add arrow marker if needed
      if (settings.arrowHead) {
        // Create marker definition if it doesn't exist
        let defs = svgContainer.querySelector('defs');
        if (!defs) {
          defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
          svgContainer.appendChild(defs);
        }
        
        const markerId = `arrow-${settings.color.replace('#', '')}`;
        let marker = document.getElementById(markerId);
        
        if (!marker) {
          marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
          marker.setAttribute('id', markerId);
          marker.setAttribute('markerWidth', '10');
          marker.setAttribute('markerHeight', '10');
          marker.setAttribute('refX', '9');
          marker.setAttribute('refY', '3');
          marker.setAttribute('orient', 'auto');
          marker.setAttribute('markerUnits', 'strokeWidth');
          
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', 'M0,0 L0,6 L9,3 z');
          path.setAttribute('fill', settings.color);
          
          marker.appendChild(path);
          defs.appendChild(marker);
        }
        
        line.setAttribute('marker-end', `url(#${markerId})`);
      }
      
      svgContainer.appendChild(line);
      return line;
    },
    
    // Animate the line drawing
    animateLine(startTime, source, target, line) {
      if (!this.isActive) return;
      
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / settings.animationDuration, 1);
      
      // Calculate current point along the line
      const currentX = source.x + (target.x - source.x) * progress;
      const currentY = source.y + (target.y - source.y) * progress;
      
      // Update line coordinates
      line.setAttribute('x1', source.x);
      line.setAttribute('y1', source.y);
      line.setAttribute('x2', currentX);
      line.setAttribute('y2', currentY);
      
      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(() => {
          this.animateLine(startTime, source, target, line);
        });
      } else if (settings.pulseEffect) {
        // Add pulsing effect to the line
        line.setAttribute('class', 'pulsing-line');
      }
    },
    
    // Start the connection animation
    start() {
      if (this.isActive) return;
      
      const source = this.getCoordinates(sourcePoint);
      const target = this.getCoordinates(targetPoint);
      
      const line = this.createLineElement();
      if (!line) return;
      
      this.isActive = true;
      this.animateLine(Date.now(), source, target, line);
      
      return this;
    },
    
    // Stop the animation and remove the line
    stop() {
      if (!this.isActive) return;
      
      cancelAnimationFrame(this.animationFrameId);
      this.isActive = false;
      
      const line = document.getElementById(this.lineId);
      if (line) {
        line.parentNode.removeChild(line);
      }
      
      return this;
    },
    
    // Update the line position (for moving elements)
    update() {
      if (!this.isActive) return;
      
      const source = this.getCoordinates(sourcePoint);
      const target = this.getCoordinates(targetPoint);
      
      const line = document.getElementById(this.lineId);
      if (line) {
        line.setAttribute('x1', source.x);
        line.setAttribute('y1', source.y);
        line.setAttribute('x2', target.x);
        line.setAttribute('y2', target.y);
      }
      
      return this;
    }
  };
  
  return controller;
};

/**
 * Create a ripple effect emanating from a point
 * @param {String} elementId - ID of the element to animate
 * @param {Object} options - Animation options
 * @returns {Object} Animation controller with start/stop methods
 */
export const createRippleEffect = (elementId, options = {}) => {
  const defaults = {
    color: 'rgba(255, 0, 0, 0.5)',
    duration: 2000,
    count: 3,
    maxSize: 100,
    interval: 500
  };
  
  const settings = { ...defaults, ...options };
  
  // Animation controller object
  const controller = {
    elementId,
    isActive: false,
    intervalId: null,
    ripples: [],
    
    // Create a single ripple element
    createRipple() {
      const element = document.getElementById(elementId);
      if (!element) return null;
      
      const rect = element.getBoundingClientRect();
      
      const ripple = document.createElement('div');
      ripple.className = 'ripple-effect';
      ripple.style.position = 'absolute';
      ripple.style.left = `${rect.left + rect.width / 2}px`;
      ripple.style.top = `${rect.top + rect.height / 2}px`;
      ripple.style.width = '10px';
      ripple.style.height = '10px';
      ripple.style.borderRadius = '50%';
      ripple.style.backgroundColor = settings.color;
      ripple.style.transform = 'translate(-50%, -50%) scale(0)';
      ripple.style.opacity = '1';
      ripple.style.transition = `all ${settings.duration / 1000}s ease-out`;
      ripple.style.pointerEvents = 'none';
      ripple.style.zIndex = '999';
      
      document.body.appendChild(ripple);
      
      // Track the ripple
      this.ripples.push(ripple);
      
      // Animate the ripple
      setTimeout(() => {
        ripple.style.transform = `translate(-50%, -50%) scale(${settings.maxSize})`;
        ripple.style.opacity = '0';
      }, 10);
      
      // Remove the ripple after animation completes
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
        this.ripples = this.ripples.filter(r => r !== ripple);
      }, settings.duration);
      
      return ripple;
    },
    
    // Start the ripple animation
    start() {
      if (this.isActive) return;
      
      this.isActive = true;
      
      // Create initial ripple
      this.createRipple();
      
      // Create subsequent ripples at intervals
      this.intervalId = setInterval(() => {
        if (this.ripples.length < settings.count) {
          this.createRipple();
        }
      }, settings.interval);
      
      // Stop after creating all ripples
      setTimeout(() => {
        clearInterval(this.intervalId);
      }, settings.interval * settings.count);
      
      return this;
    },
    
    // Stop the ripple animation
    stop() {
      if (!this.isActive) return;
      
      clearInterval(this.intervalId);
      this.isActive = false;
      
      // Remove all ripples
      this.ripples.forEach(ripple => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      });
      
      this.ripples = [];
      
      return this;
    }
  };
  
  return controller;
};

/**
 * Create a data flow animation between devices
 * @param {Array} path - Array of element IDs or coordinate points forming the path
 * @param {Object} options - Animation options
 * @returns {Object} Animation controller with start/stop methods
 */
export const createDataFlowAnimation = (path, options = {}) => {
  const defaults = {
    color: '#00ff00',
    particleSize: 4,
    particleCount: 5,
    speed: 2,
    container: 'map-container',
    loop: true
  };
  
  const settings = { ...defaults, ...options };
  
  // Generate a unique ID for the animation
  const animationId = `data-flow-${Math.random().toString(36).substr(2, 9)}`;
  
  // Animation controller object
  const controller = {
    animationId,
    isActive: false,
    particles: [],
    animationFrameId: null,
    pathCoordinates: [],
    
    // Get coordinates from element or use direct coordinates
    getCoordinates(point) {
      if (typeof point === 'string') {
        const element = document.getElementById(point);
        if (!element) return { x: 0, y: 0 };
        
        const rect = element.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
      }
      
      return point;
    },
    
    // Initialize the SVG container and path
    initialize() {
      const container = document.getElementById(settings.container);
      if (!container) return false;
      
      // Create SVG container if it doesn't exist
      let svgContainer = document.getElementById(`${settings.container}-svg-overlay`);
      if (!svgContainer) {
        svgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgContainer.setAttribute('id', `${settings.container}-svg-overlay`);
        svgContainer.setAttribute('class', 'svg-overlay');
        svgContainer.setAttribute('width', '100%');
        svgContainer.setAttribute('height', '100%');
        svgContainer.style.position = 'absolute';
        svgContainer.style.top = '0';
        svgContainer.style.left = '0';
        svgContainer.style.pointerEvents = 'none';
        svgContainer.style.zIndex = '1000';
        
        container.style.position = 'relative';
        container.appendChild(svgContainer);
      }
      
      // Convert path points to coordinates
      this.pathCoordinates = path.map(point => this.getCoordinates(point));
      
      // Create the path element
      const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pathElement.setAttribute('id', `${this.animationId}-path`);
      pathElement.setAttribute('fill', 'none');
      pathElement.setAttribute('stroke', settings.color);
      pathElement.setAttribute('stroke-width', '2');
      pathElement.setAttribute('opacity', '0.5');
      
      // Generate the path data
      let pathData = `M ${this.pathCoordinates[0].x} ${this.pathCoordinates[0].y}`;
      for (let i = 1; i < this.pathCoordinates.length; i++) {
        pathData += ` L ${this.pathCoordinates[i].x} ${this.pathCoordinates[i].y}`;
      }
      
      pathElement.setAttribute('d', pathData);
      svgContainer.appendChild(pathElement);
      
      // Create particles
      for (let i = 0; i < settings.particleCount; i++) {
        const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        particle.setAttribute('id', `${this.animationId}-particle-${i}`);
        particle.setAttribute('r', settings.particleSize);
        particle.setAttribute('fill', settings.color);
        
        // Position particle along the path with even spacing
        const progress = i / settings.particleCount;
        particle.setAttribute('cx', this.pathCoordinates[0].x);
        particle.setAttribute('cy', this.pathCoordinates[0].y);
        
        svgContainer.appendChild(particle);
        
        this.particles.push({
          element: particle,
          progress,
          speed: settings.speed * (0.8 + Math.random() * 0.4) // Slight speed variation
        });
      }
      
      return true;
    },
    
    // Animate particles along the path
    animateParticles() {
      if (!this.isActive) return;
      
      this.particles.forEach(particle => {
        // Update particle progress
        particle.progress += particle.speed / 1000;
        
        // Loop back to start if needed
        if (particle.progress > 1) {
          if (settings.loop) {
            particle.progress = 0;
          } else {
            particle.progress = 1;
          }
        }
        
        // Calculate position along the path
        const position = this.getPositionAlongPath(particle.progress);
        
        // Update particle position
        particle.element.setAttribute('cx', position.x);
        particle.element.setAttribute('cy', position.y);
      });
      
      // Continue animation
      this.animationFrameId = requestAnimationFrame(() => this.animateParticles());
    },
    
    // Calculate position along the path based on progress (0-1)
    getPositionAlongPath(progress) {
      if (this.pathCoordinates.length === 0) return { x: 0, y: 0 };
      if (this.pathCoordinates.length === 1) return this.pathCoordinates[0];
      
      // Calculate total path length
      let totalLength = 0;
      const segmentLengths = [];
      
      for (let i = 1; i < this.pathCoordinates.length; i++) {
        const prev = this.pathCoordinates[i - 1];
        const curr = this.pathCoordinates[i];
        
        const dx = curr.x - prev.x;
        const dy = curr.y - prev.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        
        segmentLengths.push(length);
        totalLength += length;
      }
      
      // Find the segment containing the progress point
      const targetDistance = progress * totalLength;
      let distanceSoFar = 0;
      let segmentIndex = 0;
      
      for (let i = 0; i < segmentLengths.length; i++) {
        if (distanceSoFar + segmentLengths[i] >= targetDistance) {
          segmentIndex = i;
          break;
        }
        distanceSoFar += segmentLengths[i];
      }
      
      // Calculate position within the segment
      const segmentProgress = (targetDistance - distanceSoFar) / segmentLengths[segmentIndex];
      const start = this.pathCoordinates[segmentIndex];
      const end = this.pathCoordinates[segmentIndex + 1];
      
      return {
        x: start.x + (end.x - start.x) * segmentProgress,
        y: start.y + (end.y - start.y) * segmentProgress
      };
    },
    
    // Start the data flow animation
    start() {
      if (this.isActive) return;
      
      if (this.initialize()) {
        this.isActive = true;
        this.animateParticles();
      }
      
      return this;
    },
    
    // Stop the animation and remove elements
    stop() {
      if (!this.isActive) return;
      
      cancelAnimationFrame(this.animationFrameId);
      this.isActive = false;
      
      // Remove all elements
      const svgContainer = document.getElementById(`${settings.container}-svg-overlay`);
      if (svgContainer) {
        const pathElement = document.getElementById(`${this.animationId}-path`);
        if (pathElement) {
          svgContainer.removeChild(pathElement);
        }
        
        this.particles.forEach((particle, index) => {
          const element = document.getElementById(`${this.animationId}-particle-${index}`);
          if (element) {
            svgContainer.removeChild(element);
          }
        });
      }
      
      this.particles = [];
      
      return this;
    },
    
    // Update the animation path
    updatePath(newPath) {
      // Stop current animation
      const wasActive = this.isActive;
      this.stop();
      
      // Update path
      path = newPath;
      
      // Restart if it was active
      if (wasActive) {
        this.start();
      }
      
      return this;
    }
  };
  
  return controller;
};

/**
 * Create a glowing highlight effect around an element
 * @param {String} elementId - ID of the element to highlight
 * @param {Object} options - Animation options
 * @returns {Object} Animation controller with start/stop methods
 */
export const createGlowEffect = (elementId, options = {}) => {
  const defaults = {
    color: '#ff0000',
    intensity: 5,
    duration: 2000,
    pulseEffect: true
  };
  
  const settings = { ...defaults, ...options };
  
  // Animation controller object
  const controller = {
    elementId,
    isActive: false,
    intervalId: null,
    
    // Start the glow effect
    start() {
      if (this.isActive) return;
      
      const element = document.getElementById(elementId);
      if (!element) return;
      
      // Store original styles
      this.originalStyles = {
        boxShadow: element.style.boxShadow,
        transition: element.style.transition
      };
      
      // Set up the glow effect
      element.style.transition = `box-shadow ${settings.duration / 2000}s ease-in-out`;
      element.style.boxShadow = `0 0 ${settings.intensity * 2}px ${settings.intensity}px ${settings.color}`;
      
      this.isActive = true;
      
      // Add pulsing effect if enabled
      if (settings.pulseEffect) {
        let glowIntensity = settings.intensity;
        let increasing = false;
        
        this.intervalId = setInterval(() => {
          if (increasing) {
            glowIntensity += 1;
            if (glowIntensity >= settings.intensity * 1.5) {
              increasing = false;
            }
          } else {
            glowIntensity -= 1;
            if (glowIntensity <= settings.intensity * 0.5) {
              increasing = true;
            }
          }
          
          element.style.boxShadow = `0 0 ${glowIntensity * 2}px ${glowIntensity}px ${settings.color}`;
        }, settings.duration / 20);
      }
      
      return this;
    },
    
    // Stop the glow effect
    stop() {
      if (!this.isActive) return;
      
      clearInterval(this.intervalId);
      this.isActive = false;
      
      // Restore original styles
      const element = document.getElementById(elementId);
      if (element && this.originalStyles) {
        element.style.boxShadow = this.originalStyles.boxShadow;
        element.style.transition = this.originalStyles.transition;
      }
      
      return this;
    }
  };
  
  return controller;
};

/**
 * Create an explosion effect at a specific point
 * @param {Object} point - Coordinates {x, y} or element ID
 * @param {Object} options - Animation options
 * @returns {Promise} Promise that resolves when animation completes
 */
export const createExplosionEffect = (point, options = {}) => {
  const defaults = {
    color: '#ff5500',
    particleCount: 20,
    duration: 1000,
    size: 50,
    container: document.body
  };
  
  const settings = { ...defaults, ...options };
  
  return new Promise((resolve) => {
    // Get coordinates from element or use direct coordinates
    const getCoordinates = (p) => {
      if (typeof p === 'string') {
        const element = document.getElementById(p);
        if (!element) return { x: 0, y: 0 };
        
        const rect = element.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
      }
      
      return p;
    };
    
    const coordinates = getCoordinates(point);
    
    // Create container for explosion particles
    const explosionContainer = document.createElement('div');
    explosionContainer.style.position = 'absolute';
    explosionContainer.style.left = '0';
    explosionContainer.style.top = '0';
    explosionContainer.style.width = '100%';
    explosionContainer.style.height = '100%';
    explosionContainer.style.pointerEvents = 'none';
    explosionContainer.style.zIndex = '9999';
    explosionContainer.style.overflow = 'hidden';
    
    settings.container.appendChild(explosionContainer);
    
    // Create particles
    const particles = [];
    
    for (let i = 0; i < settings.particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = `${Math.random() * 10 + 5}px`;
      particle.style.height = particle.style.width;
      particle.style.backgroundColor = settings.color;
      particle.style.borderRadius = '50%';
      particle.style.left = `${coordinates.x}px`;
      particle.style.top = `${coordinates.y}px`;
      particle.style.transform = 'translate(-50%, -50%)';
      particle.style.opacity = '1';
      
      // Random direction and speed
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * settings.size / 10 + settings.size / 20;
      const distance = Math.random() * settings.size;
      
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      
      // Add to container
      explosionContainer.appendChild(particle);
      particles.push({ element: particle, dx, dy, speed });
    }
    
    // Create initial flash
    const flash = document.createElement('div');
    flash.style.position = 'absolute';
    flash.style.width = `${settings.size}px`;
    flash.style.height = `${settings.size}px`;
    flash.style.backgroundColor = settings.color;
    flash.style.borderRadius = '50%';
    flash.style.left = `${coordinates.x}px`;
    flash.style.top = `${coordinates.y}px`;
    flash.style.transform = 'translate(-50%, -50%)';
    flash.style.opacity = '0.8';
    flash.style.boxShadow = `0 0 ${settings.size / 2}px ${settings.size / 4}px ${settings.color}`;
    
    explosionContainer.appendChild(flash);
    
    // Animate flash
    setTimeout(() => {
      flash.style.transition = `all ${settings.duration / 2000}s ease-out`;
      flash.style.opacity = '0';
      flash.style.width = `${settings.size * 2}px`;
      flash.style.height = `${settings.size * 2}px`;
    }, 10);
    
    // Animate particles
    let startTime = Date.now();
    
    const animateParticles = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / settings.duration;
      
      if (progress >= 1) {
        // Remove all elements
        explosionContainer.parentNode.removeChild(explosionContainer);
        resolve();
        return;
      }
      
      // Update particle positions
      particles.forEach(particle => {
        const x = coordinates.x + particle.dx * progress;
        const y = coordinates.y + particle.dy * progress;
        
        particle.element.style.left = `${x}px`;
        particle.element.style.top = `${y}px`;
        particle.element.style.opacity = `${1 - progress}`;
      });
      
      requestAnimationFrame(animateParticles);
    };
    
    animateParticles();
  });
};

/**
 * Create a notification alert animation
 * @param {String} message - Alert message to display
 * @param {Object} options - Animation options
 * @returns {Promise} Promise that resolves when animation completes
 */
export const createAlertNotification = (message, options = {}) => {
  const defaults = {
    type: 'error', // 'error', 'warning', 'success', 'info'
    duration: 5000,
    position: 'top-right', // 'top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'
    showIcon: true,
    showCloseButton: true,
    container: document.body
  };
  
  const settings = { ...defaults, ...options };
  
  return new Promise((resolve) => {
    // Create notification container if it doesn't exist
    let notificationContainer = document.getElementById('notification-container');
    
    if (!notificationContainer) {
      notificationContainer = document.createElement('div');
      notificationContainer.id = 'notification-container';
      notificationContainer.style.position = 'fixed';
      notificationContainer.style.zIndex = '9999';
      
      // Position the container
      switch (settings.position) {
        case 'top-right':
          notificationContainer.style.top = '20px';
          notificationContainer.style.right = '20px';
          break;
        case 'top-left':
          notificationContainer.style.top = '20px';
          notificationContainer.style.left = '20px';
          break;
        case 'bottom-right':
          notificationContainer.style.bottom = '20px';
          notificationContainer.style.right = '20px';
          break;
        case 'bottom-left':
          notificationContainer.style.bottom = '20px';
          notificationContainer.style.left = '20px';
          break;
        case 'top-center':
          notificationContainer.style.top = '20px';
          notificationContainer.style.left = '50%';
          notificationContainer.style.transform = 'translateX(-50%)';
          break;
        case 'bottom-center':
          notificationContainer.style.bottom = '20px';
          notificationContainer.style.left = '50%';
          notificationContainer.style.transform = 'translateX(-50%)';
          break;
      }
      
      settings.container.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${settings.type}`;
    notification.style.backgroundColor = {
      error: '#ff5555',
      warning: '#ffaa55',
      success: '#55aa55',
      info: '#5555ff'
    }[settings.type];
    notification.style.color = '#ffffff';
    notification.style.padding = '15px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    notification.style.marginBottom = '10px';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.justifyContent = 'space-between';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    // Create content container
    const contentContainer = document.createElement('div');
    contentContainer.style.display = 'flex';
    contentContainer.style.alignItems = 'center';
    
    // Add icon if enabled
    if (settings.showIcon) {
      const icon = document.createElement('div');
      icon.style.marginRight = '10px';
      icon.style.fontSize = '20px';
      
      // Set icon based on type
      icon.innerHTML = {
        error: '⚠️',
        warning: '⚠️',
        success: '✅',
        info: 'ℹ️'
      }[settings.type];
      
      contentContainer.appendChild(icon);
    }
    
    // Add message
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    contentContainer.appendChild(messageElement);
    
    notification.appendChild(contentContainer);
    
    // Add close button if enabled
    if (settings.showCloseButton) {
      const closeButton = document.createElement('button');
      closeButton.textContent = '×';
      closeButton.style.background = 'none';
      closeButton.style.border = 'none';
      closeButton.style.color = '#ffffff';
      closeButton.style.fontSize = '20px';
      closeButton.style.cursor = 'pointer';
      closeButton.style.marginLeft = '10px';
      
      closeButton.addEventListener('click', () => {
        closeNotification();
      });
      
      notification.appendChild(closeButton);
    }
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Function to close the notification
    const closeNotification = () => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(-20px)';
      
      // Remove after animation completes
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
        resolve();
      }, 300);
    };
    
    // Auto-close after duration
    if (settings.duration > 0) {
      setTimeout(() => {
        closeNotification();
      }, settings.duration);
    }
  });
};

/**
 * Create a radar scan effect on the map
 * @param {Object} center - Center coordinates {x, y} or element ID
 * @param {Object} options - Animation options
 * @returns {Object} Animation controller with start/stop methods
 */
export const createRadarScanEffect = (center, options = {}) => {
  const defaults = {
    color: 'rgba(0, 255, 0, 0.5)',
    radius: 200,
    duration: 3000,
    container: 'map-container'
  };
  
  const settings = { ...defaults, ...options };
  
  // Generate a unique ID for the animation
  const radarId = `radar-scan-${Math.random().toString(36).substr(2, 9)}`;
  
  // Animation controller object
  const controller = {
    radarId,
    isActive: false,
    animationFrameId: null,
    
    // Get coordinates from element or use direct coordinates
    getCoordinates(point) {
      if (typeof point === 'string') {
        const element = document.getElementById(point);
        if (!element) return { x: 0, y: 0 };
        
        const rect = element.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
      }
      
      return point;
    },
    
    // Initialize the SVG container and radar elements
    initialize() {
      const container = document.getElementById(settings.container);
      if (!container) return false;
      
      // Create SVG container if it doesn't exist
      let svgContainer = document.getElementById(`${settings.container}-svg-overlay`);
      if (!svgContainer) {
        svgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgContainer.setAttribute('id', `${settings.container}-svg-overlay`);
        svgContainer.setAttribute('class', 'svg-overlay');
        svgContainer.setAttribute('width', '100%');
        svgContainer.setAttribute('height', '100%');
        svgContainer.style.position = 'absolute';
        svgContainer.style.top = '0';
        svgContainer.style.left = '0';
        svgContainer.style.pointerEvents = 'none';
        svgContainer.style.zIndex = '1000';
        
        container.style.position = 'relative';
        container.appendChild(svgContainer);
      }
      
      const coordinates = this.getCoordinates(center);
      
      // Create the radar circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('id', `${this.radarId}-circle`);
      circle.setAttribute('cx', coordinates.x);
      circle.setAttribute('cy', coordinates.y);
      circle.setAttribute('r', '0');
      circle.setAttribute('fill', 'none');
      circle.setAttribute('stroke', settings.color);
      circle.setAttribute('stroke-width', '2');
      svgContainer.appendChild(circle);
      
      // Create the radar sweep
      const sweep = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      sweep.setAttribute('id', `${this.radarId}-sweep`);
      sweep.setAttribute('fill', settings.color);
      sweep.setAttribute('transform', `translate(${coordinates.x}, ${coordinates.y})`);
      svgContainer.appendChild(sweep);
      
      return true;
    },
    
    // Animate the radar scan
    animateRadar(startTime) {
      if (!this.isActive) return;
      
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % settings.duration) / settings.duration;
      
      // Update circle radius
      const circle = document.getElementById(`${this.radarId}-circle`);
      if (circle) {
        const pulseProgress = (elapsed % (settings.duration / 2)) / (settings.duration / 2);
        const pulseRadius = settings.radius * (1 - Math.abs(pulseProgress - 0.5) * 2);
        circle.setAttribute('r', pulseRadius);
        circle.setAttribute('opacity', 1 - pulseProgress);
      }
      
      // Update sweep angle
      const sweep = document.getElementById(`${this.radarId}-sweep`);
      if (sweep) {
        const angle = progress * Math.PI * 2;
        const x1 = Math.cos(angle) * settings.radius;
        const y1 = Math.sin(angle) * settings.radius;
        
        // Create a path for the sweep (a sector/pie slice)
        const largeArcFlag = angle > Math.PI ? 1 : 0;
        const pathData = `M 0 0 L ${x1} ${y1} A ${settings.radius} ${settings.radius} 0 ${largeArcFlag} 0 ${settings.radius} 0 Z`;
        
        sweep.setAttribute('d', pathData);
        sweep.setAttribute('opacity', '0.5');
      }
      
      // Continue animation
      this.animationFrameId = requestAnimationFrame(() => this.animateRadar(startTime));
    },
    
    // Start the radar scan animation
    start() {
      if (this.isActive) return;
      
      if (this.initialize()) {
        this.isActive = true;
        this.animateRadar(Date.now());
      }
      
      return this;
    },
    
    // Stop the animation and remove elements
    stop() {
      if (!this.isActive) return;
      
      cancelAnimationFrame(this.animationFrameId);
      this.isActive = false;
      
      // Remove all elements
      const svgContainer = document.getElementById(`${settings.container}-svg-overlay`);
      if (svgContainer) {
        const circle = document.getElementById(`${this.radarId}-circle`);
        if (circle) {
          svgContainer.removeChild(circle);
        }
        
        const sweep = document.getElementById(`${this.radarId}-sweep`);
        if (sweep) {
          svgContainer.removeChild(sweep);
        }
      }
      
      return this;
    },
    
    // Update the radar center position
    updateCenter(newCenter) {
      const wasActive = this.isActive;
      this.stop();
      
      center = newCenter;
      
      if (wasActive) {
        this.start();
      }
      
      return this;
    }
  };
  
  return controller;
};

/**
 * Create a CSS animation class and add it to the document
 * @param {String} name - Animation name
 * @param {String} keyframes - CSS keyframes definition
 * @returns {String} Class name that can be applied to elements
 */
export const createCSSAnimation = (name, keyframes) => {
  const className = `animation-${name}`;
  
  // Check if the animation already exists
  if (!document.getElementById(`animation-style-${name}`)) {
    const styleElement = document.createElement('style');
    styleElement.id = `animation-style-${name}`;
    
    styleElement.textContent = `
      @keyframes ${name} {
        ${keyframes}
      }
      
      .${className} {
        animation: ${name} 2s ease-in-out infinite;
      }
    `;
    
    document.head.appendChild(styleElement);
  }
  
  return className;
};

// Create some predefined CSS animations
export const initializeAnimations = () => {
  // Pulse animation
  createCSSAnimation('pulse', `
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
  `);
  
  // Blink animation
  createCSSAnimation('blink', `
    0% { opacity: 1; }
    50% { opacity: 0.2; }
    100% { opacity: 1; }
  `);
  
  // Shake animation
  createCSSAnimation('shake', `
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  `);
  
  // Rotate animation
  createCSSAnimation('rotate', `
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  `);
  
  // Fade in animation
  createCSSAnimation('fadeIn', `
    from { opacity: 0; }
    to { opacity: 1; }
  `);
  
  // Fade out animation
  createCSSAnimation('fadeOut', `
    from { opacity: 1; }
    to { opacity: 0; }
  `);
};

// Initialize animations when the module is imported
initializeAnimations();