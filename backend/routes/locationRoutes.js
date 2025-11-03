const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, locationController.getSavedLocations);
router.post('/', authMiddleware, locationController.addLocation);
router.delete('/:id', authMiddleware, locationController.deleteLocation);

module.exports = router;