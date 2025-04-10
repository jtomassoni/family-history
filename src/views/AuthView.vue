<template>
  <div class="auth-container" :class="{ 'showing-form': showEmailForm }">
    <div class="auth-modal">
      <div class="modal-header">
        <h2>{{ $route.path.includes('signup') ? 'Sign Up' : 'Log In' }}</h2>
        <p v-if="!showEmailForm">Choose your preferred method to continue</p>
        <p v-else>Enter your credentials to continue</p>
      </div>
      
      <div class="modal-body">
        <!-- OAuth providers -->
        <div v-if="!showEmailForm" class="oauth-providers">
          <button @click="handleGoogleLogin" class="oauth-button google">
            <img src="@/assets/icons/google.svg" alt="Google" class="oauth-icon" />
            Continue with Google
          </button>
          
          <div class="divider">
            <span>or</span>
          </div>
          
          <button @click="showEmailForm = true" class="email-button">
            <img src="@/assets/icons/email.svg" alt="Email" class="oauth-icon" />
            Continue with Email
          </button>
        </div>
        
        <!-- Error message -->
        <div v-if="authError" class="error-message">
          {{ authError }}
        </div>
        
        <!-- Email form -->
        <form v-else-if="showEmailForm" @submit.prevent="handleEmailLogin" class="email-form">
          <div class="form-group" v-if="$route.path.includes('signup')">
            <label for="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              v-model="name" 
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              placeholder="Enter your email address"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div class="form-actions">
            <button type="button" @click="showEmailForm = false" class="back-button">
              Back
            </button>
            <button type="submit" class="submit-button">
              {{ $route.path.includes('signup') ? 'Sign Up' : 'Log In' }}
            </button>
          </div>
        </form>
        
        <!-- OAuth callback handling -->
        <div v-if="$route.path.includes('/auth/callback')" class="callback-message">
          <p>Processing your login... Please wait.</p>
        </div>
      </div>
      
      <div class="modal-footer">
        <p v-if="$route.path.includes('login')">
          Don't have an account? <router-link to="/signup">Sign up</router-link>
        </p>
        <p v-else>
          Already have an account? <router-link to="/login">Log in</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// Form state
const showEmailForm = ref(false);
const name = ref('');
const email = ref('');
const password = ref('');

// Computed property for error message
const authError = computed(() => authStore.error);

// Login methods
const handleGoogleLogin = async () => {
  try {
    // Start standard Google OAuth flow without custom data
    await authStore.loginWithGoogle();
  } catch (error) {
    console.error('Google login error:', error);
  }
};

const handleEmailLogin = async () => {
  try {
    if (route.path.includes('signup')) {
      await authStore.signup(name.value, email.value, password.value);
    } else {
      await authStore.login(email.value, password.value);
    }
    router.push('/profile');
  } catch (error) {
    console.error('Authentication error:', error);
    // Handle auth error (could add error display)
  }
};

// Handle OAuth callbacks
onMounted(() => {
  if (route.path.includes('/auth/callback')) {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      console.log('Received authorization code from Google:', code);
      
      authStore.handleOAuthCallback(code)
        .then(() => {
          console.log('OAuth callback successful, redirecting to profile');
          router.push('/profile');
        })
        .catch(error => {
          console.error('OAuth callback error:', error);
          router.push('/login');
        });
    } else {
      // No code found in URL, redirect to login
      console.error('No authorization code found in callback URL');
      router.push('/login');
    }
  }
});
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
}

.auth-modal {
  background-color: #3a2a2a; /* Dark brown background like in the image */
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 450px;
  overflow: hidden;
  color: white;
}

.modal-header {
  padding: 1.5rem;
  text-align: center;
  background-color: transparent;
  color: white;
}

.modal-header h2 {
  margin: 0 0 0.5rem;
  font-size: 1.75rem;
}

.modal-header p {
  margin: 0;
  opacity: 0.9;
}

.modal-body {
  padding: 2rem;
}

.oauth-providers {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.oauth-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.oauth-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.oauth-button.google {
  background-color: transparent;
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
}

.oauth-button.google:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.oauth-icon {
  width: 24px;
  height: 24px;
}

.divider {
  display: flex;
  align-items: center;
  margin: 1rem 0;
  color: rgba(255, 255, 255, 0.6);
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.divider span {
  padding: 0 0.75rem;
  font-size: 0.875rem;
}

.email-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  border: none;
  background-color: #e63c3c; /* Red button like in the image */
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.email-button:hover {
  background-color: #d23232;
}

.email-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.form-group input {
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  transition: border-color 0.2s ease;
}

.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.form-group input:focus {
  outline: none;
  border-color: #e63c3c;
  background-color: rgba(255, 255, 255, 0.15);
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.back-button {
  padding: 0.75rem 1.25rem;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: transparent;
  color: white;
  cursor: pointer;
}

.back-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.submit-button {
  padding: 0.75rem 1.25rem;
  border-radius: 4px;
  border: none;
  background-color: #e63c3c; /* Red button like in the image */
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.submit-button:hover {
  background-color: #d23232;
}

.modal-footer {
  padding: 1rem 2rem;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-footer a {
  color: #EA4335; /* Google red color */
  font-weight: 600;
  text-decoration: none;
}

.modal-footer a:hover {
  text-decoration: underline;
  color: #ff5252; /* Brighter on hover */
}

.callback-message {
  text-align: center;
  padding: 2rem 0;
}

.error-message {
  background-color: rgba(220, 53, 69, 0.2);
  color: #fff;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  text-align: center;
  border: 1px solid rgba(220, 53, 69, 0.5);
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .auth-container {
    align-items: flex-start;
    padding-top: 15vh; /* Position about 15% from the top */
  }
  
  .auth-modal {
    max-width: 90%;
  }
  
  .modal-body {
    padding: 1.5rem;
  }
}

/* Small mobile devices */
@media (max-width: 480px) {
  .auth-container {
    padding-top: 10vh; /* Position about 10% from the top on very small screens */
  }
}
</style>
