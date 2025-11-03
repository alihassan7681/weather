const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'weather_dashboard',
  password: process.env.DB_PASSWORD || 'your_password',
  port: process.env.DB_PORT || 5432,
});

// Create tables if they don't exist
const createTables = async () => {
  try {
    const usersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const savedLocationsTable = `
      CREATE TABLE IF NOT EXISTS saved_locations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        city_name VARCHAR(100) NOT NULL,
        country VARCHAR(100) NOT NULL,
        lat DECIMAL(10,6) NOT NULL,
        lon DECIMAL(10,6) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const weatherHistoryTable = `
      CREATE TABLE IF NOT EXISTS weather_history (
        id SERIAL PRIMARY KEY,
        location_name VARCHAR(100) NOT NULL,
        temperature DECIMAL(5,2),
        condition VARCHAR(100),
        wind_speed DECIMAL(5,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.query(usersTable);
    await pool.query(savedLocationsTable);
    await pool.query(weatherHistoryTable);
    console.log('Database tables created successfully');
  } catch (error) {
    console.error(' Error creating tables:', error);
  }
};


module.exports = { pool, createTables };