/**
 * API configuration utility
 * 
 * This handles setting up the correct API URL when accessing the app from different devices
 * on the same network.
 */

// Get the base API URL from environment variables
const configuredApiUrl = import.meta.env.VITE_API_URL;
const configuredAppUrl = import.meta.env.VITE_APP_URL;
const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

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

// Function to get the Google redirect URI adjusted for the current device
export function getAdjustedRedirectUri() {
  // On localhost, use the configured redirect URI as is
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return redirectUri;
  }
  
  // On other devices, create a redirect URI using the device's current origin
  const path = new URL(redirectUri).pathname;
  return `${window.location.origin}${path}`;
}

// Function to get the base app URL for constructing links
export function getAppUrl() {
  // If we're accessing from the same machine (localhost), use the configured app URL
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return configuredAppUrl;
  }
  
  // If we're accessing from another device, use the current origin
  return window.location.origin;
}

// Default export for convenience
export default {
  getApiUrl,
  getAdjustedRedirectUri,
  getAppUrl
}; 