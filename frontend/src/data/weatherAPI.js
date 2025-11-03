// Mock Weather API with consistent temperatures
export const getRealWeatherData = async (lat, lon, timezone) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // ✅ CONSISTENT TEMPERATURE: Same city = Same temperature always
  // Base temperature calculation based on coordinates (never changes for same city)
  const baseTemp = 15 + (lat * 0.1) + (lon * 0.01);
  const temp = Math.round(baseTemp);
  
  const conditions = ['Clear', 'Cloudy', 'Partly Cloudy', 'Rainy', 'Sunny'];
  
  // Real city time calculation
  const now = new Date();
  const cityTime = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
  
  // Format time function
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // ✅ CONSISTENT WEATHER PATTERNS: Same seed based on coordinates
  const weatherSeed = Math.abs(lat + lon);
  const conditionIndex = Math.floor(weatherSeed) % conditions.length;
  
  return {
    // ✅ SAME TEMPERATURE ALWAYS for same city
    temperature: temp,
    feelsLike: temp - 2,
    condition: conditions[conditionIndex],
    
    // ✅ CONSISTENT WEATHER DATA
    humidity: Math.round(40 + (weatherSeed % 40)),
    windSpeedKmh: Math.round(5 + (weatherSeed % 20)),
    windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(weatherSeed) % 8],
    pressure: Math.round(1000 + (weatherSeed % 30)),
    pressureSeaLevel: Math.round(1010 + (weatherSeed % 20)),
    uvIndex: (weatherSeed % 10),
    visibility: 5 + (weatherSeed % 10),
    rainChance: Math.round(weatherSeed % 100),
    cloudiness: Math.round(weatherSeed % 100),
    airQualityIndex: Math.round(1 + (weatherSeed % 5)),
    
    // ✅ REAL LOCAL TIME
    sunrise: '06:30 AM',
    sunset: '06:45 PM',
    location: 'Loading...',
    country: '',
    localTime: cityTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    }),
    lastUpdated: new Date().toISOString(),
    
    // ✅ CONSISTENT HOURLY FORECAST
    hourlyForecast: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      temp: Math.round(temp + (i - 12) * 0.5), // Gradual change through day
      chance: Math.round((weatherSeed + i) % 100)
    })),
    
    // ✅ CONSISTENT WEEKLY FORECAST  
    weeklyForecast: Array.from({ length: 7 }, (_, i) => ({
      week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      temp: Math.round(temp + (i - 3) * 1) // Small variations through week
    }))
  };
};