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
              <h2 class="auth-title">Welcome Back</h2>
              <p class="auth-subtitle">Choose how you'd like to continue</p>

              <!-- SSO Options -->
              <div class="sso-options">
                <button class="sso-button google-sso" disabled title="Coming soon">
                  <svg class="sso-icon" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <div class="sso-button-content">
                    <span>Continue with Google</span>
                    <span class="coming-soon-badge">Coming Soon</span>
                  </div>
                </button>

                <button class="sso-button apple-sso" disabled title="Coming soon">
                  <svg class="sso-icon" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.94-3.08.47-1.08-.48-2.07-.48-3.23 0-1.45.64-2.21.55-3.08-.47C2.79 14.6 3.51 6.12 9.05 5.81c1.35.07 2.29.74 3.08.74.75 0 2.21-.91 3.73-.78 1.35.11 2.57.73 3.23 1.84-3.03 1.77-2.52 5.88.47 6.86-.47 1.48-1.06 2.96-2.51 4.81M12.94 5.67C12.7 3.96 14.12 2.5 15.84 2c.35 1.63-.59 3.29-2.9 3.67" fill="currentColor"/>
                  </svg>
                  <div class="sso-button-content">
                    <span>Continue with Apple</span>
                    <span class="coming-soon-badge">Coming Soon</span>
                  </div>
                </button>

                <div class="divider">
                  <span>or</span>
                </div>

                <button class="sso-button email-sso" disabled title="Coming soon">
                  <svg class="sso-icon" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
                  </svg>
                  <div class="sso-button-content">
                    <span>Continue with Email</span>
                    <span class="coming-soon-badge">Coming Soon</span>
                  </div>
                </button>

                <p class="auth-footer">
                  Don't have an account? 
                  <button class="text-button" disabled>Sign up</button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close', 'submit']);

const email = ref('');
const password = ref('');
const isMobile = ref(false);

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
};

const handleSubmit = () => {
  emit('submit', {
    email: email.value,
    password: password.value
  });
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
  background: none;
  border: none;
  color: var(--color-primary-600);
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  font-size: inherit;
}

.text-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
</style> 