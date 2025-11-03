import React from 'react';

const TemperatureChart = ({ data, darkTheme }) => {
  const maxTemp = Math.max(...data.map(d => d.temp));
  const minTemp = Math.min(...data.map(d => d.temp));
  const range = maxTemp - minTemp || 1;

  return (
    <div className="relative h-48 lg:h-64">
      <div className={`absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs ${
        darkTheme ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <div>{maxTemp + 5}°</div>
        <div>{Math.round((maxTemp + minTemp) / 2)}°</div>
        <div>{minTemp - 5}°</div>
      </div>

      <div className="ml-8 lg:ml-12 h-full">
        <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
          {/* Grid Lines */}
          <line x1="0" y1="0" x2="500" y2="0" stroke={darkTheme ? '#374151' : '#e5e7eb'} strokeWidth="1" strokeDasharray="4" />
          <line x1="0" y1="100" x2="500" y2="100" stroke={darkTheme ? '#374151' : '#e5e7eb'} strokeWidth="1" strokeDasharray="4" />
          <line x1="0" y1="200" x2="500" y2="200" stroke={darkTheme ? '#374151' : '#e5e7eb'} strokeWidth="1" strokeDasharray="4" />
          
          {/* Temperature Line */}
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            points={data.map((day, index) => {
              const x = (index / (data.length - 1)) * 500;
              const y = 200 - ((day.temp - (minTemp - 5)) / (range + 10)) * 200;
              return `${x},${y}`;
            }).join(' ')}
          />
          
          {/* Data Points */}
          {data.map((day, index) => {
            const x = (index / (data.length - 1)) * 500;
            const y = 200 - ((day.temp - (minTemp - 5)) / (range + 10)) * 200;
            return (
              <g key={index}>
                <circle cx={x} cy={y} r="6" fill="#3b82f6" />
                <circle cx={x} cy={y} r="8" fill="#3b82f6" fillOpacity="0.2" />
              </g>
            );
          })}
        </svg>

        {/* Day Labels */}
        <div className="flex justify-between mt-2">
          {data.map((day, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`text-xs font-medium ${darkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                {day.week}
              </div>
              <div className={`text-sm font-semibold ${darkTheme ? 'text-white' : 'text-gray-900'}`}>
                {day.temp}°
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemperatureChart;