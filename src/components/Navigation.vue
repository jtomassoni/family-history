<template>
  <nav class="navigation">
    <div class="nav-container">
      <div class="nav-left">
        <router-link to="/" class="nav-logo">
          <img src="../assets/logo.png" alt="Family History Logo" class="logo-img" />
          <span class="logo-text">Family History</span>
        </router-link>
      </div>
      
      <div class="nav-right">
        <template v-if="authStore.isAuthenticated">
          <button class="nav-button logout-button" @click="handleLogout">
            <svg class="nav-icon" viewBox="0 0 24 24">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor"/>
            </svg>
            <span>Logout</span>
          </button>
        </template>
        <template v-else>
          <router-link to="/login" class="nav-button login-button">
            <svg class="nav-icon" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
            </svg>
            <span>Login</span>
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = async () => {
  try {
    await authStore.logout();
    router.push('/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
</script>

<style scoped>
.navigation {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: var(--header-height);
}

.nav-container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 1rem;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left {
  display: flex;
  align-items: center;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--color-text-primary);
}

.logo-img {
  height: 32px;
  width: auto;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 600;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color var(--transition-base);
  text-decoration: none;
}

.login-button {
  background: var(--accent-color, #8b4513);
  color: var(--color-surface);
  border: none;
}

.login-button:hover {
  background: var(--color-primary-700);
}

.logout-button {
  background: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.logout-button:hover {
  background: var(--color-surface-hover);
}

.nav-icon {
  width: 20px;
  height: 20px;
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 0.5rem;
  }
  
  .logo-text {
    display: none;
  }
  
  .nav-button span {
    display: none;
  }
  
  .nav-button {
    padding: 0.5rem;
  }
}
</style> 