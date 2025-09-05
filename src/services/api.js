import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// Events API
export const eventsAPI = {
  getAll: () => api.get('/events'),
  create: (eventData) => api.post('/events/create', eventData),
  join: (eventId) => api.post('/events/join', { eventId }),
  getJoined: () => api.get('/events/joined'),
};

// Polls API
export const pollsAPI = {
  create: (pollData) => api.post('/polls/create', pollData),
  vote: (pollId, optionIndex) => api.post('/polls/vote', { pollId, optionIndex }),
  getByEvent: (eventId) => api.get(`/polls/event/${eventId}`),
};

export default api;
