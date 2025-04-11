import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import { getApiUrl, getGoogleCallbackUrl } from '../utils/apiConfig';

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
      setAuthHeaders();
      console.log('Auth store initialized with user:', user.value);
    } else {
      console.log('No stored auth data found');
      // Clear any existing auth data
      user.value = null;
      token.value = null;
      delete axios.defaults.headers.common['Authorization'];
    }
  }

  // Set auth headers for API calls
  function setAuthHeaders() {
    if (token.value) {
      axios.defaults.headers.common['Authorization'] = `Token ${token.value}`;
      console.log('Auth headers set with token:', token.value);
    } else {
      console.log('No token available to set auth headers');
      delete axios.defaults.headers.common['Authorization'];
    }
  }

  // Get auth headers for API calls
  function getAuthHeaders() {
    if (token.value) {
      return {
        'Authorization': `Token ${token.value}`
      };
    }
    return {};
  }

  // Login with Google
  async function loginWithGoogle() {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || import.meta.env.GOOGLE_CLIENT_ID;
    const redirectUri = getGoogleCallbackUrl();
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

      const response = await axios.post(`${apiUrl}/api/auth/google/callback/`, {
        code,
        redirect_uri: getGoogleCallbackUrl()
      });

      console.log('Google callback response:', response.data);
      const { user: userData, token: authToken } = response.data;
      
      // Ensure avatar is set
      user.value = {
        ...userData,
        avatar: userData.avatar || userData.picture // Assuming 'picture' is the field for Google image
      };

      // Construct full_name if not available
      if (!userData.full_name && userData.first_name && userData.last_name) {
        userData.full_name = `${userData.first_name} ${userData.last_name}`;
      }

      token.value = authToken;
      
      localStorage.setItem('user', JSON.stringify(user.value));
      localStorage.setItem('token', authToken);
      
      setAuthHeaders();
      
      // If user is admin, fetch admin stats
      if (isAdmin.value) {
        await fetchAdminStats();
      }
      
      return { success: true, user: user.value };
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
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', authToken);
      
      // Set auth headers
      setAuthHeaders();
      
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

  // Refresh user data from backend
  async function refreshUserData() {
    try {
      if (!token.value) {
        console.error('No token available for refresh');
        return;
      }
      
      console.log('Refreshing user data with token:', token.value);
      const response = await axios.get(`${apiUrl}/api/auth/user/`, {
        headers: getAuthHeaders()
      });
      
      if (response.data) {
        user.value = response.data;
        localStorage.setItem('user', JSON.stringify(user.value));
        console.log('Successfully refreshed user data:', user.value);
      } else {
        console.error('No user data received from server');
      }
    } catch (err) {
      console.error('Failed to refresh user data:', err);
      if (err.response?.status === 403) {
        console.error('Token may be invalid or expired');
        // Clear invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        token.value = null;
        user.value = null;
        delete axios.defaults.headers.common['Authorization'];
      }
    }
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

  // Check if user exists
  async function checkUserExists(email) {
    try {
      const response = await axios.get(`${apiUrl}/api/auth/check-user/`, {
        params: { email }
      });
      return response.data.exists;
    } catch (err) {
      console.error('Error checking user existence:', err);
      return false;
    }
  }

  // Send password reset email
  async function sendPasswordReset(email) {
    try {
      isLoading.value = true;
      error.value = null;
      console.log('Attempting to send password reset email to:', email);

      const response = await axios.post(`${apiUrl}/api/auth/password-reset/`, {
        email
      });

      console.log('Password reset response:', response.data);
      return { success: true, message: 'Password reset email sent successfully' };
    } catch (err) {
      console.error('Error sending password reset:', err);
      error.value = err.response?.data?.message || 'Failed to send password reset email';
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  }

  async function uploadProfileImage(file) {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(`${apiUrl}/api/users/upload_profile_image/`, formData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.picture_url) {
        // Update the user data with the new picture URL
        await refreshUserData();
      }

      return response.data;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
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
    getAuthHeaders,
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
    refreshUserData,
    checkUserExists,
    sendPasswordReset,
    uploadProfileImage
  };
}); 