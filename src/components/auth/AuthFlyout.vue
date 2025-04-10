<template>
  <transition name="fade">
    <div v-if="isOpen" class="auth-overlay" @click.self="close">
      <transition name="slide">
        <div class="auth-flyout" :class="{ 'is-mobile': isMobile }">
          <div class="auth-panel">
            <button class="close-button" @click="close" aria-label="Close">
              <svg class="close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>

            <div class="auth-content">
              <h2 class="auth-title">{{ isSignup ? 'Create Account' : 'Welcome Back' }}</h2>
              <p class="auth-subtitle">{{ isSignup ? 'Join our family history community' : 'Choose how you\'d like to continue' }}</p>

              <div v-if="authError" class="auth-error">
                {{ authError }}
              </div>

              <!-- SSO Options -->
              <div v-if="!showEmailForm" class="sso-options">
                <button class="sso-button google-sso" @click="handleGoogleLogin" :disabled="isLoading">
                  <svg class="sso-icon" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <div class="sso-button-content">
                    <span>Continue with Google</span>
                  </div>
                </button>

                <div class="divider">
                  <span>or</span>
                </div>

                <button @click="showEmailForm = true" class="sso-button email-sso">
                  <svg class="sso-icon" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
                  </svg>
                  <span>Continue with Email</span>
                </button>

                <p class="auth-footer">
                  {{ isSignup ? 'Already have an account?' : 'Don\'t have an account?' }}
                  <button class="text-button" @click="toggleSignup">
                    {{ isSignup ? 'Sign in' : 'Sign up' }}
                  </button>
                </p>
              </div>

              <!-- Email Form -->
              <form v-else class="email-form" @submit.prevent="handleEmailSubmit">
                <div v-if="isSignup" class="form-group">
                  <label for="firstName">First Name</label>
                  <input
                    id="firstName"
                    v-model="firstName"
                    type="text"
                    placeholder="First Name"
                    required
                  />
                </div>

                <div v-if="isSignup" class="form-group">
                  <label for="lastName">Last Name</label>
                  <input
                    id="lastName"
                    v-model="lastName"
                    type="text"
                    placeholder="Last Name"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="email">Email</label>
                  <input
                    id="email"
                    v-model="email"
                    type="email"
                    placeholder="Email"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="password">Password</label>
                  <input
                    id="password"
                    v-model="password"
                    type="password"
                    placeholder="Password"
                    required
                  />
                </div>

                <div v-if="isSignup" class="form-group">
                  <label for="confirmPassword">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    v-model="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    required
                  />
                </div>

                <button type="submit" class="submit-button" :disabled="isLoading">
                  <span v-if="isLoading" class="loading-spinner"></span>
                  <span v-else>{{ isSignup ? 'Create Account' : 'Sign In' }}</span>
                </button>

                <button type="button" class="back-button" @click="showEmailForm = false">
                  Back to Options
                </button>
              </form>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close', 'submit']);

const authStore = useAuthStore();
const router = useRouter();

// Form state
const showEmailForm = ref(false);
const isSignup = ref(false);
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const firstName = ref('');
const lastName = ref('');
const isMobile = ref(false);

// Computed properties
const isLoading = computed(() => authStore.isLoading);
const authError = computed(() => authStore.error);

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

const close = () => {
  emit('close');
  resetForm();
};

const resetForm = () => {
  showEmailForm.value = false;
  email.value = '';
  password.value = '';
  confirmPassword.value = '';
  firstName.value = '';
  lastName.value = '';
};

const toggleSignup = () => {
  isSignup.value = !isSignup.value;
};

const handleGoogleLogin = async () => {
  try {
    await authStore.loginWithGoogle();
    close();
  } catch (error) {
    console.error('Google login failed:', error);
  }
};

const handleGoogleAuth = () => {
  authStore.loginWithGoogle();
};

const handleEmailSubmit = async () => {
  if (isSignup.value) {
    // Register flow
    if (password.value !== confirmPassword.value) {
      authStore.error = "Passwords do not match!";
      return;
    }
    
    const userData = {
      email: email.value,
      password: password.value,
      first_name: firstName.value,
      last_name: lastName.value,
    };
    
    const result = await authStore.register(userData);
    
    if (result.success) {
      isSignup.value = false; // Switch to login after successful registration
      password.value = '';
      confirmPassword.value = '';
    }
  } else {
    // Login flow
    const result = await authStore.login(email.value, password.value);
    
    if (result.success) {
      close();
      router.push('/profile');
    }
  }
};
</script>

<style scoped>
.auth-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: var(--z-index-modal);
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
}

.auth-flyout {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 400px;
  height: 100vh;
  background-color: var(--color-surface);
  box-shadow: var(--shadow-lg);
  z-index: calc(var(--z-index-modal) + 1);
}

.auth-flyout.is-mobile {
  max-width: 100%;
}

.auth-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: var(--spacing-lg);
}

.close-button {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-primary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color var(--transition-base);
  width: 40px;
  height: 40px;
  padding: var(--spacing-xs);
  top: calc((var(--header-height) - 40px) / 2);
  right: var(--spacing-md);
  z-index: 10000;
  border-radius: var(--border-radius-lg);
}

.close-icon {
  width: 20px;
  height: 20px;
}

.auth-content {
  margin-top: var(--spacing-xl);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.auth-title {
  font-family: var(--font-family-display);
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
  text-align: center;
}

.auth-subtitle {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  text-align: center;
  margin: var(--spacing-sm) 0 var(--spacing-xl);
}

.sso-options {
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin: 0 auto;
}

.sso-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  width: 100%;
  height: 48px;
  padding: 0 var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
}

.sso-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.sso-button:disabled .sso-button-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.coming-soon-badge {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.google-sso:disabled {
  border-color: var(--color-border);
  background-color: var(--color-surface-hover);
}

.apple-sso:disabled {
  background: var(--color-surface);
  border-color: var(--color-border);
  color: var(--color-text-secondary);
}

.sso-icon {
  width: 24px;
  height: 24px;
}

.email-sso {
  background: var(--color-primary-600);
  color: var(--color-surface);
  border: none;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin: var(--spacing-sm) 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--color-border);
}

.divider span {
  margin: 0 var(--spacing-sm);
}

.auth-footer {
  text-align: center;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xl);
}

.text-button {
  background: transparent;
  border: none;
  color: var(--color-wine);
  font-weight: 500;
  cursor: pointer;
  padding: 0;
}

.text-button:not(:disabled):hover {
  text-decoration: underline;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

/* Mobile-specific styles */
@media (max-width: 768px) {
  .auth-flyout {
    max-width: 100%;
  }
  
  .auth-panel {
    padding: var(--spacing-md);
  }
  
  .auth-content {
    margin-top: calc(var(--header-height) + var(--spacing-md));
    padding: 0 var(--spacing-md);
  }

  .auth-title {
    font-size: var(--font-size-xl);
  }

  .auth-subtitle {
    font-size: var(--font-size-base);
    margin-bottom: var(--spacing-lg);
  }

  .form-input {
    font-size: var(--font-size-base);
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .submit-button {
    margin-top: var(--spacing-xl);
  }
}

.auth-error {
  background-color: var(--color-error-light);
  color: var(--color-error);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-sm);
  text-align: center;
}

.email-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-group label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.form-group input {
  height: 40px;
  padding: 0 var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
}

.submit-button {
  height: 48px;
  background-color: var(--color-wine);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-button:hover {
  background-color: var(--color-wine-dark);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.back-button {
  margin-top: var(--spacing-sm);
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  font-size: var(--font-size-sm);
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
</style> 