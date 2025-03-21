<template>
  <div class="app-root">
    <!-- Main app content -->
    <div class="app" :class="{ 'no-scroll': isAuthOpen && isMobile }">
      <!-- Persistent header -->
      <Header 
        @help="toggleHintModal" 
        @toggle-mobile-menu="handleToggleMobileMenu"
        @auth="handleAuth"
      />

      <!-- Main content (routed view) -->
      <main class="main-content">
        <router-view />
      </main>

      <!-- Persistent footer -->
      <Footer />
    </div>

    <!-- Overlay layer -->
    <div class="overlay-layer" :class="{ 'is-active': isAuthOpen || isMobileMenuOpen || showHintModal }">
      <!-- Optional: Global hint modal -->
      <transition name="fade">
        <HintModal 
          v-if="showHintModal"
          :desktopHint="helpDesktopHint"
          :mobileHint="helpMobileHint"
          @dismiss="dismissHintModal"
        />
      </transition>

      <!-- Mobile Menu (visible when isMobileMenuOpen is true) -->
      <MobileMenu 
        :isOpen="isMobileMenuOpen" 
        @close="handleCloseMobileMenu"
        @auth="handleAuth"
      />

      <!-- Auth Flyout -->
      <AuthFlyout 
        :is-open="isAuthOpen" 
        @close="closeAuth"
        @submit="handleAuthSubmit"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import HintModal from './components/HintModal.vue';
import MobileMenu from './components/MobileMenu.vue';
import AuthFlyout from './components/auth/AuthFlyout.vue';
import "./styles/main.css";

// Mobile detection
const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

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
};

const handleCloseMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

// Auth state
const isAuthOpen = ref(false);

const handleAuth = () => {
  isAuthOpen.value = true;
  if (isMobile.value) {
    document.body.style.overflow = 'hidden';
  }
};

const closeAuth = () => {
  isAuthOpen.value = false;
  document.body.style.overflow = '';
};

const handleAuthSubmit = async (credentials) => {
  // TODO: Implement authentication
  console.log('Auth submitted:', credentials);
  closeAuth();
};
</script>

<style>
/* Root styles */
.app-root {
  min-height: 100vh;
  position: relative;
  isolation: isolate; /* Create new stacking context */
}

/* Main app container */
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

.app.no-scroll {
  height: 100vh;
  overflow: hidden;
}

.main-content {
  flex: 1;
  position: relative;
  z-index: 1;
}

/* Overlay layer */
.overlay-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: var(--z-index-overlay);
}

.overlay-layer.is-active {
  pointer-events: auto;
}

/* Global styles */
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  background-color: var(--color-background);
}

body.no-scroll {
  overflow: hidden;
}

/* Z-index hierarchy */
:root {
  --z-index-base: 1;
  --z-index-header: 10;
  --z-index-footer: 10;
  --z-index-overlay: 100;
  --z-index-modal: 200;
  --z-index-auth: 1000;
}

/* Global transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
