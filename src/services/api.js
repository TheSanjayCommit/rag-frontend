/**
 * API Configuration — Single Source of Truth
 */

// Use the Vercel environment variable, or fallback to local development
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Clean up the URL: Remove trailing slashes and ensure it ends with /api/v1
export const API_BASE_URL = `${BASE_URL.replace(/\/$/, '')}/api/v1`;

/**
 * Sends a non-streaming query to the backend.
 */
export const askQuestion = async (query, history = []) => {
  const response = await fetch(`${API_BASE_URL}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, history }),
  });

  if (!response.ok) {
    throw new Error(`Server error: HTTP ${response.status}`);
  }
  return response;
};
