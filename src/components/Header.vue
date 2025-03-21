<template>
  <header class="site-header">
    <!-- LEFT: Hamburger + Desktop Nav -->
    <div class="header-left">
      <button class="hamburger-button" @click="toggleMobileMenu" aria-label="Toggle menu">
        <svg class="hamburger-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      
      <nav class="desktop-nav">
        <ul class="nav-list">
          <li v-for="item in navItems" :key="item.path" class="nav-item">
            <router-link 
              :to="item.path" 
              :class="{ current: route.path === item.path }"
              class="nav-link"
            >
              {{ item.label }}
            </router-link>
          </li>
        </ul>
      </nav>
    </div>

    <!-- MIDDLE: Site Title -->
    <div class="site-title-container">
      <router-link to="/" class="site-title-link">
        <h1 class="site-title">
          <span class="site-name">TOMASSONI</span>
          <span class="site-subtitle">Family History</span>
        </h1>
      </router-link>
    </div>

    <!-- RIGHT: Help button (Gallery only) + Login button -->
    <div class="header-right">
      <button
        v-if="route.path === '/gallery'"
        class="help-button"
        @click="openHelp"
      >
        <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 17h.01" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="button-label">Help</span>
      </button>

      <button
        class="login-button"
        @click="openAuth"
      >
        <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M10 17l5-5-5-5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M15 12H3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="button-label">Login</span>
      </button>
    </div>

    <!-- Auth Flyout -->
    <AuthFlyout
      :is-open="isAuthOpen"
      @close="closeAuth"
      @submit="handleAuthSubmit"
    />
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import AuthFlyout from './auth/AuthFlyout.vue';

const emit = defineEmits(['help', 'toggle-mobile-menu']);
const route = useRoute();
const isLoggedIn = ref(false);
const isAuthOpen = ref(false);

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/stories', label: 'Stories' },
  { path: '/family-tree', label: 'Family Tree' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' }
];

const openHelp = () => emit('help');
const toggleMobileMenu = () => emit('toggle-mobile-menu');
const openAuth = () => isAuthOpen.value = true;
const closeAuth = () => isAuthOpen.value = false;

const handleAuthSubmit = async (credentials) => {
  // TODO: Implement actual authentication
  console.log('Auth submitted:', credentials);
  closeAuth();
};
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: var(--z-index-header);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  padding: 0 var(--spacing-lg);
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

/* Left Section */
.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  width: 320px;
}

.hamburger-button {
  display: none;
  padding: var(--spacing-sm);
  color: var(--color-text-primary);
  background: transparent;
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
}

.hamburger-button:hover {
  color: var(--color-primary-600);
}

.hamburger-icon {
  width: 24px;
  height: 24px;
}

.nav-list {
  display: flex;
  gap: var(--spacing-xs);
  list-style: none;
  margin: 0;
  padding: 0;
  flex-wrap: nowrap;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  font-weight: 500;
  text-decoration: none;
  border-radius: var(--border-radius-full);
  transition: all var(--transition-base);
  white-space: nowrap;
  position: relative;
}

.nav-link:hover {
  color: var(--color-text-primary);
  background-color: var(--color-surface-hover);
}

.nav-link.current {
  color: var(--color-primary-700);
  font-weight: 600;
  background-color: var(--color-primary-50);
}

/* Remove these hover-related styles */
.nav-link.current::after,
.nav-link.current:hover::after {
  display: none;
}

/* Middle Section */
.site-title-container {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0;
}

.site-title-link {
  text-decoration: none;
  transition: opacity var(--transition-base);
}

.site-title-link:hover {
  opacity: 0.9;
}

.site-title {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.site-name {
  display: block;
  font-family: var(--font-family-display);
  font-size: var(--font-size-3xl);
  font-weight: 800;
  color: var(--color-text-primary);
  letter-spacing: 0.05em;
  line-height: 1;
  position: relative;
}

.site-name::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 40%;
  height: 2px;
  background-color: var(--color-primary-600);
  border-radius: var(--border-radius-full);
}

.site-subtitle {
  display: block;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
  font-weight: 500;
  color: var(--color-text-secondary);
  letter-spacing: 0.02em;
}

/* Right Section */
.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  width: 320px;
  justify-content: flex-end;
}

.help-button,
.login-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  height: 40px;
  padding: 0 var(--spacing-lg);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
}

.login-button {
  background-color: var(--color-primary-600);
  color: var(--color-surface);
  border: none;
}

.help-button:hover {
  border-color: var(--color-primary-400);
  background-color: var(--color-surface-hover);
}

.login-button:hover {
  background-color: var(--color-primary-700);
}

.button-icon {
  width: 18px;
  height: 18px;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .site-header {
    padding: 0 var(--spacing-md);
  }

  .hamburger-button {
    display: flex;
  }

  .desktop-nav {
    display: none;
  }

  .site-title {
    gap: var(--spacing-sm);
  }

  .site-name {
    font-size: var(--font-size-2xl);
  }

  .site-subtitle {
    font-size: var(--font-size-base);
  }

  .button-label {
    display: none;
  }

  .help-button,
  .login-button {
    width: 40px;
    padding: 0;
  }
}

/* Tablet Styles */
@media (min-width: 769px) and (max-width: 1024px) {
  .header-left,
  .header-right {
    width: 280px;
  }

  .nav-list {
    gap: var(--spacing-2xs);
  }
  
  .nav-link {
    padding: var(--spacing-2xs) var(--spacing-xs);
    font-size: var(--font-size-2xs);
  }
}

/* High Contrast Mode */
@media (forced-colors: active) {
  .site-header {
    border-bottom: 2px solid CanvasText;
  }

  .nav-link.current {
    border: 2px solid CanvasText;
  }

  .help-button,
  .login-button {
    border: 2px solid CanvasText;
  }
}
</style>
