<template>
  <div class="debug-buttons">
    <button @click="setRealUser" class="debug-button">Set Real User</button>
    <button @click="checkAuth" class="debug-button">Check Auth</button>
    <button @click="resetAuth" class="debug-button">Reset</button>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const setRealUser = () => {
  const userData = {
    email: 'james.tomassoni@gmail.com',
    name: 'James Tomassoni',
    picture: 'https://randomuser.me/api/portraits/men/32.jpg'
  };
  
  // Update auth store
  authStore.user = userData;
  authStore.token = 'debug_token_' + Date.now();
  
  // Update localStorage
  localStorage.setItem('auth_token', authStore.token);
  localStorage.setItem('auth_user', JSON.stringify(userData));
  
  alert('User data set! Current user:\n' + JSON.stringify(userData, null, 2));
};

const checkAuth = () => {
  alert('Auth State:\n' + 
    'Authenticated: ' + authStore.isAuthenticated + '\n' +
    'User: ' + JSON.stringify(authStore.user, null, 2) + '\n' +
    'Token: ' + authStore.token);
};

const resetAuth = () => {
  // Clear all auth data
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
  authStore.user = null;
  authStore.token = null;
  authStore.error = null;
  alert('Auth reset!');
  location.reload();
};
</script>

<style scoped>
.debug-buttons {
  position: fixed;
  bottom: 10px;
  right: 10px;
  display: flex;
  gap: 5px;
  z-index: 9999;
}

.debug-button {
  background: #333;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 12px;
}

.debug-button:hover {
  background: #444;
}
</style> 