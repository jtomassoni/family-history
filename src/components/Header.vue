<template>
  <header class="header">
    <div class="header-content">
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

      <!-- Desktop Auth Button -->
      <button class="auth-button" @click="$emit('auth')" aria-label="Login">
        <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M10 17l5-5-5-5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M15 12H3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- Mobile Menu Toggle -->
      <button class="mobile-menu-toggle" @click="$emit('toggle-mobile-menu')" aria-label="Toggle menu">
        <svg class="menu-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useNavigation } from '../composables/useNavigation';

const route = useRoute();
const { navItems, isCurrentRoute } = useNavigation();
const siteTitle = 'TOMASSONI';

defineEmits(['toggle-mobile-menu', 'auth']);
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
  gap: var(--spacing-lg);
  padding: 0 var(--spacing-lg);
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
  transition: color var(--transition-base);
  height: 100%;
  justify-content: center;
}

.nav-link:hover {
  color: var(--color-text-primary);
}

.nav-link.current {
  color: var(--color-primary-700);
  font-weight: 600;
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

.mobile-menu-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  position: relative;
  margin: 0;
}

.menu-icon {
  width: 20px;
  height: 20px;
}

.menu-icon line {
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}

.auth-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  position: relative;
  margin: 0;
  color: var(--color-text-primary);
  transition: color var(--transition-base);
}

.auth-button:hover {
  color: var(--color-primary-600);
}

.button-icon {
  width: 20px;
  height: 20px;
}

.button-icon path {
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Mobile styles */
@media (max-width: 768px) {
  .header {
    height: 60px;
    background-color: #2f201d;
  }

  .header-content {
    padding: 0 var(--spacing-md);
    gap: var(--spacing-md);
    grid-template-columns: 1fr auto;
    position: relative;
  }

  .site-title {
    justify-self: center;
  }

  .mobile-menu-toggle {
    display: flex;
    color: #fff;
    position: absolute;
    right: calc(var(--spacing-md) + 10px);
    top: 50%;
    transform: translateY(-50%);
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
  .auth-button {
    display: none;
  }
}

/* Desktop styles */
@media (min-width: 768px) {
  .header {
    height: var(--header-height);
  }

  .header-content {
    grid-template-columns: auto 1fr auto;
    padding-right: var(--spacing-md);
  }

  .desktop-nav {
    grid-column: 2;
    justify-self: end;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .auth-button {
    grid-column: 3;
    display: flex;
    color: var(--color-text-primary);
    margin-left: var(--spacing-md);
  }

  .nav-list {
    height: 100%;
    align-items: center;
    justify-content: flex-end;
    padding-left: 0;
  }

  .nav-link {
    padding: 0;
    font-size: var(--font-size-sm);
  }

  .mobile-menu-toggle {
    display: none;
  }
}
</style>
