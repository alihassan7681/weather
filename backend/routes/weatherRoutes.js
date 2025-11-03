const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

router.get('/current', weatherController.getCurrentWeather);
router.get('/weekly', weatherController.getWeeklyTemperature);

module.exports = router;