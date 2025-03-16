<template>
  <header class="site-header">
    <div class="header-left">
      <!-- On mobile, show hamburger icon; on desktop, show a proper nav menu -->
      <button v-if="isMobile" class="hamburger-button" @click="toggleMobileNav" aria-label="Menu">
        <Bars3Icon class="hamburger-icon" />
      </button>
      <nav v-else class="desktop-nav">
        <ul class="nav-list">
          <li class="nav-item"><a href="#">Home</a></li>
          <li class="nav-item"><a href="#">About</a></li>
          <li class="nav-item"><a href="#">Contact</a></li>
        </ul>
      </nav>
    </div>
    <div class="site-title-container">
      <span class="site-name">Tomassoni</span>
      <span class="site-subtitle">Family History</span>
    </div>
    <button class="help-button" @click="openHelp" aria-label="Help">
      <span class="help-label">Help</span>
      <QuestionMarkCircleIcon class="help-icon" />
    </button>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Bars3Icon } from '@heroicons/vue/24/solid';
import "../styles/Header.css";

const isMobile = computed(() => window.innerWidth < 768);

const toggleMobileNav = () => {
  // Placeholder for mobile nav toggle functionality.
  console.log("Mobile nav toggled");
};
</script>
