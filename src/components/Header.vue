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
          <li class="nav-item"><a href="#">Home</a></li>
          <li class="nav-item"><a href="#">Gallery</a></li>
          <li class="nav-item"><a href="#">Stories</a></li>
          <li class="nav-item"><a href="#">Family Tree</a></li>
          <li class="nav-item"><a href="#">About</a></li>
          <li class="nav-item"><a href="#">Contact</a></li>
        </ul>
      </nav>
    </div>
    <div class="site-title-container">
      <div class="site-name">Tomassoni</div>
      <div class="site-subtitle">Family History</div>
    </div>
    <div class="header-right">
      <!-- Help button opens modal only if it's not already open -->
      <button class="help-button" :disabled="isHintModalOpen" @click="openHelp">
        <span class="help-label">Help</span>
        <!-- Changed from SVG to span -->
        <span class="help-icon"></span>
      </button>
    </div>
    <!-- Mobile Menu Component -->
    <MobileMenu :isOpen="isMobileMenuOpen" @close="closeMobileMenu" />
    <!-- Hint Modal Component -->
    <HintModal 
      v-if="isHintModalOpen"
      :desktopHint="'Use your ⬅️ arrow keys ➡️ to glide through photos.<br>For a quick jump to the oldest or newest, hold ⬆️ Shift ⬆️ with your arrows!<br>⌨️ Press space to open the 🗓️ date selector.'"
      :mobileHint="'📱 Swipe left/right to cruise through family memories.<br>👆Tap the 🗓️ icon to pick a special date!'"
      @dismiss="closeHintModal"
    />
  </header>
</template>

<script setup>
import { ref } from 'vue';
import MobileMenu from '../components/MobileMenu.vue';
import HintModal from '../components/HintModal.vue';
import "../styles/Header.css";

// Renamed reactive variables for clarity
const isMobileMenuOpen = ref(false);
const isHintModalOpen = ref(false);

// Toggle mobile menu visibility.
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

// Close mobile menu.
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

// Open the hint modal.
const openHelp = () => {
  if (!isHintModalOpen.value) {
    isHintModalOpen.value = true;
  }
};

// Close the hint modal.
const closeHintModal = () => {
  isHintModalOpen.value = false;
};
</script>
