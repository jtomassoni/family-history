<template>
  <div class="auth-page-wrapper">
    <div class="auth-page-container">
      <!-- Main screen with login options -->
      <div v-if="!showEmailForm">
        <h1>{{ isSignup ? "Sign Up" : "Login" }}</h1>
        
        <div class="auth-options">
          <button class="auth-option email-option" @click="showEmailForm = true">
            <span class="icon">✉️</span>
            <span>{{ isSignup ? "Sign Up with Email" : "Login with Email" }}</span>
          </button>
          
          <button class="auth-option google-option" @click="handleGoogleLogin">
            <span class="icon">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </span>
            <span>{{ isSignup ? "Sign Up with Google" : "Login with Google" }}</span>
          </button>
        </div>
        
        <p class="auth-info">
          {{ isSignup ? "Already have an account?" : "Need an account?" }}
          <a @click.prevent="toggleSignup" href="#">
            {{ isSignup ? "Log in" : "Sign up" }}
          </a>
        </p>
      </div>
      
      <!-- Email Form -->
      <div v-else class="email-auth-form" :data-signup="isSignup">
        <div class="form-header">
          <button class="back-button" @click="showEmailForm = false">← Back</button>
          <h1>{{ isSignup ? "Sign Up with Email" : "Login with Email" }}</h1>
        </div>
        
        <div v-if="registrationComplete" class="success-message">
          <h2>Registration Complete!</h2>
          <p>Please check your email to verify your account.</p>
          <p class="email-sent">We've sent a verification link to <strong>{{ email }}</strong></p>
          <button class="login-button" @click="showEmailForm = false">Return to Login</button>
        </div>
        
        <form v-else @submit.prevent="handleEmailSubmit" class="auth-form">
          <!-- Registration fields -->
          <template v-if="isSignup">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input 
                type="text" 
                id="firstName" 
                v-model="firstName" 
                placeholder="Enter your first name" 
                required
              />
            </div>
            
            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input 
                type="text" 
                id="lastName" 
                v-model="lastName" 
                placeholder="Enter your last name" 
                required
              />
            </div>
          </template>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              placeholder="Enter your email" 
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              placeholder="Enter password" 
              required
            />
          </div>

          <!-- Show confirm password field only on signup -->
          <div v-if="isSignup" class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="confirmPassword" 
              placeholder="Confirm password" 
              required
            />
          </div>

          <p v-if="error" class="error-message">{{ error }}</p>

          <button 
            type="submit" 
            class="submit-button"
            :disabled="loading"
          >
            {{ loading ? 'Processing...' : (isSignup ? "Create Account" : "Sign In") }}
          </button>
          
          <p class="auth-info">
            {{ isSignup ? "Already have an account?" : "Need an account?" }}
            <a @click.prevent="toggleSignup" href="#">
              {{ isSignup ? "Log in" : "Sign up" }}
            </a>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import './AuthView.css'

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// State variables
const showEmailForm = ref(false);
const isSignup = ref(route.path === '/signup');
const registrationComplete = ref(false);

// Form fields
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const firstName = ref('');
const lastName = ref('');

// Local error and loading state
const localError = ref(null);
const localLoading = ref(false);

// Computed properties for loading and error states
const loading = computed(() => localLoading.value || authStore.isLoading);
const error = computed(() => localError.value || authStore.error);

// Toggle between signup and login
function toggleSignup() {
  isSignup.value = !isSignup.value;
  
  // Update URL without reloading the page
  const query = isSignup.value ? { signup: 'true' } : {};
  router.replace({ query });
}

