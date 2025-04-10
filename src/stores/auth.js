import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import { getApiUrl } from '../utils/apiConfig';

export const useAuthStore = defineStore('auth', () => {
  // Get the dynamic API URL
  const apiUrl = getApiUrl();
  
  const user = ref(null);
  const token = ref(null);
  const isAuthModalVisible = ref(false);
  const authModalType = ref('sso'); // 'sso' or 'email'
  const isLoading = ref(false);
  const error = ref(null);

  // Admin specific state
  const adminStats = ref({
    totalUsers: 0,
    activeUsers: 0,
    totalContent: 0,
    recentActivity: []
  });

  const isAdmin = computed(() => {
    const isStaff = !!user.value?.is_staff;
    const isSuperuser = !!user.value?.is_superuser;
    // Special case: Make jtomassoni@gmail.com always an admin
    const isSpecialAdmin = user.value?.email === 'jtomassoni@gmail.com';
    const result = isStaff || isSuperuser || isSpecialAdmin;
    console.log('isAdmin check:', { isStaff, isSuperuser, isSpecialAdmin, result });
    return result;
  });

  // Initialize from localStorage
  function initializeFromStorage() {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    console.log('Initializing auth store from storage:', { storedUser, storedToken });
    if (storedUser && storedToken) {
      user.value = JSON.parse(storedUser);
      token.value = storedToken;
      console.log('Auth store initialized with user:', user.value);
    } else {
      console.log('No stored auth data found');
    }
  }

  // Set auth headers for API calls
  function setAuthHeaders() {
    if (token.value) {
      axios.defaults.headers.common['Authorization'] = `Token ${token.value}`;
    }
  }

  // Login with Google
  async function loginWithGoogle() {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
    const scope = 'email profile';
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    window.location.href = authUrl;
  }

  // Handle Google OAuth callback
  async function handleGoogleCallback(code) {
    try {
      isLoading.value = true;
      error.value = null;
      console.log('Starting Google callback with code:', code);

      const response = await axios.post(`${apiUrl}/auth/google/callback/`, {
        code,
        redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI
      });

      console.log('Google callback response:', response.data);
      const { user: userData, token: authToken } = response.data;
      
      user.value = userData;
      token.value = authToken;
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', authToken);
      
      setAuthHeaders();
      
      // If user is admin, fetch admin stats
      if (isAdmin.value) {
        await fetchAdminStats();
      }
      
      return { success: true, user: userData };
    } catch (err) {
      console.error('Google callback error:', err);
      error.value = err.response?.data?.message || 'Failed to authenticate with Google';
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  }

  // Login with email and password
  async function login(email, password) {
    try {
      isLoading.value = true;
      error.value = null;
      console.log('Attempting login with email:', email);
      console.log('Using API URL:', apiUrl);

      const response = await axios.post(`${apiUrl}/api/auth/login/`, {
        email,
        password
      });

      console.log('Login response:', response.data);
      const { token: authToken, user: userData } = response.data;
      
      // Store the user data and token
      user.value = userData;
      token.value = authToken;
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', authToken);
      
      setAuthHeaders();
      
      // If user is admin, fetch admin stats
      if (isAdmin.value) {
        await fetchAdminStats();
      }
      
      return { success: true, user: userData };
    } catch (err) {
      console.error('Login error:', err);
      error.value = err.response?.data?.message || 'Failed to login';
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  }

  // Register new user
  async function register(userData) {
    try {
      isLoading.value = true;
      error.value = null;
      console.log('Attempting registration with data:', userData);

      const response = await axios.post(`${apiUrl}/api/auth/register/`, userData);

      console.log('Registration response:', response.data);
      return { success: true };
    } catch (err) {
      console.error('Registration error:', err);
      error.value = err.response?.data?.message || 'Failed to register';
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  }

  // Refresh user data from storage
  function refreshUserData() {
    console.log('Refreshing user data from storage');
    initializeFromStorage();
    setAuthHeaders();
  }

  // Fetch admin statistics
  async function fetchAdminStats() {
    try {
      const response = await axios.get(`${apiUrl}/admin/stats/`);
      adminStats.value = response.data;
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    }
  }

  // Get all users (admin only)
  async function getAllUsers() {
    try {
      const response = await axios.get(`${apiUrl}/admin/users/`);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch users';
      throw err;
    }
  }

  // Update user status (admin only)
  async function updateUserStatus(userId, isActive) {
    try {
      const response = await axios.patch(`${apiUrl}/admin/users/${userId}/`, {
        is_active: isActive
      });
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update user status';
      throw err;
    }
  }

  // Generate admin report
  async function generateReport(type) {
    try {
      const response = await axios.get(`${apiUrl}/admin/reports/${type}/`);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to generate report';
      throw err;
    }
  }

  // Logout
  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }

  return {
    user,
    token,
    isAuthModalVisible,
    authModalType,
    isLoading,
    error,
    adminStats,
    isAdmin,
    initializeFromStorage,
    setAuthHeaders,
    login,
    register,
    loginWithGoogle,
    handleGoogleCallback,
    fetchAdminStats,
    getAllUsers,
    updateUserStatus,
    generateReport,
    logout,
    showAuthModal: () => {
      isAuthModalVisible.value = true;
      authModalType.value = 'sso';
    },
    hideAuthModal: () => {
      isAuthModalVisible.value = false;
    },
    setAuthModalType: (type) => {
      authModalType.value = type;
    },
    refreshUserData
  };
}); 