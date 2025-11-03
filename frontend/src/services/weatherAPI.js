import axios from 'axios';

// OpenWeatherMap API Configuration
const OPENWEATHER_API_KEY = '1735716f18fa308b6e60ea0c35128a8a'; 
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const OPENWEATHER_ONECALL_URL = 'https://api.openweathermap.org/data/3.0/onecall';

export const getRealWeatherData = async (lat, lon, timezone) => {
  try {
    // Current weather + forecast
    const currentWeatherUrl = `${OPENWEATHER_BASE_URL}/weather`;
    const forecastUrl = `${OPENWEATHER_BASE_URL}/forecast`;
    
    // Fetch current weather
    const currentResponse = await axios.get(currentWeatherUrl, {
      params: {
        lat: lat,
        lon: lon,
        appid: OPENWEATHER_API_KEY,
        units: 'metric'
      }
    });

    // Fetch 5-day forecast
    const forecastResponse = await axios.get(forecastUrl, {
      params: {
        lat: lat,
        lon: lon,
        appid: OPENWEATHER_API_KEY,
        units: 'metric'
      }
    });

    const current = currentResponse.data;
    const forecast = forecastResponse.data;

    // Get city time
    const currentUTCTime = new Date();
    let cityTime;
    try {
      cityTime = new Date(currentUTCTime.toLocaleString("en-US", { 
        timeZone: timezone 
      }));
    } catch (error) {
      cityTime = new Date(currentUTCTime.getTime() + (current.timezone * 1000));
    }
    
    const bestFormattedTime = cityTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    // Calculate sunrise/sunset
    const sunrise = new Date((current.sys.sunrise + current.timezone) * 1000)
      .toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC'
      });
    
    const sunset = new Date((current.sys.sunset + current.timezone) * 1000)
      .toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC'
      });

    // Hourly forecast (next 8 hours)
    const currentHour = cityTime.getHours();
    const hourlyRain = forecast.list.slice(0, 8).map((hour, index) => {
      const hourTime = new Date(hour.dt * 1000);
      const formattedHourTime = hourTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).replace(':00', '');
      
      return {
        time: formattedHourTime,
        chance: hour.pop ? Math.round(hour.pop * 100) : 0,
        temp: Math.round(hour.main.temp)
      };
    });

    // Weekly forecast (7 days)
    const dailyForecasts = {};
    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = {
          temps: [],
          condition: item.weather[0].main,
          date: date
        };
      }
      dailyForecasts[date].temps.push(item.main.temp);
    });

    const weeklyTemp = Object.values(dailyForecasts).slice(0, 7).map((day, index) => {
      const temps = day.temps;
      const maxTemp = Math.max(...temps);
      const minTemp = Math.min(...temps);
      const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
      
      return {
        week: index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : 
              new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
        temp: Math.round(avgTemp),
        maxTemp: Math.round(maxTemp),
        minTemp: Math.round(minTemp),
        date: day.date,
        condition: day.condition
      };
    });

    const condition = current.weather[0].main;

    // Construct weather data
    const weatherData = {
      location: current.name,
      country: current.sys.country,
      region: '',
      coordinates: { lat: current.coord.lat, lon: current.coord.lon },
      
      // Local time
      localTime: bestFormattedTime,
      localTimeRaw: cityTime.toISOString(),
      localTimeEpoch: Math.floor(cityTime.getTime() / 1000),
      timezone: timezone,
      
      // Current weather - ACCURATE TEMPERATURE
      temperature: Math.round(current.main.temp),
      feelsLike: Math.round(current.main.feels_like),
      condition: condition,
      description: current.weather[0].description,
      icon: current.weather[0].icon,
      isDay: current.weather[0].icon.includes('d'),
      
      // Wind data
      windSpeed: current.wind.speed,
      windSpeedKmh: Math.round(current.wind.speed * 3.6),
      windSpeedMph: Math.round(current.wind.speed * 2.237),
      windDirection: getWindDirection(current.wind.deg),
      windDegree: current.wind.deg,
      windGust: current.wind.gust ? Math.round(current.wind.gust * 3.6) : null,
      
      // Precipitation
      rainChance: forecast.list[0].pop ? Math.round(forecast.list[0].pop * 100) : 0,
      rain1h: current.rain?.['1h'] || 0,
      humidity: current.main.humidity,
      
      // Atmospheric
      pressure: Math.round(current.main.pressure),
      pressureSeaLevel: Math.round(current.main.sea_level || current.main.pressure),
      visibility: (current.visibility / 1000).toFixed(1),
      cloudiness: current.clouds.all,
      
      // UV and Air Quality
      uvIndex: 0, // OpenWeather free tier doesn't include UV
      airQualityIndex: 'N/A',
      
      // Sun times
      sunrise: sunrise,
      sunset: sunset,
      moonPhase: 'N/A',
      moonIllumination: 'N/A',
      
      // Hourly forecast
      hourlyForecast: hourlyRain,
      
      // Weekly forecast
      weeklyForecast: weeklyTemp,
      
      // Additional info
      lastUpdated: new Date(current.dt * 1000).toLocaleString(),
      lastUpdatedEpoch: current.dt
    };

    console.log('🌍 Location:', current.name, current.sys.country);
    console.log('🌡️ ACCURATE Temperature:', weatherData.temperature + '°C');
    console.log('🕐 Local Time:', bestFormattedTime);
    console.log('📅 Last Updated:', weatherData.lastUpdated);

    return weatherData;

  } catch (error) {
    console.error('Error fetching weather data:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      throw new Error('Invalid API Key. Please check your OpenWeatherMap key.');
    } else if (error.response?.status === 404) {
      throw new Error('Location not found. Please try another city.');
    } else {
      throw new Error('Unable to fetch weather data. Please try again later.');
    }
  }
};

