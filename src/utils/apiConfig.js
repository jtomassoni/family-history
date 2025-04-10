/**
 * API configuration utility
 * 
 * This handles setting up the correct API URL when accessing the app from different devices
 * on the same network.
 */

// Get the base API URL from environment variables
const configuredApiUrl = import.meta.env.VITE_API_URL;

// Function to get the API URL
export function getApiUrl() {
  // If we're accessing from the same machine (localhost), use the configured API URL
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return configuredApiUrl;
  }
  
  // If we're accessing from another device on the network (like a phone),
  // extract the host part from the configured URL and use that
  try {
    const apiUrlObj = new URL(configuredApiUrl);
    // Replace the host part with the current hostname and keep the port
    return `${apiUrlObj.protocol}//${apiUrlObj.host}`;
  } catch (error) {
    console.error('Error parsing API URL:', error);
    return configuredApiUrl; // Fallback to configured URL
  }
}

// Function to get the Google OAuth callback URL
export function getGoogleCallbackUrl() {
  const baseUrl = window.location.origin;
  return `${baseUrl}/auth/callback`;
}

// Default export for convenience
export default {
  getApiUrl,
  getGoogleCallbackUrl
}; 