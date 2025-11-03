import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (username, email, password) =>
    api.post('/auth/register', { username, email, password }),
  
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  
  getProfile: () => api.get('/auth/profile'),
};

export const weatherAPI = {
  getCurrent: (city) => api.get(`/weather/current?city=${city}`),
  getForecast: (city) => api.get(`/weather/forecast?city=${city}`),
};

export const locationsAPI = {
  getSaved: () => api.get('/locations'),
  save: (location) => api.post('/locations', location),
  delete: (id) => api.delete(`/locations/${id}`),
};

export default api;