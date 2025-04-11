<template>
  <div class="auth-page-wrapper">
    <div class="auth-page-container">
      <!-- Tabs for navigation -->
      <div class="auth-tabs">
        <button :class="{ active: !isSignup }" @click="isSignup = false">Login</button>
        <button :class="{ active: isSignup }" @click="isSignup = true">Sign Up</button>
      </div>

      <!-- Success Message -->
      <div v-if="showSuccessMessage" class="success-message">
        <div class="success-icon">✓</div>
        <h3>Registration Successful!</h3>
        <p>An email has been sent to <strong>{{ successEmail }}</strong>.</p>
        <p>Please check your inbox to verify your account.</p>
        <p class="redirect-message">Redirecting to home page in {{ countdown }} seconds...</p>
      </div>

      <!-- Login Form -->
      <div v-else-if="!isSignup">
        <form @submit.prevent="handleLogin">
          <div v-if="authError" class="auth-error">
            {{ authError }}
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" placeholder="Enter your email" required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="password" placeholder="Enter password" required />
          </div>
          <button type="submit" class="submit-button" :disabled="isLoading">
            <span v-if="isLoading" class="loading-spinner"></span>
            <span v-else>Login</span>
          </button>
        </form>
        <a @click="showForgotPassword = true" class="forgot-password">Forgot Password?</a>
      </div>

      <!-- Sign Up Form -->
      <div v-else>
        <form @submit.prevent="handleSignup">
          <div v-if="authError" class="auth-error">
            {{ authError }}
          </div>
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input type="text" id="firstName" v-model="firstName" placeholder="Enter your first name" required />
          </div>
          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input type="text" id="lastName" v-model="lastName" placeholder="Enter your last name" required />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" placeholder="Enter your email" required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="password" placeholder="Enter password" required />
          </div>
          <button type="submit" class="submit-button" :disabled="isLoading">
            <span v-if="isLoading" class="loading-spinner"></span>
            <span v-else>Sign Up</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const isSignup = ref(false);
const email = ref('');
const password = ref('');
const firstName = ref('');
const lastName = ref('');
const showForgotPassword = ref(false);
const showSuccessMessage = ref(false);
const successEmail = ref('');
const countdown = ref(10);
let redirectTimer = null;

// Computed properties
const isLoading = computed(() => authStore.isLoading);
const authError = computed(() => authStore.error);

// Start countdown when success message is shown
watch(showSuccessMessage, (showing) => {
  if (showing) {
    countdown.value = 10;
    redirectTimer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(redirectTimer);
        showSuccessMessage.value = false;
        successEmail.value = '';
        router.push('/');
      }
    }, 1000);
  } else if (redirectTimer) {
    clearInterval(redirectTimer);
  }
});

// Clean up timer when component is unmounted
onUnmounted(() => {
  if (redirectTimer) {
    clearInterval(redirectTimer);
  }
});

async function handleLogin() {
  try {
    const result = await authStore.login(email.value, password.value);
    if (result.success) {
      router.push('/profile');
    }
  } catch (error) {
    console.error('Login error:', error);
  }
}

async function handleSignup() {
  try {
    const userData = {
      email: email.value,
      password: password.value,
      first_name: firstName.value,
      last_name: lastName.value,
    };
    
    const result = await authStore.register(userData);
    if (result.success) {
      // Store the email for the success message
      successEmail.value = email.value;
      showSuccessMessage.value = true;
      
      // Clear the form
      email.value = '';
      password.value = '';
      firstName.value = '';
      lastName.value = '';
    }
  } catch (error) {
    console.error('Signup error:', error);
  }
}
</script>

<style scoped>
.auth-page-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f9f6f0;
}

.auth-page-container {
  max-width: 400px;
  width: 100%;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  text-align: center;
}

.auth-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.auth-tabs button {
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  color: #8c2d19;
  transition: color 0.3s ease;
}

.auth-tabs .active {
  font-weight: bold;
  color: #6b2214;
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #8c2d19;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.submit-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #8c2d19;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-button:hover {
  background-color: #6b2214;
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.forgot-password {
  display: block;
  margin-top: 1rem;
  color: #8c2d19;
  text-decoration: none;
  cursor: pointer;
}

.forgot-password:hover {
  text-decoration: underline;
}

.auth-error {
  background-color: #ffebee;
  color: #c62828;
  padding: 0.5rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.success-message {
  text-align: center;
  padding: 1.5rem;
  background-color: #e8f5e9;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.success-icon {
  font-size: 2rem;
  color: #2e7d32;
  margin-bottom: 1rem;
}

.success-message h3 {
  color: #2e7d32;
  margin-bottom: 0.5rem;
}

.success-message p {
  color: #1b5e20;
  margin-bottom: 0.5rem;
}

.success-message strong {
  color: #1b5e20;
  font-weight: 600;
}

.redirect-message {
  font-size: 0.9rem;
  color: #1b5e20;
  margin-top: 1rem;
}
</style>
