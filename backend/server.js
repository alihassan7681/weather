const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { createTables } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const locationRoutes = require('./routes/locationRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
createTables();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/locations', locationRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Weather Dashboard API is running!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`PostgreSQL Database Connected`);
});