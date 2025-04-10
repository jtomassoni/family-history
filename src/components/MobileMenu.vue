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
            <!-- Login/Profile Button -->
            <div class="mobile-auth-section">
              <router-link v-if="isAuthenticated" to="/profile" class="mobile-profile-button" @click="closeMenu">
                <div v-if="user?.avatar" class="avatar-mini">
                  <img :src="user.avatar" alt="Profile" />
                </div>
                <div v-else class="avatar-mini" :class="{ 'admin-avatar': isAdmin }">
                  <span class="avatar-initials">{{ isAdmin ? 'A' : userInitials }}</span>
                  <span v-if="isAdmin" class="admin-indicator"></span>
                </div>
                <span>{{ isAdmin ? 'Admin Dashboard' : 'My Profile' }}</span>
              </router-link>
              <button v-else class="mobile-auth-button" @click="toggleAuth">
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
            <button class="sso-button google-sso" @click="handleGoogleLogin" disabled title="Coming soon">
              <svg class="sso-icon" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
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
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useNavigation } from '../composables/useNavigation';
import { useAuthStore } from '../stores/auth';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close', 'auth']);

const route = useRoute();
const { navItems, isCurrentRoute } = useNavigation();
const authStore = useAuthStore();

// Auth state
const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.user || {});
const isAdmin = computed(() => authStore.isAdmin);

// Form state
const showAuth = ref(false);
const showEmailAuth = ref(false);
const showSignup = ref(false);

// Form data
const email = ref('');
const password = ref('');
const signupName = ref('');
const signupEmail = ref('');
const signupPassword = ref('');

// Get user initials for avatar
const userInitials = computed(() => {
  if (!user.value?.full_name) return '?';
  return user.value.full_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
});

const closeMenu = () => {
  emit('close');
  // Reset form states
  showAuth.value = false;
  showEmailAuth.value = false;
  showSignup.value = false;
  // Clear form data
  email.value = '';
  password.value = '';
  signupName.value = '';
  signupEmail.value = '';
  signupPassword.value = '';
};

const toggleAuth = () => {
  emit('auth');
  showAuth.value = true;
};

const handleGoogleLogin = () => {
  // TODO: Implement Google login
  console.log('Google login clicked');
};

const showEmailForm = () => {
  emit('auth');
  showAuth.value = false;
  showEmailAuth.value = true;
};

const showSignupForm = () => {
  emit('auth');
  showAuth.value = false;
  showSignup.value = true;
};

const handleEmailSubmit = async () => {
  try {
    const result = await authStore.login(email.value, password.value);
    if (result.success) {
      closeMenu();
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};

const handleSignupSubmit = async () => {
  try {
    const names = signupName.value.split(' ');
    const firstName = names[0];
    const lastName = names.length > 1 ? names.slice(1).join(' ') : '';
    
    const userData = {
      email: signupEmail.value,
      password: signupPassword.value,
      first_name: firstName,
      last_name: lastName
    };
    
    const result = await authStore.register(userData);
    if (result.success) {
      // Show success and switch to login
      showSignup.value = false;
      showEmailAuth.value = true;
    }
  } catch (error) {
    console.error('Signup error:', error);
  }
};
</script>

<style scoped>
.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--color-surface);
  z-index: var(--z-index-modal);
  overflow-y: auto;
}

.close-button {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-sm);
  z-index: 1;
}

.close-icon {
  width: 24px;
  height: 24px;
  stroke: var(--color-text-primary);
}

.mobile-menu-content {
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.menu-side {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
}

.menu-front {
  transform: rotateY(0deg);
}

.menu-auth {
  transform: rotateY(180deg);
}

.flipped .menu-front {
  transform: rotateY(180deg);
}

.flipped .menu-auth {
  transform: rotateY(360deg);
}

.mobile-title {
  text-decoration: none;
  margin-bottom: var(--spacing-xl);
}

.site-title {
  font-family: var(--font-family-display);
  font-size: var(--font-size-2xl);
  color: var(--color-text-primary);
  margin: 0;
  text-align: center;
}

.site-name {
  display: block;
  font-weight: 700;
}

.site-subtitle {
  display: block;
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  margin-top: var(--spacing-xs);
}

.mobile-nav {
  flex: 1;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  margin-bottom: var(--spacing-md);
}

.menu-link {
  display: block;
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--color-text-primary);
  text-decoration: none;
  font-size: var(--font-size-lg);
  border-radius: var(--border-radius-md);
  transition: background-color var(--transition-base);
}

.menu-link:hover,
.menu-link.current {
  background-color: var(--color-surface-hover);
}

.mobile-menu-bottom {
  margin-top: auto;
  padding-top: var(--spacing-xl);
}

.mobile-auth-section {
  margin-bottom: var(--spacing-lg);
}

.mobile-profile-button,
.mobile-auth-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  cursor: pointer;
  transition: all var(--transition-base);
}

.mobile-profile-button:hover,
.mobile-auth-button:hover {
  background: var(--color-surface-hover);
}

.button-icon {
  width: 20px;
  height: 20px;
}

.avatar-mini {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--color-primary-600);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  position: relative;
}

.avatar-mini img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.admin-avatar {
  background-color: var(--color-wine);
}

.admin-indicator {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  background-color: var(--color-wine);
  border: 2px solid var(--color-surface);
  border-radius: 50%;
}

.mobile-footer {
  text-align: center;
  padding: var(--spacing-md) 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.auth-title {
  font-family: var(--font-family-display);
  font-size: var(--font-size-2xl);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm);
  text-align: center;
}

.auth-subtitle {
  color: var(--color-text-secondary);
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.sso-options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.sso-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  cursor: pointer;
  transition: all var(--transition-base);
}

.sso-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.sso-icon {
  width: 24px;
  height: 24px;
}

.google-sso {
  background: #f7f7f7;
  border-color: #dddddd;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.google-sso:hover {
  background: #ffffff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

.google-sso:active {
  background: #f1f1f1;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.google-sso::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, #4285F4, #34A853, #FBBC05, #EA4335);
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

/* Transitions */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

@media (max-width: 768px) {
  .mobile-menu {
    padding-top: var(--header-height);
  }
  
  .close-button {
    top: calc(var(--header-height) + var(--spacing-md));
  }
}
</style>