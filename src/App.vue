<template>
  <div id="app">
    <!-- Persistent header -->
    <Header 
      @help="toggleHintModal" 
      @toggle-mobile-menu="handleToggleMobileMenu" 
    />

    <!-- Main content (routed view) -->
    <router-view />

    <!-- Persistent footer -->
    <Footer />

    <!-- Optional: Global hint modal -->
    <transition name="hint-fade">
      <HintModal 
        v-if="showHintModal"
        :desktopHint="helpDesktopHint"
        :mobileHint="helpMobileHint"
        @dismiss="dismissHintModal"
      />
    </transition>

    <!-- Mobile Menu (visible when isMobileMenuOpen is true) -->
    <MobileMenu :isOpen="isMobileMenuOpen" @close="handleCloseMobileMenu" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import HintModal from './components/HintModal.vue';
import MobileMenu from './components/MobileMenu.vue';
import "./styles/main.css";

// Hint modal state
const showHintModal = ref(false);
const toggleHintModal = () => {
  showHintModal.value = !showHintModal.value;
};
const dismissHintModal = () => {
  showHintModal.value = false;
};

// Hint texts
const helpDesktopHint = "LOST ❓<br> Click a pic 🖼️ to see details.<br>Use your ⬅️/➡️ arrow keys to navigate.<br>Press space ⌨️ for the date selection.";
const helpMobileHint = "LOST ❓<br> Click a pic 🖼️ to see details.<br>Swipe (👈 and 👉) to navigate.<br>Tap the 📅 for date selection.";

// Mobile menu state
const isMobileMenuOpen = ref(false);

const handleToggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  console.log("Mobile menu toggled:", isMobileMenuOpen.value);
};

const handleCloseMobileMenu = () => {
  isMobileMenuOpen.value = false;
  console.log("Mobile menu closed");
};
</script>
