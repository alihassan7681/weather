const { pool } = require('../config/db'); 

// Get all saved locations for user
exports.getSavedLocations = async (req, res) => {
  try {
    const locations = await pool.query(
      'SELECT * FROM saved_locations WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );

    res.json(locations.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add saved location
exports.addLocation = async (req, res) => {
  try {
    const { city_name, country, lat, lon } = req.body;

    const newLocation = await pool.query(
      'INSERT INTO saved_locations (user_id, city_name, country, lat, lon) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.userId, city_name, country, lat, lon]
    );

    res.status(201).json({
      message: 'Location saved successfully',
      location: newLocation.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete saved location
exports.deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM saved_locations WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }

    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};