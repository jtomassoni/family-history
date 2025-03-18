<template>
  <header class="site-header">
    <!-- LEFT: Hamburger + Desktop Nav -->
    <div class="header-left">
      <button class="hamburger-button" @click="toggleMobileMenu">
        <svg class="hamburger-icon" viewBox="0 0 100 80">
          <rect width="100" height="10"></rect>
          <rect y="30" width="100" height="10"></rect>
          <rect y="60" width="100" height="10"></rect>
        </svg>
      </button>
      <nav class="desktop-nav">
        <ul class="nav-list">
          <li class="nav-item">
            <router-link to="/" :class="{ current: route.path === '/' }">
              Home
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/gallery"
              :class="{ current: route.path === '/gallery' }"
            >
              Gallery
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/stories"
              :class="{ current: route.path === '/stories' }"
            >
              Stories
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/family-tree"
              :class="{ current: route.path === '/family-tree' }"
            >
              Family Tree
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/about"
              :class="{ current: route.path === '/about' }"
            >
              About
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/contact"
              :class="{ current: route.path === '/contact' }"
            >
              Contact
            </router-link>
          </li>
        </ul>
      </nav>
    </div>

    <!-- MIDDLE: Site Title -->
    <div class="site-title-container">
      <div class="site-name">Tomassoni</div>
      <div class="site-subtitle">Family History</div>
    </div>

    <!-- RIGHT: Help button (Gallery only) + Login button -->
    <div class="header-right">
      <button
        v-if="route.path === '/gallery'"
        class="help-button shared-button"
        @click="openHelp"
      >
        <span class="button-icon help-icon">?</span>
        <span class="button-label">Help</span>
      </button>

      <div class="login-container">
        <router-link
          to="/login"
          class="login-button shared-button"
          :class="{ disabled: route.path === '/login' }"
        >
          <span class="button-icon login-icon">🔑</span>
          <span class="button-label login-text">Login</span>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import "../styles/Header.css";

// Emitted events
const emit = defineEmits(['help', 'toggle-mobile-menu']);
const route = useRoute();

// Example login state
const isLoggedIn = ref(false);

// Emit "help" event
const openHelp = () => {
  emit('help');
};

// Emit "toggle-mobile-menu" event
const toggleMobileMenu = () => {
  console.log("Hamburger clicked");
  emit('toggle-mobile-menu');
};
</script>
