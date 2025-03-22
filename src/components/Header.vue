<template>
  <header class="header">
    <div class="header-content">
      <!-- Logo/Site Title -->
      <router-link to="/" class="site-title">
        <h1 class="title">
          <span class="site-name" :data-text="siteTitle">{{ siteTitle }}</span>
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
      <button class="auth-button" @click="openAuth">
        <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M10 17l5-5-5-5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M15 12H3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Login</span>
      </button>

      <!-- Mobile Menu Toggle -->
      <button class="mobile-menu-toggle" @click="$emit('toggle-mobile-menu')" aria-label="Toggle menu">
        <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 12h18M3 6h18M3 18h18" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup>
import { useNavigation } from '../composables/useNavigation';

const { navItems, isCurrentRoute } = useNavigation();
const siteTitle = 'TOMASSONI';

const emit = defineEmits(['help', 'toggle-mobile-menu', 'auth']);

const openAuth = () => {
  emit('auth');
};
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  z-index: var(--z-index-header);
}

.header-content {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  height: 100%;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--spacing-lg);
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
  align-items: center;
  gap: 0;
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
  padding-bottom: 1px;
}

.site-name::after {
  content: '';
  position: absolute;
  bottom: 0;
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
  text-align: center;
  margin-top: 1px;
  line-height: 1;
}

.desktop-nav {
  display: flex;
  align-items: center;
  justify-self: end;
  height: 100%;
  margin-right: 0;
}

.auth-button {
  display: none;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 0 var(--spacing-lg);
  color: var(--color-surface);
  font-size: var(--font-size-base);
  font-weight: 600;
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700));
  border: none;
  border-radius: var(--border-radius-full);
  cursor: pointer;
  transition: background-color var(--transition-base);
  box-shadow: var(--shadow-sm);
  justify-self: flex-end;
  position: relative;
  overflow: hidden;
  height: 40px;
}

.mobile-menu-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-primary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color var(--transition-base);
  width: 32px;
  height: 32px;
  padding: 6px;
  position: relative;
}

.menu-icon {
  width: 20px;
  height: 20px;
}

/* Desktop styles */
@media (min-width: 768px) {
  .header {
    height: 64px;
  }

  .header-content {
    grid-template-columns: auto 1fr auto;
    padding-right: var(--spacing-md);
  }

  .desktop-nav {
    display: flex;
    align-items: center;
    justify-self: end;
    height: 100%;
    margin-right: 0;
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

  .auth-button {
    display: flex;
    height: 32px;
    font-size: var(--font-size-sm);
    padding: 0 var(--spacing-md);
  }

  .mobile-menu-toggle {
    display: none;
  }
}

/* Mobile styles */
@media (max-width: 767px) {
  .header-content {
    padding: 0 var(--spacing-md);
    gap: var(--spacing-md);
    grid-template-columns: 1fr auto;
  }

  .site-title {
    grid-column: 1;
    align-items: center;
  }

  .mobile-menu-toggle {
    grid-column: 2;
    justify-self: end;
    margin-right: var(--spacing-sm);
  }

  .site-name {
    font-size: var(--font-size-lg);
  }

  .site-subtitle {
    font-size: var(--font-size-sm);
  }

  .desktop-nav,
  .auth-button {
    display: none;
  }
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

.auth-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
  opacity: 0;
  transition: opacity var(--transition-base);
}

.auth-button:hover {
  box-shadow: var(--shadow-md);
}

.auth-button:hover::before {
  opacity: 1;
}

.auth-button:active {
  box-shadow: var(--shadow-sm);
}

.button-icon {
  width: 18px;
  height: 18px;
  position: relative;
  z-index: 1;
}

.auth-button span {
  position: relative;
  z-index: 1;
}
</style>
