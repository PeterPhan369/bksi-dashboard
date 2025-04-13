// src/api/apiKey.js

/**
 * Fetches a new API key from the server.
 * @returns {Promise<string>} A promise that resolves with the generated API key string.
 * @throws {Error} Throws an error if the fetch fails or the response is invalid.
 */
export const generateApiKey = async () => {
    // --- Replace with your actual API endpoint ---
    const API_ENDPOINT = '/api/v1/generate-key';
    // --- Replace with your actual token retrieval logic if needed ---
    const authToken = 'YOUR_AUTH_TOKEN'; // Example: localStorage.getItem('authToken');
  
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST', // Or 'GET', depending on your API design
        headers: {
          'Content-Type': 'application/json',
          // Add Authorization header if your API requires it
          ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
        },
        // Add body if using POST and your API requires it
        // body: JSON.stringify({ userId: 'someUserId' })
      });
  
      if (!response.ok) {
        // Try to get more specific error message from response body
        let errorMsg = `API Error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorData.error || errorMsg;
        } catch (parseError) {
          // Ignore if response body isn't valid JSON, use the status text
        }
        throw new Error(errorMsg);
      }
  
      const data = await response.json();
  
      // --- Adjust 'data.apiKey' based on your API response structure ---
      if (data && data.apiKey) {
        return data.apiKey; // Return the key string on success
      } else {
        // Handle cases where response is OK but key is missing
        throw new Error('API response did not contain a valid API key.');
      }
    } catch (error) {
      // Log the error internally and re-throw a generic or specific error
      console.error('Error in generateApiKey service:', error);
      // Re-throw the error so the component can catch it
      throw new Error(error.message || 'Failed to generate API Key from server.');
    }
  };
  
  // You can add other related API functions here later if needed
  // e.g., revokeApiKey(keyId), listApiKeys(), etc.