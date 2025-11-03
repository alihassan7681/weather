import React, { useState, useEffect } from 'react';
import { worldCities } from '../data/worldCities';
import { getRealWeatherData } from '../data/weatherAPI';
import SavedLocationsView from './views/SavedLocationsView';
import LoginForm from './LoginForm';
import MapView from './views/MapView';
import CalendarView from './views/CalendarView';
import DashboardView from './views/DashboardView';  

const WeatherDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [currentDate, setCurrentDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  const [darkTheme, setDarkTheme] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [savedLocations, setSavedLocations] = useState([]);

  // Save current location
  const saveCurrentLocation = () => {
    if (!selectedCity) {
      alert('Please select a city first!');
      return;
    }
    
    const locationExists = savedLocations.some(
      loc => loc.name === selectedCity.name && loc.country === selectedCity.country
    );
    
    if (locationExists) {
      alert('Location already saved!');
      return;
    }
    
    const newLocation = {
      id: Date.now(),
      ...selectedCity,
      savedAt: new Date().toLocaleString()
    };
    
    setSavedLocations(prev => [...prev, newLocation]);
    alert(`${selectedCity.name} saved to your locations!`);
  };

  // Remove saved location
  const removeSavedLocation = (locationId) => {
    const updatedLocations = savedLocations.filter(loc => loc.id !== locationId);
    setSavedLocations(updatedLocations);
  };

  // Load location from saved locations
  const loadSavedLocation = (location) => {
    setSelectedCity(location);
    fetchWeatherData(location);
    setActiveMenu('Dashboard');
  };

  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  // Initialize with default city (Karachi)
useEffect(() => {
  const defaultCity = worldCities.find(c => c.name === 'London');
  if (defaultCity) {
    setSelectedCity(defaultCity);
    fetchWeatherData(defaultCity);
  }
}, []);

  // Update current date and time every second
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      setCurrentDate(now.toLocaleDateString('en-US', options));
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: true 
      }));
    };
    
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Fetch real weather data
  const fetchWeatherData = async (city) => {
    setLoading(true);
    try {
      const data = await getRealWeatherData(city.lat, city.lon, city.timezone);
      setWeatherData({ ...data, location: city.name, country: city.country });
    } catch (error) {
      console.error('Error fetching weather:', error);
      alert('Unable to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter cities based on search
  const filteredCities = worldCities.filter(city =>
    city.name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
    city.country.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  // Handle city selection
  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSearchQuery('');
    setShowSuggestions(false);
    fetchWeatherData(city);
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    window.location.reload();
  };

  // Handle menu click
  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  // Toggle theme
  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  // Handle login success
  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setShowLoginForm(false);
  };

  // Calendar navigation
  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  // Render different views based on active menu
  const renderView = () => {
    switch (activeMenu) {
      case 'Map':
        return (
          <MapView 
            selectedCity={selectedCity} 
            weatherData={weatherData}
            darkTheme={darkTheme}
            onBack={() => handleMenuClick('Dashboard')}
          />
        );
      
      case 'Calendar':
        return (
          <CalendarView 
            darkTheme={darkTheme}
            weatherData={weatherData}
            currentMonth={currentMonth}
            onBack={() => handleMenuClick('Dashboard')}
            onNavigateMonth={navigateMonth}
          />
        );
      
      case 'Saved Location':
        return (
          <SavedLocationsView 
            savedLocations={savedLocations}
            selectedCity={selectedCity}
            darkTheme={darkTheme}
            onSaveLocation={saveCurrentLocation}
            onRemoveLocation={removeSavedLocation}
            onLoadLocation={loadSavedLocation}
            onBack={() => handleMenuClick('Dashboard')}
          />
        );
      
      default:
        return (
          <DashboardView 
            darkTheme={darkTheme}
            weatherData={weatherData}
            selectedCity={selectedCity}
            currentDate={currentDate}
            currentTime={currentTime}
            loading={loading}
            searchQuery={searchQuery}
            showSuggestions={showSuggestions}
            filteredCities={filteredCities}
            isAuthenticated={isAuthenticated}
            user={user}
            activeMenu={activeMenu}
            onMenuClick={handleMenuClick}
            onToggleTheme={toggleTheme}
            onShowLoginForm={() => setShowLoginForm(true)}
            onLogout={handleLogout}
            onSearchChange={handleSearchChange}
            onCitySelect={handleCitySelect}
            onSaveCurrentLocation={saveCurrentLocation}
            onSetShowSuggestions={setShowSuggestions}
          />
        );
    }
  };

  return (
    <>
      {renderView()}
      {showLoginForm && (
        <LoginForm 
          onClose={() => setShowLoginForm(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
};

export default WeatherDashboard;