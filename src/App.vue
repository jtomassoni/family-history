<template>
  <div class="app-root">
    <!-- Main app content -->
    <div class="app" :class="{ 'no-scroll': isAuthOpen && isMobile }">
      <!-- Persistent header -->
      <Header 
        :isHelpActive="showHintModal"
        @help="toggleHintModal" 
        @toggle-mobile-menu="handleToggleMobileMenu"
        @auth="handleAuth"
      />

      <!-- Main content (routed view) -->
      <main class="main-content">
        <router-view v-slot="{ Component }">
          <keep-alive include="ProfileView">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </main>

      <!-- Persistent footer -->
      <Footer />
    </div>

    <!-- Wine Loader -->
    <WineLoader ref="loader" />

    <!-- Overlay layer -->
    <div class="overlay-layer" :class="{ 'is-active': isAuthOpen || isMobileMenuOpen || showHintModal }">
      <!-- Optional: Global hint modal -->
      <transition name="fade">
        <HintModal 
          v-if="showHintModal"
          :desktopHint="helpContent.desktopHint"
          :mobileHint="helpContent.mobileHint"
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
    
    <!-- Debug info panel -->
    <DebugInfo />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, provide } from 'vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import HintModal from './components/HintModal.vue';
import MobileMenu from './components/MobileMenu.vue';
import AuthFlyout from './components/auth/AuthFlyout.vue';
import WineLoader from './components/WineLoader.vue';
import DebugInfo from './components/DebugInfo.vue';
import "./styles/main.css";
import { useHelpContent } from './composables/useHelpContent';
import { useAuthStore } from './stores/auth';
import { useRouter } from 'vue-router';

// Utility function for delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Reference to the loader
const loader = ref(null);

// Provide the loader methods globally with guaranteed minimum display time
provide('showLoader', () => loader.value?.show());
provide('hideLoader', (delay = 1000) => loader.value?.hide(delay));

// Auth store
const authStore = useAuthStore();

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

// Help content
const { helpContent } = useHelpContent();

// Hint modal state
const showHintModal = ref(false);
const toggleHintModal = () => {
  showHintModal.value = !showHintModal.value;
};
const dismissHintModal = () => {
  showHintModal.value = false;
};

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

const router = useRouter();

const handleAuth = () => {
  if (authStore.isAuthenticated) {
    // If the user is already authenticated, redirect to profile
    router.push('/profile');
  } else {
    // Otherwise show the auth dialog
    isAuthOpen.value = true;
    if (isMobile.value) {
      document.body.style.overflow = 'hidden';
    }
  }
};

const closeAuth = () => {
  isAuthOpen.value = false;
  document.body.style.overflow = '';
};

const handleAuthSubmit = async (credentials) => {
  try {
    // Show the loader
    loader.value?.show();
    const startTime = Date.now();
    
    // TODO: Implement authentication
    console.log('Auth submitted:', credentials);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Calculate elapsed time and ensure minimum display time
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, 1000 - elapsedTime);
    if (remainingTime > 0) {
      await delay(remainingTime);
    }
    
    // Hide the loader
    loader.value?.hide();
    closeAuth();
  } catch (error) {
    console.error('Auth error:', error);
    // Ensure loader is shown for at least 1 second even on error
    loader.value?.hide(1000);
  }
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
  overflow-y: auto; /* Allow vertical scrolling */
}

.app.no-scroll {
  height: 100vh;
  overflow: hidden;
}

.main-content {
  flex: 1;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
  padding-top: var(--header-height);
  margin-bottom: var(--footer-height);
  overflow-y: visible; /* Allow content to scroll */
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
