import React from 'react';
import { FiArrowLeft, FiMapPin, FiTrash2, FiBookmark } from 'react-icons/fi';
import { motion } from 'framer-motion';

const SavedLocationsView = ({
  savedLocations,
  darkTheme,
  onSaveLocation,
  onRemoveLocation,
  onLoadLocation,
  onBack,
}) => {
  return (
    <div
      className={`min-h-screen relative overflow-hidden ${
        darkTheme ? 'text-white' : 'text-gray-800'
      }`}
    >
      {/*  Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1488812690953-601000f207e4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGRhcmslMjB3ZWF0aGVyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600')",
        }}
      ></div>

      {/*  Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-indigo-900/60 to-gray-900/70"></div>

      {/*  Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`relative z-10 p-6 flex items-center justify-between backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-lg`}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
          >
            <FiArrowLeft className="text-lg" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wide">
            Saved Locations
          </h1>
        </div>

        <button
          onClick={onSaveLocation}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-blue-500/50 transition-all"
        >
          <FiMapPin />
          <span className="hidden sm:inline">Save Current Location</span>
          <span className="sm:hidden">Save</span>
        </button>
      </motion.div>

      {/*  Content */}
      <div className="relative z-10 p-6">
        {savedLocations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="backdrop-blur-xl bg-white/10 rounded-2xl p-10 text-center border border-white/20 shadow-lg"
          >
            <FiBookmark className="text-6xl mx-auto mb-4 text-white/70" />
            <h2 className="text-2xl font-semibold mb-2 text-white">
              No Saved Locations
            </h2>
            <p className="text-sm mb-6 text-white/80">
              Save your favorite locations to quickly access their weather
              information.
            </p>
            <button
              onClick={onSaveLocation}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md"
            >
              <FiMapPin />
              Save Current Location
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedLocations.map((location, index) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6 transition-all hover:shadow-blue-500/30"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                      <FiMapPin className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {location.name}
                      </h3>
                      <p className="text-sm text-white/70">{location.country}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveLocation(location.id)}
                    className="p-2 text-red-400 hover:text-red-500 hover:bg-red-900/20 rounded-lg transition-all"
                  >
                    <FiTrash2 />
                  </button>
                </div>

                <div className="bg-white/10 p-4 rounded-xl border border-white/20 mb-4 text-white/90 text-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-white/60">Latitude:</span>
                      <p>{location.lat.toFixed(4)}</p>
                    </div>
                    <div>
                      <span className="text-white/60">Longitude:</span>
                      <p>{location.lon.toFixed(4)}</p>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-white/60 mb-4">
                  Saved on: {location.savedAt}
                </div>

                <button
                  onClick={() => onLoadLocation(location)}
                  className="w-full py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md transition-all"
                >
                  View Weather
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/*  Tips */}
        {savedLocations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 text-white/90 shadow-lg"
          >
            <h3 className="font-semibold mb-3 text-lg text-white">
              Quick Tips
            </h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span> Click "View Weather"
                to see detailed weather information for any saved location.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span> Use the trash icon to
                remove locations you no longer need.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span> Save multiple
                locations to quickly compare weather conditions.
              </li>
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SavedLocationsView;
