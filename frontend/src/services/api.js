import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for attaching Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('statlearn_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        localStorage.removeItem('statlearn_token');
        localStorage.removeItem('statlearn_user');
      }
    }
    return Promise.reject(error);
  }
);

// API Service Endpoints
export const authApi = {
  login: (credentials) => api.post('/auth/login/json', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
};

export const competencyApi = {
  getAll: (domain) => api.get('/competencies', { params: { domain } }),
  getProfile: () => api.get('/competencies/profile'),
  getGapAnalysis: () => api.get('/competencies/gap-analysis'),
};

export const assessmentApi = {
  getBaseline: () => api.get('/assessments/baseline'),
  submitBaseline: (answers) => api.post('/assessments/baseline/submit', { answers }),
};

export const recommendationApi = {
  getForYou: () => api.get('/recommendations/for-you'),
};

export const resourceApi = {
  getAll: (filters) => api.get('/resources', { params: filters }),
};

export const documentApi = {
  upload: (formData) => api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getAll: () => api.get('/documents'),
};

export const quizApi = {
  generate: (params) => api.post('/quizzes/generate', params),
  getAll: () => api.get('/quizzes'),
  getById: (id) => api.get(`/quizzes/${id}`),
  submit: (id, answers) => api.post(`/quizzes/${id}/submit`, { answers }),
};

export const progressApi = {
  getSummary: () => api.get('/progress/summary'),
};

export const finalInterviewApi = {
  getReadiness: () => api.get('/final-interview/readiness'),

  generateQuestions: () => api.post('/final-interview/questions'),

  evaluateAnswer: (data) =>
    api.post('/final-interview/evaluate-answer', data),
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
};

export default api;
