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
          <li class="nav-item"><router-link to="/">Home</router-link></li>
          <li class="nav-item"><router-link to="/gallery">Gallery</router-link></li>
          <li class="nav-item"><router-link to="/stories">Stories</router-link></li>
          <li class="nav-item"><router-link to="/family-tree">Family Tree</router-link></li>
          <li class="nav-item"><router-link to="/about">About</router-link></li>
          <li class="nav-item"><router-link to="/contact">Contact</router-link></li>
        </ul>
      </nav>
    </div>
    <div class="site-title-container">
      <div class="site-name">Tomassoni</div>
      <div class="site-subtitle">Family History</div>
    </div>
    <div class="header-right">
      <!-- Help button that emits a "help" event -->
      <button class="help-button" @click="openHelp">
        <span class="help-label">Help</span>
        <span class="help-icon"></span>
      </button>
      <!-- Login area -->
      <div class="login-container">
        <button class="login-button" @click="toggleLoginMenu">
          <template v-if="isLoggedIn">
            Howdy, {{ username }}
          </template>
          <template v-else>
            Login
          </template>
        </button>
        <div v-if="showLoginMenu" class="login-menu">
          <button class="logout-button" @click="logout">Logout</button>
        </div>
      </div>
    </div>
    <!-- Mobile Menu Component -->
    <MobileMenu :isOpen="isMobileMenuOpen" @close="closeMobileMenu" />
  </header>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import MobileMenu from '../components/MobileMenu.vue';
import "../styles/Header.css";

// Define event emitter for "help"
const emit = defineEmits(['help']);

const isMobileMenuOpen = ref(false);
// Remove local modal flag; parent controls it.

const isLoggedIn = ref(false);
const username = ref("");
const showLoginMenu = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

// When help is clicked, emit the "help" event for the parent.
const openHelp = () => {
  emit('help');
};

const toggleLoginMenu = () => {
  showLoginMenu.value = !showLoginMenu.value;
};

const logout = () => {
  isLoggedIn.value = false;
  username.value = "";
  showLoginMenu.value = false;
};
</script>
