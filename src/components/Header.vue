<template>
  <header class="header">
    <div class="header-content">
      <!-- Help Button (Mobile) -->
      <button class="help-button mobile-help" :class="{ active: isHelpActive }" @click="$emit('help')" aria-label="Help">
        <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 17v.01" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- Logo/Site Title -->
      <router-link to="/" class="site-title">
        <h1 class="title">
          <span class="site-name">{{ siteTitle }}</span>
          <span class="site-subtitle">Family History</span>
        </h1>
      </router-link>

      <!-- Desktop Navigation -->
      <nav class="desktop-nav">
        <ul class="nav-list">
          <li v-for="item in navItems" :key="item.path" class="nav-item">
            <router-link 
              :to="item.path" 
              :class="{ 'current': isCurrentRoute(item.path) }"
              class="nav-link"
            >
              {{ item.label }}
              <span class="nav-indicator"></span>
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- Header Right Section -->
      <div class="header-right">
        <!-- Help Button (Desktop) -->
        <button class="help-button" :class="{ active: isHelpActive }" @click="$emit('help')" aria-label="Help">
          <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 17v.01" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <!-- Profile/Auth Button -->
        <router-link v-if="isLoggedIn" to="/profile" class="profile-button" aria-label="Profile">
          <div v-if="user?.avatar" class="avatar-mini">
            <img :src="user.avatar" alt="Profile" />
          </div>
          <div v-else class="avatar-mini" :class="{ 'admin-avatar': isAdmin }">
            <span class="avatar-initials">{{ isAdmin ? 'A' : userInitials }}</span>
            <span v-if="isAdmin" class="admin-indicator"></span>
          </div>
        </router-link>
        
        <!-- Login Button (when not logged in) -->
        <button v-else class="auth-button" @click="$emit('auth')" aria-label="Login">
          <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10 17l5-5-5-5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15 12H3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- Mobile Menu Toggle -->
      <button class="mobile-menu-toggle" @click="$emit('toggle-mobile-menu')" aria-label="Toggle menu">
        <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6" stroke-linecap="round"/>
          <line x1="3" y1="12" x2="21" y2="12" stroke-linecap="round"/>
          <line x1="3" y1="18" x2="21" y2="18" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useNavigation } from '../composables/useNavigation';
import { useAuthStore } from '../stores/auth';
import { computed, onMounted } from 'vue';

const route = useRoute();
const { navItems, isCurrentRoute } = useNavigation();
const authStore = useAuthStore();
const siteTitle = 'TOMASSONI';

// Initialize auth store
onMounted(() => {
  authStore.initializeFromStorage();
  authStore.setAuthHeaders();
});

// Check if user is logged in
const isLoggedIn = computed(() => !!authStore.user);
const user = computed(() => authStore.user || {});
const isAdmin = computed(() => authStore.isAdmin);

// Get user initials for avatar
const userInitials = computed(() => {
  if (!user.value?.full_name) return '?';
  return user.value.full_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
});

defineProps({
  isHelpActive: {
    type: Boolean,
    default: false
  }
});

defineEmits(['toggle-mobile-menu', 'auth', 'help']);
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background-color: var(--color-surface);
  z-index: var(--z-index-header);
  display: flex;
  flex-direction: column;
}

.header-content {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 0 var(--spacing-md);
  max-width: var(--max-width);
  margin: 0 auto;
}

.site-title {
  text-decoration: none;
  display: flex;
  align-items: center;
}

.title {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.site-name {
  font-family: var(--font-family-display);
  font-size: 32px;
  font-weight: 800;
  color: var(--color-text-primary);
  letter-spacing: 0.05em;
  line-height: 1;
  position: relative;
  text-transform: uppercase;
  padding-bottom: 6px;
  margin-bottom: 2px;
}

.site-name::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #dc2626;
  border-radius: var(--border-radius-full);
}

.site-subtitle {
  font-family: var(--font-family-display);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
  letter-spacing: 0.02em;
  white-space: nowrap;
  line-height: 1;
}

