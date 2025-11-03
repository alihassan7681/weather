import React from 'react';

const MenuItem = ({ icon, text, active, onClick, darkTheme }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-3 rounded-lg mb-1 w-full transition-colors ${
      active 
        ? (darkTheme ? 'bg-blue-900 text-blue-300' : 'bg-blue-50 text-blue-600')
        : (darkTheme ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50')
    }`}
  >
    <span className="text-xl">{icon}</span>
    <span className="text-sm font-medium">{text}</span>
  </button>
);

export default MenuItem;