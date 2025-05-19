// src/api/apiKey.js

/**
 * Generates a new API key on the server.
 * @returns {Promise<string>} Resolves to the plaintext API key.
 */
export const generateApiKey = async () => {
  const API_ENDPOINT = 'http://127.0.0.1:8210/key';

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'GET',
      credentials: 'include',            // ← include cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      let errorMsg = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || errorData.error || errorMsg;
      } catch {}
      throw new Error(errorMsg);
    }

    const data = await response.json();
    if (data && typeof data.token === 'string') {
      return data.token;
    }
    throw new Error('Server did not return a valid API key.');
  } catch (error) {
    console.error('generateApiKey error:', error);
    throw new Error(error.message || 'Failed to generate API key.');
  }
};

/**
 * Fetches an existing API key from the server, if one exists.
 * @returns {Promise<string|null>} Resolves to the plaintext API key, or null if none.
 */
export const fetchApiKey = async () => {
  const API_ENDPOINT = 'http://127.0.0.1:8210/key';

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'GET',
      credentials: 'include',            // ← include cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401 || response.status === 403) {
      // not logged in / no token
      return null;
    }
    if (!response.ok) {
      let errorMsg = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || errorData.error || errorMsg;
      } catch {}
      throw new Error(errorMsg);
    }

    const data = await response.json();
    if (data && typeof data.token === 'string') {
      return data.token;
    }
    return null;
  } catch (error) {
    console.error('fetchApiKey error:', error);
    throw new Error(error.message || 'Failed to fetch existing API key.');
  }
};
