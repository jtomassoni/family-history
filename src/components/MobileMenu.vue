<template>
  <transition name="slide-down">
    <div v-if="isOpen" class="mobile-menu">
      <!-- Close button in same position as hamburger -->
      <button class="close-button" @click="closeMenu" aria-label="Close menu">
        <svg class="close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- Main menu content -->
      <div class="mobile-menu-content" :class="{ 
        'flipped': showAuth, 
        'flipped-email': showEmailAuth,
        'flipped-signup': showSignup 
      }">
        <!-- Front (Menu) -->
        <div class="menu-side menu-front">
          <!-- Site Title -->
          <router-link to="/" class="mobile-title" @click="closeMenu">
            <h1 class="site-title">
              <span class="site-name">Tomassoni</span>
              <span class="site-subtitle">Family History</span>
            </h1>
          </router-link>

          <!-- Mobile Navigation -->
          <nav class="mobile-nav">
            <ul class="menu-list">
              <li v-for="item in navItems" :key="item.path" class="menu-item">
                <router-link 
                  :to="item.path" 
                  :class="{ current: isCurrentRoute(item.path) }"
                  class="menu-link"
                  @click="closeMenu"
                >
                  {{ item.label }}
                </router-link>
              </li>
            </ul>
          </nav>

          <!-- Bottom Section Wrapper -->
          <div class="mobile-menu-bottom">
            <!-- Login Button -->
            <div class="mobile-auth-section">
              <button class="mobile-auth-button" @click="toggleAuth">
                <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M10 17l5-5-5-5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M15 12H3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Login</span>
              </button>
            </div>

            <!-- Footer -->
            <footer class="mobile-footer">
              <div class="footer-content">
                <p class="footer-text">© {{ new Date().getFullYear() }} Tomassoni Family History</p>
              </div>
            </footer>
          </div>
        </div>

        <!-- Back (Auth Options) -->
        <div class="menu-side menu-auth">
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

            <button class="sso-button email-sso" @click="showEmailForm">
              <svg class="sso-icon" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
              </svg>
              Continue with Email
            </button>

            <p class="auth-footer">
              Don't have an account? 
              <button class="text-button" @click="showSignupForm">Sign up</button>
            </p>
          </div>
        </div>

        <!-- Email Login Form -->
        <div class="menu-side menu-email">
          <h2 class="auth-title">Welcome Back</h2>
          <p class="auth-subtitle">Sign in to your account</p>

          <form class="auth-form" @submit.prevent="handleEmailSubmit">
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

            <button type="button" class="text-button forgot-password">
              Forgot password?
            </button>
          </form>
        </div>

        <!-- Sign Up Form -->
        <div class="menu-side menu-signup">
          <h2 class="auth-title">Create Account</h2>
          <p class="auth-subtitle">Join the Tomassoni family network</p>

          <form class="auth-form" @submit.prevent="handleSignupSubmit">
            <div class="form-group">
              <label for="signup-name" class="form-label">Full Name</label>
              <input 
                type="text" 
                id="signup-name" 
                v-model="signupName" 
                class="form-input"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div class="form-group">
              <label for="signup-email" class="form-label">Email</label>
              <input 
                type="email" 
                id="signup-email" 
                v-model="signupEmail" 
                class="form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div class="form-group">
              <label for="signup-password" class="form-label">Password</label>
              <input 
                type="password" 
                id="signup-password" 
                v-model="signupPassword" 
                class="form-input"
                placeholder="Create a password"
                required
              />
            </div>

            <button type="submit" class="submit-button">
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue';
import { useNavigation } from '../composables/useNavigation';

const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close', 'auth']);

const { navItems, isCurrentRoute } = useNavigation();
const showAuth = ref(false);
const showEmailAuth = ref(false);
const showSignup = ref(false);

const closeMenu = () => {
  showAuth.value = false;
  showEmailAuth.value = false;
  showSignup.value = false;
  emit('close');
};

const toggleAuth = () => {
  showAuth.value = true;
  showEmailAuth.value = false;
  showSignup.value = false;
};

const handleSSOLogin = (provider) => {
  emit('auth', { type: 'sso', provider });
  closeMenu();
};

const showEmailForm = () => {
  showEmailAuth.value = true;
  showSignup.value = false;
};

const showSignupForm = () => {
  showSignup.value = true;
  showEmailAuth.value = false;
};

const handleEmailSubmit = () => {
  // Handle email submission
};

const handleSignupSubmit = () => {
  // Handle signup submission
};
</script>

<style scoped>
.mobile-menu {
  position: fixed;
  inset: 0;
  background-color: var(--color-surface);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 9999;
  padding: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border: none;
  overflow-y: auto;
  overflow-x: hidden;
  transform: translateY(0);
}

/* Fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Add slide down animation */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
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
  width: 48px;
  height: 48px;
  padding: var(--spacing-sm);
  top: calc((var(--header-height) - 48px) / 2);
  right: var(--spacing-md);
  z-index: 10000;
  border-radius: var(--border-radius-lg);
  -webkit-tap-highlight-color: transparent;
}

.close-button:active {
  background-color: var(--color-surface-hover);
}

.close-icon {
  width: 24px;
  height: 24px;
}

.mobile-title {
  text-decoration: none;
  margin: 0;
  position: absolute;
  top: calc((var(--header-height) - 60px) / 2);
  left: 50%;
  transform: translateX(-50%);
  width: auto;
  z-index: 10000;
}

