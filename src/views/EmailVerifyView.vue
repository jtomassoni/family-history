<template>
  <div class="verify-page-wrapper">
    <div class="verify-container">
      <div v-if="loading" class="verify-loading">
        <div class="loading-spinner"></div>
        <h2>Verifying your email...</h2>
      </div>
      
      <div v-else-if="verified" class="verify-success">
        <div class="success-icon">✓</div>
        <h2>Email Verified!</h2>
        <p>Your email has been successfully verified.</p>
        <p class="success-message">Your account is now active. You can now log in to access your account.</p>
        <router-link to="/login" class="login-button">Go to Login</router-link>
      </div>
      
      <div v-else-if="error" class="verify-error">
        <div class="error-icon">!</div>
        <h2>Verification Failed</h2>
        <p>We couldn't verify your email address.</p>
        <p class="error-message">{{ error }}</p>
        <p>If the problem persists, please contact support.</p>
        <router-link to="/login" class="login-button">Return to Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const route = useRoute();
const { verifyEmail } = useAuth();

const loading = ref(true);
const verified = ref(false);
const error = ref(null);

onMounted(async () => {
  const verificationCode = route.params.code;
  
  if (!verificationCode) {
    error.value = 'Invalid verification link. Please check your email or request a new verification link.';
    loading.value = false;
    return;
  }
  
  try {
    // Attempt to verify the email
    await verifyEmail(verificationCode);
    verified.value = true;
  } catch (err) {
    error.value = err.message || 'An error occurred during verification.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.verify-page-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f6f0;
  padding: 1rem;
}

.verify-container {
  max-width: 500px;
  width: 100%;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  text-align: center;
}

.verify-loading,
.verify-success,
.verify-error {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #8c2d19; /* Wine theme color */
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

h2 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

p {
  color: #666;
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
}

.success-icon,
.error-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.success-icon {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.error-icon {
  background-color: #ffebee;
  color: #d32f2f;
}

.success-message {
  background-color: #e8f5e9;
  padding: 1rem;
  border-radius: 8px;
  color: #2e7d32;
  margin: 1.5rem 0;
}

.error-message {
  background-color: #ffebee;
  padding: 1rem;
  border-radius: 8px;
  color: #d32f2f;
  margin: 1.5rem 0;
}

.login-button {
  display: inline-block;
  background-color: #8c2d19; /* Wine theme */
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
  margin-top: 1rem;
}

.login-button:hover {
  background-color: #6b2214; /* Darker wine */
}
</style> 