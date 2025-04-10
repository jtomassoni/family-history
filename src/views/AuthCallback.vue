<template>
  <div class="auth-callback">
    <div class="auth-callback__container">
      <div class="auth-callback__content">
        <div class="auth-callback__loading" v-if="isLoading">
          <div class="auth-callback__spinner"></div>
          <h2>Processing your login...</h2>
          <p>{{ loadingMessage }}</p>
        </div>
        
        <div class="auth-callback__error" v-if="errorMessage">
          <h2>Authentication Error</h2>
          <p>{{ errorMessage }}</p>
          <button @click="goToLogin" class="auth-callback__button">
            Return to Login
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const isLoading = ref(true);
const errorMessage = ref(null);
const loadingMessage = ref('Please wait while we authenticate you');

function goToLogin() {
  router.push('/auth');
}

onMounted(async () => {
  console.log('AuthCallback mounted - URI:', window.location.href);
  console.log('Route query params:', route.query);
  
  // Get the code from the URL
  const code = route.query.code;
  const errorParam = route.query.error;
  
  if (errorParam) {
    console.error('Authentication error from OAuth provider:', errorParam);
    isLoading.value = false;
    errorMessage.value = `Authentication failed: ${errorParam}`;
    return;
  }
  
  if (!code) {
    console.error('No authorization code received in callback');
    isLoading.value = false;
    errorMessage.value = 'No authentication code received';
    return;
  }
  
  try {
    console.log('Processing authorization code:', code);
    
    // Update loading message
    loadingMessage.value = 'Exchanging authorization code for tokens...';
    
    // Process the callback
    const result = await authStore.handleGoogleCallback(code, route.query);
    console.log('Auth callback result:', result);
    
    if (result.success) {
      loadingMessage.value = 'Authentication successful! Redirecting to your profile...';
      
      // Force refresh user data from local storage 
      authStore.refreshUserData();
      
      // Make sure we have the user data before redirecting
      console.log('User data after callback:', authStore.user);
      
      // Clear any existing login redirects or parameters
      sessionStorage.removeItem('google_oauth_info');
      
      // First update loading state to show success
      setTimeout(() => {
        console.log('Redirecting to profile page');
        
        // Force a complete page reload to make sure the auth state is refreshed
        window.location.href = window.location.origin + '/profile';
      }, 1000);
    } else {
      console.error('Authentication callback failed:', result.error);
      errorMessage.value = result.error || 'Authentication failed';
      isLoading.value = false;
    }
  } catch (err) {
    console.error('Error in callback processing:', err);
    errorMessage.value = err.message || 'Authentication failed';
    isLoading.value = false;
  }
});
</script>

<style scoped>
.auth-callback {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.auth-callback__container {
  max-width: 500px;
  width: 100%;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  text-align: center;
}

.auth-callback__content {
  padding: 1rem;
}

.auth-callback__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.auth-callback__spinner {
  width: 60px;
  height: 60px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #8c2d19; /* Wine color */
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.auth-callback__button {
  background-color: #8c2d19; /* Wine color */
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;
}

.auth-callback__button:hover {
  background-color: #6b2214; /* Darker wine color */
}

.auth-callback h2 {
  margin-bottom: 0.5rem;
  color: #333;
}

.auth-callback p {
  color: #666;
  margin-bottom: 1.5rem;
}

.auth-callback__error {
  color: #d32f2f;
}
</style> 