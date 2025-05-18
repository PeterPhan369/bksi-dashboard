// src/api/apiKey.js

/**
 * Fetches a new API key from the server.
 * @returns {Promise<string>} A promise that resolves with the generated API key string.
 * @throws {Error} Throws an error if the fetch fails or the response is invalid.
 */
export const generateApiKey = async () => {
  const API_ENDPOINT = '/api/v1/generate-key';

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include token here if needed in the future:
        // 'Authorization': `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      let errorMsg = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || errorData.error || errorMsg;
      } catch (_) {}
      throw new Error(errorMsg);
    }

    const data = await response.json();
    if (data && data.apiKey) {
      return data.apiKey;
    } else {
      throw new Error('API response did not contain a valid API key.');
    }
  } catch (error) {
    console.error('Error in generateApiKey service:', error);
    throw new Error(error.message || 'Failed to generate API Key from server.');
  }
};
