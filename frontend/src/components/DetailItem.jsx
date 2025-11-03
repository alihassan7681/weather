import React from 'react';

const DetailItem = ({ label, value, darkTheme }) => (
  <div className={`rounded-lg p-3 ${darkTheme ? 'bg-gray-700' : 'bg-gray-50'}`}>
    <div className={`text-xs mb-1 ${darkTheme ? 'text-gray-400' : 'text-gray-500'}`}>{label}</div>
    <div className={`text-sm font-semibold ${darkTheme ? 'text-white' : 'text-gray-800'}`}>{value}</div>
  </div>
);

export default DetailItem;