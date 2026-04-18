import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000,
});

/**
 * Sends a query and chat history to the backend.
 * @param {string} query - Current question.
 * @param {Array} history - Array of {user, assistant} objects.
 */
export const askQuestion = async (query, history = []) => {
  try {
    const response = await apiClient.post('/ask', { query, history });
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};