/**
 * Convert wind degree to direction
 */
const getWindDirection = (deg) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                      'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
};

/**
 * Search cities by name
 */
export const searchCities = async (query) => {
  try {
    const response = await axios.get(`${OPENWEATHER_BASE_URL}/find`, {
      params: {
        q: query,
        appid: OPENWEATHER_API_KEY,
        cnt: 10
      }
    });
    
    return response.data.list.map(city => ({
      name: city.name,
      country: city.sys.country,
      region: '',
      lat: city.coord.lat,
      lon: city.coord.lon
    }));
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
};

/**
 * Get weather icon URL
 */
export const getWeatherIconUrl = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

/**
 * Format temperature
 */
export const formatTemperature = (temp, showUnit = true) => {
  return `${Math.round(temp)}${showUnit ? '°C' : '°'}`;
};

/**
 * Get UV Index level
 */
export const getUVLevel = (uvIndex) => {
  if (uvIndex <= 2) return { level: 'Low', color: 'green' };
  if (uvIndex <= 5) return { level: 'Moderate', color: 'yellow' };
  if (uvIndex <= 7) return { level: 'High', color: 'orange' };
  if (uvIndex <= 10) return { level: 'Very High', color: 'red' };
  return { level: 'Extreme', color: 'purple' };
};

/**
 * Get Air Quality description
 */
export const getAirQualityText = (aqi) => {
  const levels = {
    1: { text: 'Good', color: 'green' },
    2: { text: 'Moderate', color: 'yellow' },
    3: { text: 'Unhealthy for Sensitive', color: 'orange' },
    4: { text: 'Unhealthy', color: 'red' },
    5: { text: 'Very Unhealthy', color: 'purple' }
  };
  return levels[aqi] || { text: 'Unknown', color: 'gray' };
};

/**
 * Get weather condition icon component name
 */
export const getWeatherIcon = (condition) => {
  const lowerCondition = condition.toLowerCase();
  
  if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) return 'WiDaySunny';
  if (lowerCondition.includes('cloud')) return 'WiCloudy';
  if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) return 'WiRain';
  if (lowerCondition.includes('thunder') || lowerCondition.includes('storm')) return 'WiThunderstorm';
  if (lowerCondition.includes('snow')) return 'WiSnow';
  if (lowerCondition.includes('mist') || lowerCondition.includes('fog')) return 'WiFog';
  
  return 'WiDayCloudy';
};

export default {
  getRealWeatherData,
  searchCities,
  getWeatherIconUrl,
  formatTemperature,
  getUVLevel,
  getAirQualityText,
  getWeatherIcon
};