.desktop-nav {
  display: flex;
  align-items: center;
  justify-self: end;
  height: 100%;
  margin-right: 0;
}

.nav-item {
  height: 100%;
  display: flex;
  align-items: center;
  margin-left: var(--spacing-sm);
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: flex-end;
}

.nav-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2xs);
  padding: 0 var(--spacing-2xs);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-base);
  height: 100%;
  justify-content: center;
}

.nav-link:hover {
  color: var(--color-text-primary);
}

.nav-link.current {
  color: var(--color-primary-700);
}

.nav-indicator {
  width: 16px;
  height: 2px;
  background-color: var(--color-primary-600);
  border-radius: var(--border-radius-full);
  transform: scaleX(0);
  transition: transform var(--transition-base);
}

.nav-link:hover .nav-indicator,
.nav-link.current .nav-indicator {
  transform: scaleX(1);
}

/* Common button styles */
.help-button,
.auth-button,
.mobile-menu-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  margin: 0;
  color: var(--color-text-secondary);
  transition: all var(--transition-base);
}

.button-icon {
  width: 24px;
  height: 24px;
  fill: none;
  stroke: currentColor;
  margin: auto;
}

.help-button:hover,
.auth-button:hover,
.mobile-menu-toggle:hover {
  color: var(--color-text-primary);
}

.help-button.active,
.mobile-help.active {
  color: var(--color-primary-500) !important;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: var(--border-radius-md);
}

.help-button.active .button-icon,
.mobile-help.active .button-icon {
  fill: none !important;
  stroke: var(--color-primary-500) !important;
}

/* Mobile styles */
@media (max-width: 768px) {
  .header {
    height: 60px;
    background-color: #2f201d;
  }

  .header-content {
    padding: 0 var(--spacing-sm);
    grid-template-columns: 40px 1fr 40px;
    gap: 0;
  }

  .site-title {
    justify-self: center;
    grid-column: 2;
    text-align: center;
  }

  .title {
    align-items: center;
  }

  .mobile-help {
    grid-column: 1;
    color: var(--color-text-secondary);
    margin-left: 4px;
  }

  .mobile-menu-toggle {
    grid-column: 3;
    color: var(--color-text-secondary);
    position: absolute;
    top: calc((var(--header-height) - 48px) / 2 + 6px);
    right: calc(var(--spacing-md) + 2px);
  }

  .mobile-help:hover,
  .mobile-menu-toggle:hover {
    color: var(--color-text-primary);
  }

  .site-name {
    font-size: 32px;
    color: #fff;
    padding-bottom: 4px;
  }

  .site-subtitle {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    margin-top: 2px;
  }

  .desktop-nav,
  .header-right {
    display: none;
  }
}

/* Desktop styles */
@media (min-width: 768px) {
  .header-content {
    grid-template-columns: auto 1fr auto;
  }

  .desktop-nav {
    grid-column: 2;
    justify-self: end;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .header-right {
    grid-column: 3;
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .mobile-menu-toggle,
  .mobile-help {
    display: none;
  }

  .help-button {
    color: var(--color-text-secondary);
  }

  .help-button:hover {
    color: var(--color-text-primary);
  }

  .help-button.active {
    color: var(--color-primary-500) !important;
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: var(--border-radius-md);
  }
}

/* Profile button styles */
.profile-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  margin: 0;
  transition: all var(--transition-base);
  border-radius: 50%;
  overflow: hidden;
  text-decoration: none;
}

.avatar-mini {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  background-color: var(--color-wine);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.admin-avatar {
  background: linear-gradient(135deg, var(--color-wine), #ff6b00);
  box-shadow: 0 0 8px rgba(255, 107, 0, 0.5);
}

.admin-indicator {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  background-color: #ffcc00;
  border-radius: 50%;
  border: 2px solid var(--color-surface);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
}

.avatar-mini img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.profile-button:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
</style>
