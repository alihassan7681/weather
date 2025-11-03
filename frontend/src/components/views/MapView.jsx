import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { WiDayCloudy } from 'react-icons/wi';

const MapView = ({ selectedCity, weatherData, darkTheme, onBack }) => {
  if (!selectedCity) return null;

  // Map URL with selected city coordinates
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${selectedCity.lon-0.1}%2C${selectedCity.lat-0.1}%2C${selectedCity.lon+0.1}%2C${selectedCity.lat+0.1}&layer=mapnik&marker=${selectedCity.lat}%2C${selectedCity.lon}`;

  return (
    <div className={`min-h-screen ${darkTheme ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
      {/* Map Header */}
      <div className={`${darkTheme ? 'bg-gray-800' : 'bg-white'} shadow-sm p-4 sm:p-6`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className={`flex items-center gap-2 ${darkTheme ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
            >
              <FiArrowLeft className="text-xl" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </button>
            <div className={`h-6 w-px ${darkTheme ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
            <h1 className="text-xl sm:text-2xl font-bold">Weather Map</h1>
          </div>
          <div className={`text-xs sm:text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
            {selectedCity.name}, {selectedCity.country}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="p-4 sm:p-6">
        <div className={`rounded-2xl shadow-sm ${darkTheme ? 'bg-gray-800' : 'bg-white'} h-[calc(100vh-200px)] overflow-hidden`}>
          {/* Real Map */}
          <iframe
            src={mapUrl}
            className="w-full h-full border-0"
            title={`Map of ${selectedCity.name}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>

          {/* Weather Overlay */}
          {weatherData && (
            <div className={`absolute top-6 right-6 p-4 rounded-lg shadow-lg ${darkTheme ? 'bg-gray-800 bg-opacity-90 text-white' : 'bg-white bg-opacity-90 text-gray-800'} backdrop-blur-sm`}>
              <div className="flex items-center gap-3">
                <WiDayCloudy className="text-3xl text-blue-600" />
                <div>
                  <div className="font-semibold text-base">{weatherData.condition}</div>
                  <div className="text-sm">{weatherData.temperature}°C</div>
                  <div className="text-xs text-gray-500 mt-1">
                    💨 {Math.round(weatherData.windSpeedKmh)} km/h • 💧 {weatherData.humidity}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Coordinates Display */}
          <div className={`absolute bottom-6 left-6 p-3 rounded-lg shadow-lg ${darkTheme ? 'bg-gray-800 bg-opacity-90 text-white' : 'bg-white bg-opacity-90 text-gray-800'} backdrop-blur-sm`}>
            <div className="text-sm font-medium">Coordinates</div>
            <div className="text-xs text-gray-500 mt-1">
              <div>Lat: {selectedCity.lat.toFixed(4)}</div>
              <div>Lon: {selectedCity.lon.toFixed(4)}</div>
            </div>
          </div>
        </div>

        {/* Map Attribution */}
        <div className="text-center mt-4">
          <p className={`text-xs ${darkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
            Map data © <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer" className="underline">OpenStreetMap</a> contributors
          </p>
        </div>
      </div>
    </div>
  );
};

export default MapView;