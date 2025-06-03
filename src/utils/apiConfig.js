/**
 * API configuration utility
 * 
 * This handles setting up the correct API URL when accessing the app from different devices
 * on the same network.
 */

// Get the base API URL from environment variables with fallback
const configuredApiUrl = import.meta.env.VITE_API_URL;

// Function to get the API URL
export function getApiUrl() {
  // In production, use the main domain
  if (window.location.hostname === 'www.thetomassonis.com' || window.location.hostname === 'thetomassonis.com') {
    return 'https://thetomassonis.com';
  }

  // If we have a configured API URL, use it
  if (configuredApiUrl) {
    // If we're accessing from the same machine (localhost), use the configured API URL
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return configuredApiUrl;
    }
    
    // If we're accessing from another device on the network
    try {
      const apiUrlObj = new URL(configuredApiUrl);
      return `${apiUrlObj.protocol}//${apiUrlObj.host}`;
    } catch (error) {
      console.error('Error parsing API URL:', error);
    }
  }

  // Fallback to localhost for development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  }

  // Default fallback for other cases
  console.warn('No API URL configured, using default based on environment');
  return 'https://thetomassonis.com';
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