import React from 'react';

const MobileMenuItem = ({ icon, text, active, onClick, darkTheme }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors flex-1 ${
      active 
        ? (darkTheme ? 'bg-blue-900 text-blue-300' : 'bg-blue-50 text-blue-600')
        : (darkTheme ? 'text-gray-400' : 'text-gray-600')
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span className="text-xs font-medium">{text}</span>
  </button>
);

export default MobileMenuItem;