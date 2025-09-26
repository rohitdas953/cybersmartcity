const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Import routes
const deviceRoutes = require('./routes/devices');
const incidentRoutes = require('./routes/incidents');
const analyticsRoutes = require('./routes/analytics');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/devices', deviceRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../frontend/build', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});