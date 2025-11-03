import React, { useState, useEffect } from 'react';
import {
  FiHome,
  FiMap,
  FiCalendar,
  FiBookmark,
  FiLogOut,
  FiUser,
  FiSearch,
  FiMoon,
  FiSun,
} from 'react-icons/fi';
import {
  WiDayCloudy,
  WiRain,
  WiBarometer,
  WiDaySunny,
  WiStrongWind,
  WiSunrise,
  WiSunset,
} from 'react-icons/wi';
import MenuItem from '../MenuItem';
import MobileMenuItem from '../MobileMenuItem';
import WeatherCard from '../WeatherCard';
import DetailItem from '../DetailItem';
import TemperatureChart from '../TemperatureChart';

const DashboardView = ({
  darkTheme,
  weatherData,
  selectedCity,
  currentDate,
  currentTime,
  loading,
  searchQuery,
  showSuggestions,
  filteredCities,
  isAuthenticated,
  user,
  activeMenu,
  onMenuClick,
  onToggleTheme,
  onShowLoginForm,
  onLogout,
  onSearchChange,
  onCitySelect,
  onSaveCurrentLocation,
  onSetShowSuggestions,
}) => {
  const [localCityTime, setLocalCityTime] = useState('');

  // update local city time every second
  useEffect(() => {
    if (!selectedCity) return;
    const updateLocalTime = () => {
      const now = new Date();
      try {
        const cityTime = new Date(
          now.toLocaleString('en-US', { timeZone: selectedCity.timezone })
        );
        setLocalCityTime(
          cityTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          })
        );
      } catch (error) {
        setLocalCityTime(
          now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          })
        );
      }
    };

    updateLocalTime();
    const interval = setInterval(updateLocalTime, 1000);
    return () => clearInterval(interval);
  }, [selectedCity]);

  // Background images mapping (explicit full URLs)
  const bgMap = {
    Sunny:
      'https://images.unsplash.com/photo-1587279535322-b20697908487?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3VubnklMjBza3l8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=1600',
    Clear:
      'https://images.unsplash.com/photo-1558418294-9da149757efe?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNsZWFyJTJDc2t5JTJDYmx1ZXx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=1600',
    Cloudy:
      'https://images.unsplash.com/photo-1626286723428-a5ef42602cee?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2xvdWR5JTJDc2t5fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=1600',
    Clouds:
      'https://images.unsplash.com/photo-1714881537823-d7085787e2bd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2xvdWRzJTJDc2t5fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=1600',
    Rain:
      'https://images.unsplash.com/photo-1666546519800-456bd99d16df?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFpbiUyQ3dlYXRoZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=1600',
    Drizzle:
      'https://images.unsplash.com/photo-1732717041583-e60c9d117fbb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZHJpenpsZSUyQ3JhaW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=1600',
    Thunderstorm:
      'https://images.unsplash.com/photo-1614289161194-94338b1d842f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dGh1bmRlcnN0b3JtJTJDbGlnaHRuaW5nfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=1600',
    Snow:
      'https://images.unsplash.com/photo-1679091384073-cab19ed4279c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c25vdyUyQ3dpbnRlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=1600',
    Mist:
      'https://images.unsplash.com/photo-1729013315108-1ee4f528f84e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWlzdCUyQ2ZvZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=1600',
    Haze:
      'https://images.unsplash.com/photo-1663051109655-d187b0ce9c1f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aGF6ZSUyQ2ZvZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=1600',
    Fog:
      'https://images.unsplash.com/photo-1654484503523-5b79487111dd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGZvZyUyQ21pc3R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=1600',
    Default:
      'https://images.unsplash.com/photo-1656740978404-874f95b253b7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2VhdGhlciUyQ2xhbmRzY2FwZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=1600',
  };

  // pick background based on condition
  const pickBackground = (cond) => {
    if (!cond) return bgMap.Default;
    const c = cond.toLowerCase();
    if (c.includes('sunny') || c.includes('clear')) return bgMap.Sunny;
    if (c.includes('cloud')) return bgMap.Cloudy;
    if (c.includes('rain') || c.includes('drizzle')) return bgMap.Rain;
    if (c.includes('thunder') || c.includes('storm')) return bgMap.Thunderstorm;
    if (c.includes('snow')) return bgMap.Snow;
    if (c.includes('mist') || c.includes('haze') || c.includes('fog')) return bgMap.Mist;
    return bgMap.Default;
  };

  if (!weatherData) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          darkTheme ? 'bg-gray-900' : 'bg-gray-100'
        }`}
      >
        <div className="text-center">
          <WiDayCloudy className="text-6xl text-gray-500 mx-auto mb-4 animate-pulse" />
          <p className={darkTheme ? 'text-gray-300' : 'text-gray-700'}>
            Loading weather data...
          </p>
        </div>
      </div>
    );
  }

  // choose background image and compute readable text colors
  const bgImage = pickBackground(weatherData.condition);
  // decide if background weather is "light" (sunny/clear/snow) -> use dark text
  const isLightBg = /sunny|clear|snow/i.test(weatherData.condition || '');
  // override with darkTheme: if darkTheme is true, always use light text
  const effectiveLight = darkTheme ? false : isLightBg;
  const textColorClass = effectiveLight ? 'text-black' : 'text-white';
  const subTextColorClass = effectiveLight ? 'text-gray-700' : 'text-gray-300';
  const cardBgClass = effectiveLight ? 'bg-white/85 text-black' : 'bg-white/10 text-white';
  const glassCardBase =
    effectiveLight ? 'bg-white/75 backdrop-blur-md' : 'bg-white/10 backdrop-blur-sm';
  const borderColorClass = effectiveLight ? 'border-gray-200/60' : 'border-white/20';

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row transition-colors duration-700 relative bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,${
          darkTheme ? 0.45 : 0.08
        }), rgba(0,0,0,${darkTheme ? 0.45 : 0.08})), url(${bgImage})`,
      }}
    >
      {/* animated overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/5 to-black/10 mix-blend-overlay animate-pulse-slow" />

      {/* Sidebar - Desktop */}
      <div className="w-full lg:w-64 hidden lg:flex flex-col p-4 z-10" aria-hidden={false}>
        <div className={`${glassCardBase} p-4 rounded-2xl border ${borderColorClass} flex flex-col h-full`}>
          <div className="p-2 flex items-center gap-3">
            {/* <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: effectiveLight ? '#111827' : '#111827' }}>
              <WiDaySunny className={`${effectiveLight ? 'text-white' : 'text-white'} text-2xl`} />
            </div> */}
            <span className={`text-xl font-semibold ${effectiveLight ? 'text-black' : 'text-white'}`}>Weather Wise</span>

            <button
              onClick={onToggleTheme}
              className="ml-auto p-2 rounded-lg hover:bg-gray-200/20 transition-colors"
              aria-label="Toggle theme"
            >
              {darkTheme ? <FiSun className={effectiveLight ? 'text-black' : 'text-white'} /> : <FiMoon className={effectiveLight ? 'text-black' : 'text-white'} />}
            </button>
          </div>

          <nav className="flex-1 px-1 py-6 space-y-1">
            <MenuItem
              icon={<FiHome />}
              text="Dashboard"
              active={activeMenu === 'Dashboard'}
              onClick={() => onMenuClick('Dashboard')}
              darkTheme={!effectiveLight}
            />
            <MenuItem
              icon={<FiMap />}
              text="Map"
              active={activeMenu === 'Map'}
              onClick={() => onMenuClick('Map')}
              darkTheme={!effectiveLight}
            />
            <MenuItem
              icon={<FiCalendar />}
              text="Calendar"
              active={activeMenu === 'Calendar'}
              onClick={() => onMenuClick('Calendar')}
              darkTheme={!effectiveLight}
            />
            <MenuItem
              icon={<FiBookmark />}
              text="Saved Location"
              active={activeMenu === 'Saved Location'}
              onClick={() => onMenuClick('Saved Location')}
              darkTheme={!effectiveLight}
            />
          </nav>

          <div className="mt-auto pt-4 border-t" style={{ borderColor: effectiveLight ? 'rgba(0,0,0,0.06)' : undefined }}>
            {isAuthenticated ? (
              <MenuItem icon={<FiLogOut />} text="Logout" onClick={onLogout} darkTheme={!effectiveLight} />
            ) : (
              <MenuItem icon={<FiUser />} text="Login" onClick={onShowLoginForm} darkTheme={!effectiveLight} />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className={`${glassCardBase} lg:hidden relative z-20 p-4 border-b ${borderColorClass}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: effectiveLight ? '#111827' : '#111827' }}>
              <WiDaySunny className={`${effectiveLight ? 'text-white' : 'text-white'} text-lg`} />
            </div> */}
            <span className={`${effectiveLight ? 'text-black' : 'text-white'} text-lg font-semibold`}>Weather Wise</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg hover:bg-gray-200/20"
              aria-label="Toggle theme"
            >
              {darkTheme ? <FiSun className={effectiveLight ? 'text-black' : 'text-white'} /> : <FiMoon className={effectiveLight ? 'text-black' : 'text-white'} />}
            </button>

            <button
              onClick={onShowLoginForm}
              className="p-2 rounded-lg hover:bg-gray-200/10"
              title={isAuthenticated ? 'Account' : 'Login / Create Account'}
            >
              <FiUser className={effectiveLight ? 'text-black' : 'text-white'} />
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="flex justify-around mt-4">
          <MobileMenuItem icon={<FiHome />} text="Home" active={activeMenu === 'Dashboard'} onClick={() => onMenuClick('Dashboard')} darkTheme={!effectiveLight} />
          <MobileMenuItem icon={<FiMap />} text="Map" active={activeMenu === 'Map'} onClick={() => onMenuClick('Map')} darkTheme={!effectiveLight} />
          <MobileMenuItem icon={<FiCalendar />} text="Calendar" active={activeMenu === 'Calendar'} onClick={() => onMenuClick('Calendar')} darkTheme={!effectiveLight} />
          <MobileMenuItem icon={<FiBookmark />} text="Saved" active={activeMenu === 'Saved Location'} onClick={() => onMenuClick('Saved Location')} darkTheme={!effectiveLight} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-20 lg:pb-0 relative z-10">
        <div className="max-w-7xl mx-auto p-4 lg:p-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 lg:mb-8 gap-4">
            <div>
              <h1 className={`text-2xl lg:text-3xl font-bold ${textColorClass}`}>
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h1>
              <p className={`text-sm mt-1 ${subTextColorClass}`}>
                {currentDate} • {localCityTime || currentTime}
              </p>
            </div>

            {isAuthenticated && user && (
              <div className={`${glassCardBase} px-4 py-2 rounded-lg border ${borderColorClass}`}>
                <p className={`text-sm font-medium ${effectiveLight ? 'text-black' : 'text-white'}`}>Welcome, {user.username}!</p>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="relative flex-1 lg:flex-none">
                <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${effectiveLight ? 'text-gray-600' : 'text-gray-300'}`} />
                <input
                  type="text"
                  placeholder="Search city..."
                  value={searchQuery}
                  onChange={onSearchChange}
                  onFocus={() => searchQuery && onSetShowSuggestions(true)}
                  onBlur={() => setTimeout(() => onSetShowSuggestions(false), 200)}
                  className={`pl-10 pr-4 py-2 border rounded-lg w-full lg:w-72 focus:outline-none focus:ring-2 focus:ring-opacity-20 ${effectiveLight ? 'bg-white/90 text-black border-gray-200' : 'bg-black/30 text-white border-white/20'}`}
                />

                {showSuggestions && filteredCities.length > 0 && (
                  <div className={`absolute top-full mt-2 w-full rounded-lg shadow-lg max-h-96 overflow-y-auto z-50 ${effectiveLight ? 'bg-white' : 'bg-gray-900/90'} border ${borderColorClass}`}>
                    {filteredCities.map((city, index) => (
                      <button
                        key={index}
                        onClick={() => onCitySelect(city)}
                        className={`w-full px-4 py-3 text-left transition-colors flex items-center justify-between border-b ${effectiveLight ? 'border-gray-100' : 'border-white/10'} hover:${effectiveLight ? 'bg-gray-100' : 'bg-white/5'}`}
                      >
                        <div>
                          <div className={`font-medium ${effectiveLight ? 'text-black' : 'text-white'}`}>{city.name}</div>
                          <div className={`text-xs ${effectiveLight ? 'text-gray-600' : 'text-gray-300'}`}>{city.country}</div>
                        </div>
                        <FiSearch className={effectiveLight ? 'text-gray-500' : 'text-gray-400'} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onSaveCurrentLocation}
                  className={`p-2 rounded-lg transition-colors ${effectiveLight ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`}
                  title="Save current location"
                >
                  <FiBookmark className={effectiveLight ? 'text-black' : 'text-white'} />
                </button>

                <button
                  onClick={onShowLoginForm}
                  className={`p-2 rounded-lg transition-colors ${effectiveLight ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`}
                  title={isAuthenticated ? 'Account' : 'Login / Create Account'}
                >
                  <FiUser className={effectiveLight ? 'text-black' : 'text-white'} />
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <WiDayCloudy className={`text-6xl mx-auto mb-4 ${effectiveLight ? 'text-gray-700' : 'text-gray-300'} animate-spin`} />
              <p className={effectiveLight ? 'text-gray-700' : 'text-gray-300'}>Fetching weather data...</p>
            </div>
          ) : (
            <>
              {/* Today Overview */}
              <div className={`rounded-2xl p-4 lg:p-6 mb-6 ${glassCardBase} border ${borderColorClass}`}>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
                  <h2 className={`text-xl font-semibold ${effectiveLight ? 'text-black' : 'text-white'}`}>Today overview</h2>
                  <div className={`${effectiveLight ? 'text-gray-700' : 'text-gray-300'} text-sm`}>
                    Last updated: {new Date(weatherData.lastUpdated).toLocaleTimeString()}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  <WeatherCard
                    icon={<WiStrongWind className={`${effectiveLight ? 'text-gray-700' : 'text-gray-300'} text-4xl`} />}
                    title="Wind Speed"
                    value={`${Math.round(weatherData.windSpeedKmh)} km/h`}
                    change={`${weatherData.windDirection} direction`}
                    trend={weatherData.windSpeedKmh > 20 ? 'up' : 'down'}
                    darkTheme={!effectiveLight}
                  />
                  <WeatherCard
                    icon={<WiRain className={`${effectiveLight ? 'text-gray-700' : 'text-gray-300'} text-4xl`} />}
                    title="Rain Chance"
                    value={`${weatherData.rainChance}%`}
                    change={`Humidity: ${weatherData.humidity}%`}
                    trend={weatherData.rainChance > 50 ? 'up' : 'down'}
                    darkTheme={!effectiveLight}
                  />
                  <WeatherCard
                    icon={<WiBarometer className={`${effectiveLight ? 'text-gray-700' : 'text-gray-300'} text-4xl`} />}
                    title="Pressure"
                    value={`${weatherData.pressure} hPa`}
                    change={`Sea level: ${weatherData.pressureSeaLevel} hPa`}
                    trend="up"
                    darkTheme={!effectiveLight}
                  />
                  <WeatherCard
                    icon={<WiDaySunny className={`${effectiveLight ? 'text-gray-700' : 'text-gray-300'} text-4xl`} />}
                    title="UV Index"
                    value={weatherData.uvIndex.toFixed(1)}
                    change={`Visibility: ${weatherData.visibility.toFixed(1)} km`}
                    trend={weatherData.uvIndex > 5 ? 'up' : 'down'}
                    darkTheme={!effectiveLight}
                  />
                </div>
              </div>

              {/* Additional Weather Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className={`rounded-2xl p-4 lg:p-6 ${glassCardBase} border ${borderColorClass}`}>
                  <h3 className={`text-lg font-semibold mb-4 ${effectiveLight ? 'text-black' : 'text-white'}`}>Hourly Forecast</h3>
                  <div className="space-y-3">
                    {weatherData.hourlyForecast.slice(0, 6).map((hour, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <span className={`text-sm font-medium w-16 lg:w-20 ${effectiveLight ? 'text-black' : 'text-gray-300'}`}>
                          {hour.time}
                        </span>
                        <div className="flex-1 flex items-center gap-3">
                          <div className="flex-1 rounded-full h-2" style={{ background: effectiveLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.12)' }}>
                            <div
                              style={{ width: `${hour.chance}%`, background: effectiveLight ? '#111827' : '#ffffffcc' }}
                              className="h-full rounded-full"
                            />
                          </div>
                          <span className={`text-sm w-8 lg:w-12 ${effectiveLight ? 'text-black' : 'text-gray-300'}`}>
                            {hour.chance}%
                          </span>
                        </div>
                        <span className={`text-sm font-medium w-12 ${effectiveLight ? 'text-black' : 'text-white'}`}>
                          {hour.temp}°C
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`rounded-2xl p-4 lg:p-6 ${glassCardBase} border ${borderColorClass}`}>
                  <h3 className={`text-lg font-semibold mb-4 ${effectiveLight ? 'text-black' : 'text-white'}`}>Weather Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <DetailItem label="Feels Like" value={`${weatherData.feelsLike}°C`} darkTheme={!effectiveLight} />
                    <DetailItem label="Cloudiness" value={`${weatherData.cloudiness}%`} darkTheme={!effectiveLight} />
                    <DetailItem label="Humidity" value={`${weatherData.humidity}%`} darkTheme={!effectiveLight} />
                    <DetailItem label="Visibility" value={`${weatherData.visibility.toFixed(1)} km`} darkTheme={!effectiveLight} />
                    <DetailItem label="Air Quality" value={weatherData.airQualityIndex === 'N/A' ? 'N/A' : `AQI ${weatherData.airQualityIndex}`} darkTheme={!effectiveLight} />
                    <DetailItem label="Wind Dir" value={`${weatherData.windDirection}°`} darkTheme={!effectiveLight} />
                  </div>
                </div>
              </div>

              {/* Weekly Temperature */}
              <div className={`rounded-2xl p-4 lg:p-6 ${glassCardBase} border ${borderColorClass}`}>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
                  <h2 className={`text-xl font-semibold ${effectiveLight ? 'text-black' : 'text-white'}`}>7-Day Forecast</h2>
                  <button className={`text-sm font-medium ${effectiveLight ? 'text-gray-700' : 'text-gray-300'}`}>
                    {selectedCity?.name}, {selectedCity?.country} ▼
                  </button>
                </div>
                <TemperatureChart data={weatherData.weeklyForecast} darkTheme={!effectiveLight} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Sidebar - Current Weather - Desktop */}
      <div className="w-full lg:w-80 p-6 hidden lg:block relative z-10">
        <div className={`${glassCardBase} rounded-2xl p-6 border ${borderColorClass}`}>
          <div className="mb-6">
            <h3 className={`text-lg font-medium ${effectiveLight ? 'text-black' : 'text-white'}`}>{weatherData.location}</h3>
            <p className={`${effectiveLight ? 'text-gray-700' : 'text-gray-300'}`}>{weatherData.country}</p>
            <p className={`${effectiveLight ? 'text-xs text-gray-600 mt-2' : 'text-xs text-gray-400 mt-2'}`}>🕐 Local Time: {localCityTime || weatherData.localTime}</p>
            <p className={`${effectiveLight ? 'text-xs text-gray-600' : 'text-xs text-gray-400'}`}>⏰ Your Time: {currentTime}</p>
          </div>

          <div className="text-center mb-6">
            <WiDayCloudy className={`${effectiveLight ? 'text-6xl text-gray-700 mx-auto mb-2' : 'text-8xl mx-auto mb-2 text-white'}`} />
            <div className={`font-light ${effectiveLight ? 'text-4xl' : 'text-6xl'}`}>{weatherData.temperature}°C</div>
            <div className={`${effectiveLight ? 'text-sm text-gray-700 mt-2' : 'text-sm text-gray-300 mt-2'}`}>{weatherData.condition}</div>
            <div className={`${effectiveLight ? 'text-xs text-gray-600' : 'text-xs text-gray-400'}`}>Feels like {weatherData.feelsLike}°C</div>
          </div>

          <div className="mb-6">
            <h4 className={`text-sm font-medium mb-3 ${effectiveLight ? 'text-black' : 'text-white'}`}>Hourly Rain Probability</h4>
            {weatherData.hourlyForecast.slice(0, 4).map((item, index) => (
              <div key={index} className="flex items-center gap-3 mb-2">
                <span className={`${effectiveLight ? 'text-sm w-16 text-gray-700' : 'text-sm w-16 text-gray-300'}`}>{item.time}</span>
                <div className={`${effectiveLight ? 'flex-1 bg-gray-200 rounded-full h-2 overflow-hidden' : 'flex-1 bg-white/12 rounded-full h-2 overflow-hidden'}`}>
                  <div
                    style={{ width: `${item.chance}%`, background: effectiveLight ? '#111827' : '#ffffffcc' }}
                    className="h-full rounded-full"
                  />
                </div>
                <span className={`${effectiveLight ? 'text-sm w-12 text-right text-gray-700' : 'text-sm w-12 text-right text-gray-300'}`}>{item.chance}%</span>
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className={`${effectiveLight ? 'text-sm font-medium text-black' : 'text-sm font-medium text-white'}`}>Sunrise & Sunset</h4>
              <button className={`${effectiveLight ? 'text-xs text-gray-700' : 'text-xs text-gray-400'}`}>{weatherData.location} ▼</button>
            </div>

            <div className={`${effectiveLight ? 'bg-gray-100 rounded-xl p-4 mb-3' : 'bg-white/10 rounded-xl p-4 mb-3'}`}>
              <div className="flex items-center gap-3">
                <WiSunrise className={`${effectiveLight ? 'text-3xl text-yellow-500' : 'text-3xl text-yellow-300'}`} />
                <div className="flex-1">
                  <div className={`${effectiveLight ? 'text-xs text-gray-600' : 'text-xs text-gray-400'}`}>Sunrise</div>
                  <div className={`${effectiveLight ? 'text-lg font-medium text-black' : 'text-lg font-medium text-white'}`}>{weatherData.sunrise}</div>
                </div>
              </div>
            </div>

            <div className={`${effectiveLight ? 'bg-gray-100 rounded-xl p-4' : 'bg-white/10 rounded-xl p-4'}`}>
              <div className="flex items-center gap-3">
                <WiSunset className={`${effectiveLight ? 'text-3xl text-orange-500' : 'text-3xl text-orange-300'}`} />
                <div className="flex-1">
                  <div className={`${effectiveLight ? 'text-xs text-gray-600' : 'text-xs text-gray-400'}`}>Sunset</div>
                  <div className={`${effectiveLight ? 'text-lg font-medium text-black' : 'text-lg font-medium text-white'}`}>{weatherData.sunset}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Weather Card */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 z-40">
        <div
          className="mx-auto rounded-2xl p-4 w-full max-w-md flex items-center gap-4"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,${effectiveLight ? 0.02 : 0.35}), rgba(0,0,0,${effectiveLight ? 0.02 : 0.35})), url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="flex-1" >
            <div className={`${effectiveLight ? 'text-3xl font-light text-black' : 'text-3xl font-light text-white'}`}>{weatherData.temperature}°C</div>
            <div className={`${effectiveLight ? 'text-sm text-gray-700' : 'text-sm text-gray-200'}`}>{weatherData.condition}</div>
            <div className={`${effectiveLight ? 'text-xs text-gray-600 mt-1' : 'text-xs text-gray-300 mt-1'}`}>{weatherData.location} • Feels like {weatherData.feelsLike}°C</div>
          </div>

          <div className="text-right">
            <WiDayCloudy className={`${effectiveLight ? 'text-4xl text-gray-700' : 'text-4xl text-white'}`} />
            <div className={`${effectiveLight ? 'text-xs text-gray-700 mt-1' : 'text-xs text-gray-200 mt-1'}`}>{localCityTime || currentTime}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
