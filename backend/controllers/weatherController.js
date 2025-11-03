const {pool} = require('../config/db');

// Get current weather (you can integrate real weather API here)
exports.getCurrentWeather = async (req, res) => {
  try {
    const { location } = req.query;

    // This is mock data - integrate OpenWeatherMap or similar API
    const weatherData = {
      location: location || 'Tegal, Indonesia',
      temperature: '20°C',
      condition: 'Dramatic Cloudy',
      windSpeed: '12km/h',
      rainChance: '24%',
      pressure: '720 hpa',
      uvIndex: '2.3',
      humidity: '65%',
      hourlyForecast: [
        { time: '7 PM', rainChance: 44 },
        { time: '8 PM', rainChance: 30 },
        { time: '9 PM', rainChance: 67 },
        { time: '10 PM', rainChance: 72 }
      ],
      sunrise: '4:20 AM',
      sunset: '5:50 PM'
    };

    // Save to history
    await pool.query(
      'INSERT INTO weather_history (location_name, temperature, condition, wind_speed) VALUES ($1, $2, $3, $4)',
      [weatherData.location, 20, weatherData.condition, 12]
    );

    res.json(weatherData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get weekly temperature
exports.getWeeklyTemperature = async (req, res) => {
  try {
    const weeklyData = [
      { week: 'Week 1', temp: 15 },
      { week: 'Week 2', temp: 17 },
      { week: 'Week 3', temp: 23 },
      { week: 'Week 4', temp: 19 }
    ];

    res.json(weeklyData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};