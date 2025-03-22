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
              <p class="auth-subtitle">Sign in to your account</p>

              <form @submit.prevent="handleSubmit" class="auth-form">
                <div class="form-group">
                  <label for="email" class="form-label">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    v-model="email" 
                    class="form-input" 
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="password" class="form-label">Password</label>
                  <input 
                    type="password" 
                    id="password" 
                    v-model="password" 
                    class="form-input" 
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <button type="submit" class="submit-button">
                  Sign In
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

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-primary);
}

.form-input {
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  background-color: var(--color-surface);
  transition: all var(--transition-base);
  height: 48px;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 2px var(--color-primary-100);
}

.submit-button {
  width: 100%;
  height: 48px;
  padding: var(--spacing-md);
  background: linear-gradient(to right, var(--color-primary-600), var(--color-primary-700));
  color: var(--color-surface);
  font-size: var(--font-size-base);
  font-weight: 600;
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  margin-top: var(--spacing-lg);
}

.submit-button:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.submit-button:active {
  transform: translateY(0);
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