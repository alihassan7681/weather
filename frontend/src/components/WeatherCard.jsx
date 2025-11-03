import React from 'react';
import { TbArrowUp, TbArrowDown } from 'react-icons/tb';

const WeatherCard = ({ icon, title, value, change, trend, darkTheme }) => (
  <div className="flex items-start gap-3">
    {icon}
    <div className="flex-1">
      <div className={`text-xs mb-1 ${darkTheme ? 'text-gray-400' : 'text-gray-500'}`}>{title}</div>
      <div className={`text-xl lg:text-2xl font-semibold mb-1 ${darkTheme ? 'text-white' : 'text-gray-800'}`}>{value}</div>
      <div className="flex items-center gap-1 text-xs">
        {trend === 'up' ? (
          <TbArrowUp className="text-green-500" />
        ) : (
          <TbArrowDown className="text-red-500" />
        )}
        <span className={darkTheme ? 'text-gray-400' : 'text-gray-500'}>{change}</span>
      </div>
    </div>
  </div>
);

export default WeatherCard;