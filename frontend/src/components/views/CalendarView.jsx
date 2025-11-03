import React, { useState } from 'react';
import { FiArrowLeft, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { WiDayCloudy } from 'react-icons/wi';
import { motion } from 'framer-motion';

const CalendarView = ({ darkTheme, weatherData, onBack }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Calendar navigation
  const navigateMonth = (direction) => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") newDate.setMonth(newDate.getMonth() - 1);
      else newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    const days = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const days = generateCalendarDays();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1591174425156-fd472f354be4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fENhbGVuZGFyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600')`,
      }}
    >
      {/* Overlay for dark mode effect */}
      <div className={`absolute inset-0 ${darkTheme ? 'bg-black/60' : 'bg-white/40'} backdrop-blur-sm`}></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`relative z-10 w-full max-w-5xl mt-10 mx-4 rounded-3xl shadow-2xl 
          ${darkTheme ? 'bg-white/10' : 'bg-white/30'}
          backdrop-blur-xl border border-white/20`}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className={`flex items-center gap-2 ${darkTheme ? 'text-gray-300 hover:text-white' : 'text-gray-800 hover:text-blue-600'} transition-colors`}
            >
              <FiArrowLeft className="text-xl" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </button>
            <div className="h-6 w-px bg-white/30"></div>
            <h1 className="text-2xl font-bold drop-shadow-md">Calendar</h1>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center gap-3">
            <button onClick={() => navigateMonth('prev')} className="p-2 rounded-lg hover:bg-white/20 transition-colors">
              <FiChevronLeft className="text-xl" />
            </button>

            <h2 className="text-xl font-semibold drop-shadow-sm">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>

            <button onClick={() => navigateMonth('next')} className="p-2 rounded-lg hover:bg-white/20 transition-colors">
              <FiChevronRight className="text-xl" />
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div className="p-6">
          {/* Weekdays */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold text-sm text-white/80">
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <motion.div layout className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              const isToday = day.toDateString() === today.toDateString();
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth();

              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03 }}
                  className={`
                    min-h-20 p-3 rounded-xl border text-center transition-all duration-300
                    ${isToday
                      ? 'bg-blue-500/90 border-blue-400 text-white shadow-lg'
                      : 'bg-white/10 border-white/20 text-white/80'
                    }
                    ${!isCurrentMonth ? 'opacity-50' : ''}
                    backdrop-blur-md
                  `}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-sm font-medium ${isToday ? 'text-white' : ''}`}>
                      {day.getDate()}
                    </span>
                    {isToday && weatherData && <WiDayCloudy className="text-white/80 text-lg" />}
                  </div>
                  {isToday && weatherData && (
                    <div className="mt-1 text-xs">
                      <div>🌡 {weatherData.temperature}°C</div>
                      <div className="hidden sm:block">💨 {Math.round(weatherData.windSpeedKmh)}km/h</div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>

          {/* Legend */}
          <div className="mt-6 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <h3 className="font-semibold mb-3 text-white/90">Legend</h3>
            <div className="grid grid-cols-2 gap-3 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Today</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-white/60 rounded"></div>
                <span>Current Month</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CalendarView;
