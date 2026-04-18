/**
 * API Configuration — Single Source of Truth
 *
 * In development: reads from frontend/.env.local  → VITE_API_URL=http://localhost:8000/api/v1
 * In production:  reads from Vercel env dashboard → VITE_API_URL=https://rag-backend-a4os.onrender.com/api/v1
 *
 * To change the backend URL, update ONLY the env variable — never change this file.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

/**
 * Sends a non-streaming query to the backend.
 * NOTE: Streaming calls use the native fetch API in ChatPage.jsx
 *       because axios does not support ReadableStream responses.
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
