<template>
  <header class="site-header">
    <!-- Left Section -->
    <div class="header-left">
      <CustomButton
        v-if="isMobile"
        variant="text"
        size="sm"
        class="hamburger-button"
        @click="$emit('toggle-menu')"
        :aria-label="isMenuOpen ? 'Close menu' : 'Open menu'"
      >
        <component :is="isMenuOpen ? XMarkIcon : Bars3Icon" class="hamburger-icon" />
      </CustomButton>

      <nav class="desktop-nav" v-if="!isMobile">
        <ul class="nav-list">
          <li v-for="item in navItems" :key="item.path" class="nav-item">
            <router-link :to="item.path" :class="{ current: isCurrentRoute(item.path) }">
              {{ item.label }}
            </router-link>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Middle Section -->
    <div class="site-title-container">
      <router-link to="/" class="site-name">{{ siteName }}</router-link>
      <span class="site-subtitle">{{ siteSubtitle }}</span>
    </div>

    <!-- Right Section -->
    <div class="header-right">
      <CustomButton
        variant="secondary"
        size="sm"
        class="help-button"
        @click="$emit('show-help')"
      >
        <QuestionMarkCircleIcon class="button-icon" />
        <span class="button-label">Help</span>
      </CustomButton>

      <div class="login-container">
        <CustomButton
          variant="primary"
          size="sm"
          class="login-button"
          :disabled="isLoading"
          :loading="isLoading"
          @click="handleAuthClick"
        >
          <component :is="isAuthenticated ? UserIcon : UserPlusIcon" class="button-icon" />
          <span class="button-label">{{ isAuthenticated ? 'Profile' : 'Login' }}</span>
        </CustomButton>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { Bars3Icon, XMarkIcon, QuestionMarkCircleIcon, UserIcon, UserPlusIcon } from '@heroicons/vue/24/solid';
import CustomButton from '../buttons/CustomButton.vue';

const props = defineProps({
  siteName: {
    type: String,
    required: true
  },
  siteSubtitle: {
    type: String,
    default: ''
  },
  isAuthenticated: {
    type: Boolean,
    default: false
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  isMenuOpen: {
    type: Boolean,
    default: false
  }
});

const route = useRoute();
const isMobile = ref(window.innerWidth < 768);

// Navigation items
const navItems = [
  { path: '/', label: 'Home' },
  { path: '/family-tree', label: 'Family Tree' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/stories', label: 'Stories' },
  { path: '/about', label: 'About' },
];

// Check if current route matches nav item
const isCurrentRoute = (path) => {
  return route.path === path;
};

// Handle auth button click
const handleAuthClick = () => {
  emit('auth-click');
};

// Handle window resize
const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
};

// Emit events
const emit = defineEmits(['toggle-menu', 'show-help', 'auth-click']);

// Add resize listener
window.addEventListener('resize', handleResize);
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background: var(--header-bg);
  color: var(--header-text);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-xs) var(--spacing-md);
  z-index: var(--z-index-fixed);
}

/* Left Section */
.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.hamburger-icon {
  width: var(--font-size-lg);
  height: var(--font-size-lg);
  color: var(--header-text);
}

/* Navigation */
.nav-list {
  display: flex;
  gap: var(--spacing-md);
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item a {
  position: relative;
  color: var(--nav-link-color);
  text-decoration: none;
  font-size: var(--font-size-base);
  transition: color var(--transition-fast);
}

.nav-item a::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -3px;
  height: var(--border-width-thick);
  background-color: var(--nav-link-color);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.nav-item a.current::after {
  opacity: 1;
}

.nav-item a:hover {
  color: var(--nav-link-hover-color);
}

/* Middle Section */
.site-title-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.site-name {
  color: var(--header-text);
  text-decoration: none;
  font-size: var(--font-size-lg);
  font-weight: bold;
  line-height: var(--line-height-tight);
}

.site-subtitle {
  font-size: var(--font-size-xs);
  line-height: var(--line-height-tight);
  opacity: 0.8;
}

/* Right Section */
.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

/* Button Icons */
.button-icon {
  width: var(--font-size-base);
  height: var(--font-size-base);
}

/* Mobile Responsiveness */
@media (max-width: var(--breakpoint-md)) {
  .site-header {
    padding: var(--spacing-xs);
  }

  .site-name {
    font-size: var(--font-size-base);
  }

  .button-label {
    display: none;
  }

  .button-icon {
    margin: 0;
  }
}
</style> 