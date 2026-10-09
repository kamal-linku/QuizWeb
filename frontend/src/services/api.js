import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const quizApi = {
  // Get preset question templates
  getTemplates: async (name) => {
    const response = await api.get(`/quizzes/templates`, { params: { name } });
    return response.data;
  },

  // Create a new quiz
  createQuiz: async (quizData) => {
    const response = await api.post(`/quizzes`, quizData);
    return response.data;
  },

  // Get quiz for taker (friend) - NO correct answers returned
  getPublicQuiz: async (shareCode) => {
    const response = await api.get(`/quizzes/${shareCode}`);
    return response.data;
  },

  // Submit friend's answers for verification and score calculation
  submitQuiz: async (shareCode, submission) => {
    const response = await api.post(`/quizzes/${shareCode}/submit`, submission);
    return response.data;
  },

  // Get public leaderboard
  getLeaderboard: async (shareCode) => {
    const response = await api.get(`/quizzes/${shareCode}/results`);
    return response.data;
  },

  // Get creator dashboard with analytics
  getDashboard: async (shareCode, token) => {
    const response = await api.get(`/quizzes/${shareCode}/dashboard`, {
      params: { token },
    });
    return response.data;
  },
};

export default api;

