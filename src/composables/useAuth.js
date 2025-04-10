import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

// Get the API URL from environment variables, with fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
console.log('API URL:', API_URL); // Debug the API URL

// State that will be preserved between component instances
const user = ref(null);
const token = ref(null);
const loading = ref(false);
const error = ref(null);

// Initialize from localStorage if available
if (localStorage.getItem('auth_token')) {
  token.value = localStorage.getItem('auth_token');
  user.value = JSON.parse(localStorage.getItem('auth_user') || 'null');
}

export function useAuth() {
  const router = useRouter();
  
  // Computed property to check if user is authenticated
  const isAuthenticated = computed(() => !!token.value);
  
  // Computed property to check if user is admin/superuser
  const isAdmin = computed(() => user.value?.is_superuser || false);
  
  // Login with email and password (works for superuser too)
  async function login(email, password) {
    loading.value = true;
    error.value = null;
    
    try {
      console.log(`Attempting to connect to API at: ${API_URL}/api/auth/login/`);
      
      const response = await fetch(`${API_URL}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      }).catch(networkError => {
        console.error('Network error:', networkError);
        throw new Error(`Connection to server failed. Please check if the server is running at ${API_URL}`);
      });
      
      const data = await response.json().catch(parseError => {
        console.error('Parse error:', parseError);
        throw new Error('Failed to parse server response');
      });
      
      if (!response.ok) {
        console.error('Response not OK:', response.status, data);
        throw new Error(data.error || `Login failed (${response.status})`);
      }
      
      console.log('Login successful:', data);
      
      // Store token and user data
      token.value = data.token;
      user.value = data.user;
      
      // Save to localStorage
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      
      return data;
    } catch (err) {
      console.error('Login error:', err);
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  // Register with email (with verification)
  async function register(userData) {
    loading.value = true;
    error.value = null;
    
    try {
      console.log(`Attempting to register user at: ${API_URL}/api/auth/register/`);
      
      const response = await fetch(`${API_URL}/api/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userData)
      }).catch(networkError => {
        console.error('Network error during registration:', networkError);
        throw new Error(`Connection to server failed. Please check if the server is running at ${API_URL}`);
      });
      
      const data = await response.json().catch(parseError => {
        console.error('Parse error during registration:', parseError);
        throw new Error('Failed to parse server response');
      });
      
      if (!response.ok) {
        console.error('Registration response not OK:', response.status, data);
        throw new Error(data.error || `Registration failed (${response.status})`);
      }
      
      console.log('Registration successful:', data);
      
      return data;
    } catch (err) {
      console.error('Registration error:', err);
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  // Verify email with verification code
  async function verifyEmail(verificationCode) {
    loading.value = true;
    error.value = null;
    
    try {
      console.log(`Attempting to verify email at: ${API_URL}/api/auth/verify-email/${verificationCode}/`);
      
      const response = await fetch(`${API_URL}/api/auth/verify-email/${verificationCode}/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      }).catch(networkError => {
        console.error('Network error during email verification:', networkError);
        throw new Error(`Connection to server failed. Please check if the server is running at ${API_URL}`);
      });
      
      const data = await response.json().catch(parseError => {
        console.error('Parse error during email verification:', parseError);
        throw new Error('Failed to parse server response');
      });
      
      if (!response.ok) {
        console.error('Email verification response not OK:', response.status, data);
        throw new Error(data.error || `Email verification failed (${response.status})`);
      }
      
      console.log('Email verification successful:', data);
      
      return data;
    } catch (err) {
      console.error('Email verification error:', err);
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  // Fetch current user's profile
  async function fetchUserProfile() {
    if (!token.value) return null;
    
    loading.value = true;
    error.value = null;
    
    try {
      const response = await fetch(`${API_URL}/api/users/me/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token.value}`,
        },
      });
      
      // If token is invalid or expired
      if (response.status === 401) {
        logout();
        throw new Error('Session expired. Please log in again.');
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch user profile');
      }
      
      // Update user data
      user.value = data;
      localStorage.setItem('auth_user', JSON.stringify(data));
      
      return data;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  // Logout function
  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    router.push('/login');
  }
  
  // API request helper with authentication
  async function authenticatedRequest(url, options = {}) {
    if (!token.value) {
      throw new Error('No authentication token');
    }
    
    const headers = {
      'Authorization': `Token ${token.value}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
    });
    
    // Handle 401 Unauthorized (token expired or invalid)
    if (response.status === 401) {
      logout();
      throw new Error('Session expired. Please log in again.');
    }
    
    return response;
  }
  
  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    verifyEmail,
    fetchUserProfile,
    logout,
    authenticatedRequest,
  };
} 