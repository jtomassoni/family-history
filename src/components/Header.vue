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
          <li class="nav-item"><a href="#">About</a></li>
          <li class="nav-item"><a href="#">Contact</a></li>
        </ul>
      </nav>
    </div>
    <div class="site-title-container">
      <div class="site-name">My Site</div>
      <div class="site-subtitle">A wonderful experience</div>
    </div>
    <div class="header-right">
      <!-- Help button opens modal only if it's not already open -->
      <button class="help-button" :disabled="hintModalOpen" @click="openHelp">
        <span class="help-label">Help</span>
        <svg class="help-icon" viewBox="0 0 24 24"></svg>
      </button>
    </div>
    <!-- Mobile Menu Component -->
    <MobileMenu :isOpen="mobileMenuOpen" @close="closeMobileMenu" />
    <!-- Hint Modal Component -->
    <HintModal v-if="hintModalOpen" @close="closeHintModal" />
  </header>
</template>

<script setup>
import { ref } from 'vue';
import MobileMenu from '../components/MobileMenu.vue';
import HintModal from '../components/HintModal.vue';
import "../styles/header.css";

const mobileMenuOpen = ref(false);
const hintModalOpen = ref(false);

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value;
}

function closeMobileMenu() {
  mobileMenuOpen.value = false;
}

function openHelp() {
  if (!hintModalOpen.value) {
    hintModalOpen.value = true;
  }
}

function closeHintModal() {
  hintModalOpen.value = false;
}
</script>