.site-title {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.site-name {
  display: inline-block;
  font-family: var(--font-family-display);
  font-size: calc(var(--font-size-xl) * 1.5);
  font-weight: 800;
  color: var(--color-text-primary);
  letter-spacing: 0.05em;
  line-height: 1;
  position: relative;
  text-transform: uppercase;
  padding-bottom: var(--spacing-xs);
}

.site-name::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--color-primary-600);
  border-radius: var(--border-radius-full);
}

.site-subtitle {
  display: block;
  font-family: var(--font-family-display);
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--color-text-secondary);
  letter-spacing: 0.02em;
  white-space: nowrap;
  margin-top: var(--spacing-xs);
}

.mobile-nav {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  min-height: 0;
}

.menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
}

.menu-item {
  width: 100%;
  text-align: center;
}

.menu-link {
  display: block;
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  padding: var(--spacing-xs) var(--spacing-lg);
  color: var(--color-text-secondary);
  font-size: var(--font-size-xl);
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-base);
  text-align: center;
  position: relative;
}

.menu-link:hover {
  color: var(--color-text-primary);
  background-color: var(--color-surface-hover);
}

.menu-link.current {
  color: var(--color-text-secondary);
  font-weight: 600;
  position: relative;
}

.menu-link.current::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 60px;
  background: radial-gradient(
    circle at center,
    #b32d00 0%,
    rgba(179, 45, 0, 0.4) 30%,
    rgba(179, 45, 0, 0.1) 60%,
    transparent 80%
  );
  filter: blur(15px);
  pointer-events: none;
  z-index: -1;
}

/* Background effect behind text */
.menu-link.current::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at center,
    rgba(var(--color-primary-rgb), 0.15) 0%,
    rgba(var(--color-primary-rgb), 0.08) 50%,
    transparent 100%
  );
  pointer-events: none;
}

/* Create a wrapper for the bottom content */
.mobile-menu-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  margin: 0;
  padding: 0;
  background: none;
  width: 100%;
  max-width: 320px;
}

.mobile-auth-section {
  margin: 0;
  padding: 0;
  width: 100%;
  background: none;
}

.mobile-auth-button {
  margin: 0;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700));
  color: var(--color-surface);
  font-size: var(--font-size-base);
  font-weight: 600;
  border: none;
  border-radius: var(--border-radius-full);
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
}

.mobile-auth-button:hover {
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
  box-shadow: var(--shadow-md);
}

.mobile-auth-button:active {
  background: linear-gradient(135deg, var(--color-primary-700), var(--color-primary-800));
  box-shadow: var(--shadow-sm);
}

.mobile-auth-button .button-icon {
  width: 20px;
  height: 20px;
}

.mobile-footer {
  margin: 0;
  padding: var(--spacing-xs) 0 0;
  width: 100%;
  background: none;
}

.footer-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
}

.footer-text {
  color: var(--color-text-secondary);
  margin: 0;
  white-space: nowrap;
  font-size: 8px;
}

.mobile-menu-content {
  position: relative;
  width: 100%;
  max-width: 400px;
  height: 100%;
  margin: 0 auto;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menu-side {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  backface-visibility: hidden;
  background-color: var(--color-surface);
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  padding: calc(var(--header-height) + var(--spacing-lg)) 0 var(--spacing-lg);
}

/* Step 1: Main Menu (Front) */
.menu-front {
  transform: rotateY(0deg);
}

/* Step 2: Auth Options (Back) */
.menu-auth {
  transform: rotateY(180deg);
}

/* Step 3a: Email Login */
.menu-email {
  transform: rotateY(360deg);
  opacity: 0;
  pointer-events: none;
}

/* Step 3b: Sign Up */
.menu-signup {
  transform: rotateY(360deg);
  opacity: 0;
  pointer-events: none;
}

/* Flipped States */
.mobile-menu-content.flipped {
  transform: rotateY(180deg);
}

/* Email Form Active */
.mobile-menu-content.flipped-email {
  transform: rotateY(360deg);
}

.mobile-menu-content.flipped-email .menu-auth {
  opacity: 0;
  pointer-events: none;
}

.mobile-menu-content.flipped-email .menu-email {
  opacity: 1;
  pointer-events: auto;
  transform: rotateY(360deg);
}

/* Signup Form Active */
.mobile-menu-content.flipped-signup {
  transform: rotateY(360deg);
}

.mobile-menu-content.flipped-signup .menu-auth {
  opacity: 0;
  pointer-events: none;
}

.mobile-menu-content.flipped-signup .menu-signup {
  opacity: 1;
  pointer-events: auto;
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

.text-button:hover {
  text-decoration: underline;
}

.back-button,
.back-button:active,
.back-icon {
  display: none;
}

.auth-form {
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  align-items: center;
}

.form-group {
  width: 100%;
  max-width: 320px;
}

.form-label {
  display: block;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text-primary);
  font-weight: 500;
  font-size: var(--font-size-sm);
}

.form-input {
  width: 100%;
  height: 48px;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  background: var(--color-surface);
  transition: all var(--transition-base);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 2px var(--color-primary-100);
}

.submit-button {
  width: 100%;
  padding: var(--spacing-md);
  background: var(--color-primary-600);
  color: var(--color-surface);
  border: none;
  border-radius: var(--border-radius-full);
  cursor: pointer;
  font-size: var(--font-size-base);
  font-weight: 600;
  transition: all var(--transition-base);
}

.submit-button:hover {
  background: var(--color-primary-500);
}

.forgot-password {
  background: none;
  border: none;
  color: var(--color-primary-600);
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  font-size: inherit;
}

.forgot-password:hover {
  text-decoration: underline;
}
</style>