// Handle Google login
function handleGoogleLogin() {
  const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/callback`;
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  
  if (!clientId) {
    console.error('Google Client ID not configured');
    return;
  }
  
  // Build Google OAuth URL
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.append('client_id', clientId);
  googleAuthUrl.searchParams.append('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.append('response_type', 'code');
  googleAuthUrl.searchParams.append('scope', 'email profile');
  googleAuthUrl.searchParams.append('prompt', 'select_account');
  
  // Redirect to Google auth page
  window.location.href = googleAuthUrl.toString();
}

// Handle email login/signup
async function handleEmailSubmit() {
  localError.value = null;
  localLoading.value = true;
  
  try {
    if (isSignup.value) {
      // Register flow
      if (password.value !== confirmPassword.value) {
        localError.value = "Passwords do not match!";
        localLoading.value = false;
        return;
      }
      
      const userData = {
        email: email.value,
        password: password.value,
        first_name: firstName.value,
        last_name: lastName.value,
      };
      
      await authStore.register(userData);
      
      // Show registration complete message
      registrationComplete.value = true;
    } else {
      // Login flow
      const result = await authStore.login(email.value, password.value);
      
      if (result.success) {
        // Force refresh user data from local storage
        authStore.refreshUserData();
        
        // Make sure we have the user data before redirecting
        console.log('User data after login:', authStore.user);
        
        // Redirect to profile page on successful login
        router.push('/profile');
      } else {
        localError.value = result.error || 'Authentication failed. Please try again.';
      }
    }
  } catch (err) {
    console.error('Authentication error:', err);
    localError.value = err.message || 'Authentication failed. Please try again.';
  } finally {
    localLoading.value = false;
  }
}

// Initialize from URL params
onMounted(() => {
  isSignup.value = route.path === '/signup' || route.query.signup === 'true';
});
</script>

<style scoped>
.auth-page-wrapper {
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f6f0;
  padding: 0.1rem;
  box-sizing: border-box;
}

.auth-page-container {
  max-width: 350px;
  width: 100%;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  text-align: center;
  box-sizing: border-box;
}

h1 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #8c2d19; /* Wine theme */
  margin-bottom: 0.5rem;
}

.auth-options {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.auth-option {
  padding: 0.3rem 0.5rem;
  font-size: 0.7rem;
}

.submit-button {
  padding: 0.4rem;
  font-size: 0.7rem;
}

.auth-info {
  font-size: 0.65rem;
  margin-top: 0.5rem;
}

.auth-info a {
  color: #8c2d19; /* Wine theme */
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
}

.auth-info a:hover {
  text-decoration: underline;
}

/* Email form styles */
.email-auth-form {
  width: 100%;
}

.form-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
  position: relative;
  padding-top: 0.5rem;
}

.back-button {
  position: absolute;
  left: 0;
  top: 0.5rem;
  background: none;
  border: none;
  color: #8c2d19; /* Wine theme */
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin: 0;
}

.form-group label {
  font-size: 0.8rem;
  font-weight: 500;
  color: #333;
}

.form-group input {
  padding: 0.4rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.8rem;
  transition: border-color 0.2s;
  margin: 0;
}

.form-group input:focus {
  border-color: #8c2d19; /* Wine theme */
  outline: none;
}

.submit-button {
  background-color: #8c2d19; /* Wine theme */
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 0.5rem;
}

.submit-button:hover {
  background-color: #6b2214; /* Darker wine */
}

.submit-button:disabled {
  background-color: #ccbdaf;
  cursor: not-allowed;
}

.error-message {
  color: #d32f2f;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

/* Success message styles */
.success-message {
  text-align: center;
  padding: 1rem 0;
}

.success-message h2 {
  color: #2e7d32;
  margin-bottom: 1rem;
}

.email-sent {
  background-color: #e8f5e9;
  padding: 1rem;
  border-radius: 8px;
  margin: 1.5rem 0;
}

.login-button {
  background-color: #8c2d19; /* Wine theme */
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-button:hover {
  background-color: #6b2214; /* Darker wine */
}

@media (max-width: 768px) {
  .auth-page-container {
    padding: 0.5rem;
  }

  h1 {
    font-size: 1.2rem;
  }

  .submit-button {
    padding: 0.3rem;
    font-size: 0.65rem;
  }

  .auth-info {
    font-size: 0.6rem;
  }
}
</style>
