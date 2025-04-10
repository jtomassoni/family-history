import { defineStore } from 'pinia';
import { ref, computed, inject } from 'vue';
import { authConfig } from '../config/auth';
import { useRouter } from 'vue-router';

// Utility function to delay for a specific time
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const useAuthStore = defineStore('auth', () => {
  // Optional injection of loader methods - will use if available
  const showLoader = inject('showLoader', null);
  const hideLoader = inject('hideLoader', null);
  
  const user = ref(null);
  const token = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  const isAuthenticated = computed(() => !!token.value);

  const router = useRouter();

  // Start loading with minimum duration
  const startLoading = async () => {
    isLoading.value = true;
    if (showLoader) showLoader();
  };

  // End loading with minimum duration
  const endLoading = async (delayMs = 0) => {
    if (hideLoader) hideLoader(delayMs);
    isLoading.value = false;
  };

  // Initialize from localStorage
  const initFromStorage = () => {
    console.log('Initializing auth store from localStorage');
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    console.log('Found in localStorage:', { 
      token: storedToken ? 'present' : 'missing', 
      user: storedUser ? 'present' : 'missing' 
    });
    
    if (storedToken && storedUser) {
      token.value = storedToken;
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('Setting user from localStorage:', parsedUser);
        user.value = parsedUser;
        console.log('After setting user, current user value:', user.value);
      } catch (e) {
        console.error('Failed to parse user data from localStorage:', e);
      }
    }
  };

  // Call initFromStorage when the store is created
  initFromStorage();

  async function loginWithGoogle() {
    try {
      await startLoading();
      error.value = null;
      
      // Get the current origin for the redirect URI
      const currentOrigin = window.location.origin;
      const redirectUri = authConfig.google.redirectUri || `${currentOrigin}/auth/callback`;
      
      // Try to get any existing authentication info that might help with the callback
      const existingInfo = {};
      if (user.value) {
        existingInfo.email = user.value.email;
        existingInfo.name = user.value.name;
        existingInfo.picture = user.value.picture;
      }
      
      // Store existing info in session storage for the callback to use if needed
      if (Object.keys(existingInfo).length > 0) {
        sessionStorage.setItem('google_oauth_info', JSON.stringify(existingInfo));
      }
      
      // Construct Google OAuth URL
      const params = new URLSearchParams({
        client_id: authConfig.google.clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'profile email', // Request both profile and email scopes
        access_type: 'offline',
        prompt: 'consent select_account', // Force consent screen and account selection
        // Add login_hint if we have an email to help pre-fill Google login
        ...(existingInfo.email ? { login_hint: existingInfo.email } : {})
      });

      console.log('Redirecting to Google with URI:', redirectUri);
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    } catch (err) {
      error.value = err.message;
      await endLoading();
      throw err;
    }
  }

  // Handle any OAuth callback - currently just delegates to Google
  async function handleOAuthCallback(code, params = {}) {
    return handleGoogleCallback(code, params);
  }

  const handleGoogleCallback = async (code, params = {}) => {
    try {
      isLoading.value = true;
      error.value = null;
      
      console.log("Processing Google OAuth callback with code:", code.substring(0, 10) + "...");
      
      // Make a real API call to the backend to exchange the code for tokens and user info
      const response = await fetch(authConfig.endpoints.googleAuth, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code,
          redirectUri: authConfig.google.redirectUri
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('Error from backend:', errorData);
        throw new Error(errorData.message || `Server responded with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Successful authentication response from server:', data);
      
      if (!data.user || !data.token) {
        throw new Error('Invalid response from authentication server');
      }
      
      // Save authentication data to localStorage
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      
      // Update state
      token.value = data.token;
      user.value = data.user;
      
      console.log('Authentication successful, user:', user.value);
      
      // Return success
      return { success: true, userData: data.user };
    } catch (e) {
      console.error("Google callback error:", e);
      error.value = e.message || "Failed to process Google login";
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  // Function to refresh user data from localStorage
  const refreshUserData = () => {
    try {
      console.log('Auth store: refreshing user data from localStorage');
      
      const storedUser = localStorage.getItem('auth_user');
      const storedToken = localStorage.getItem('auth_token') || localStorage.getItem('auth_tokens');
      
      console.log('Auth store found localStorage:', {
        userFound: !!storedUser,
        tokenFound: !!storedToken
      });
      
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        console.log('Auth store parsed user data:', userData);
        
        // Update the user reference
        user.value = userData;
        
        console.log('Auth store user after refresh:', user.value);
      }
      
      if (storedToken) {
        let tokenValue = storedToken;
        
        // If this is the tokens object, extract access_token
        if (storedToken.includes('{')) {
          try {
            const tokens = JSON.parse(storedToken);
            tokenValue = tokens.access_token;
          } catch (e) {
            console.error('Error parsing token JSON:', e);
          }
        }
        
        // Update the token
        token.value = tokenValue;
        
        console.log('Auth store token after refresh:', token.value ? 'Token set' : 'No token');
      }
      
      return { 
        userLoaded: !!user.value,
        tokenLoaded: !!token.value
      };
    } catch (e) {
      console.error("Error refreshing user data:", e);
      return { userLoaded: false, tokenLoaded: false };
    }
  };

  // Call refresh on store initialization
  refreshUserData();

  // Email login
  async function login(email, password) {
    try {
      await startLoading();
      error.value = null;
      
      console.log('Login attempt with:', { email, password });
      
      // Simulate API delay
      await delay(800);
      
      // Use real user data
      const userData = {
        email: 'james.tomassoni@gmail.com',
        name: 'James Tomassoni',
        picture: 'https://randomuser.me/api/portraits/men/32.jpg'
      };
      
      // Update state
      user.value = userData;
      token.value = `email_token_${Date.now()}`;
      
      // Store in localStorage
      localStorage.setItem('auth_token', token.value);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      
      await endLoading();
      return { user: userData, token: token.value };
    } catch (err) {
      error.value = err.message;
      await endLoading();
      throw err;
    }
  }
  
  // Email signup
  async function signup(name, email, password) {
    try {
      await startLoading();
      error.value = null;
      
      console.log('Signup attempt with:', { name, email, password });
      
      // Simulate API delay
      await delay(1000);
      
      // Use real user data
      const userData = {
        email: 'james.tomassoni@gmail.com',
        name: 'James Tomassoni',
        picture: 'https://randomuser.me/api/portraits/men/32.jpg'
      };
      
      // Update state
      user.value = userData;
      token.value = `signup_token_${Date.now()}`;
      
      // Store in localStorage
      localStorage.setItem('auth_token', token.value);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      
      await endLoading();
      return { user: userData, token: token.value };
    } catch (err) {
      error.value = err.message;
      await endLoading();
      throw err;
    }
  }

  async function logout() {
    await startLoading();
    token.value = null;
    user.value = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_tokens');
    await endLoading(1000);
  }

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    loginWithGoogle,
    handleGoogleCallback,
    handleOAuthCallback,
    login,
    signup,
    logout,
    initFromStorage,
    refreshUserData
  };
}); 