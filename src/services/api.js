/**
 * API Configuration — Single Source of Truth
 */

// 1. Get the base URL from environment variables
const RAW_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// 2. ULTRA-CLEANUP: 
// - Strip everything after the domain if it looks like an API path
// - This ensures that even if Vercel has a bad URL, we find the root.
const CLEAN_BASE = RAW_URL.replace(/\/api\/v1\/?$/i, '').replace(/\/+$/, '');

// 3. FINAL ROUTE: Always ensure it ends with exactly one /api/v1
export const API_BASE_URL = `${CLEAN_BASE}/api/v1`;

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
