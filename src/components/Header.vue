<template>
  <header class="site-header">
    <div class="header-left">
      <!-- Hamburger icon (mobile only) -->
      <button class="hamburger-button" @click="toggleMobileMenu">
        <svg class="hamburger-icon" viewBox="0 0 100 80">
          <rect width="100" height="10"></rect>
          <rect y="30" width="100" height="10"></rect>
          <rect y="60" width="100" height="10"></rect>
        </svg>
      </button>
      <!-- Desktop navigation -->
      <nav class="desktop-nav">
        <ul class="nav-list">
          <li class="nav-item">
            <router-link to="/" :class="{ current: route.path === '/' }">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/gallery" :class="{ current: route.path === '/gallery' }">Gallery</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/stories" :class="{ current: route.path === '/stories' }">Stories</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/family-tree" :class="{ current: route.path === '/family-tree' }">Family Tree</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/about" :class="{ current: route.path === '/about' }">About</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/contact" :class="{ current: route.path === '/contact' }">Contact</router-link>
          </li>
        </ul>
      </nav>
    </div>
    <div class="site-title-container">
      <div class="site-name">Tomassoni</div>
      <div class="site-subtitle">Family History</div>
    </div>
    <div class="header-right">
      <!-- Help button (only visible on the Gallery page) -->
      <button v-if="route.path === '/gallery'" class="help-button" @click="openHelp">
        <span class="help-label">Help</span>
        <span class="help-icon"></span>
      </button>
      
      <!-- Login area -->
      <div class="login-container">
        <router-link to="/login" class="login-button" :class="{ disabled: route.path === '/login' }">
          <span class="login-icon">🔑</span>
          <template v-if="isLoggedIn">
            Howdy, {{ username }}
          </template>
          <template v-else>
            Login
          </template>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import "../styles/Header.css";

// Define emits for help and toggling mobile menu
const emit = defineEmits(['help', 'toggle-mobile-menu']);

// Get current route for active link highlighting
const route = useRoute();

const isLoggedIn = ref(false);
const username = ref("");

const openHelp = () => {
  emit('help');
};

// Emit event to toggle the mobile menu when the hamburger is clicked.
const toggleMobileMenu = () => {
  console.log("Hamburger clicked");
  emit('toggle-mobile-menu');
};
</script>
