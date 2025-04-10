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
        :is-open="mobileMenu.isOpen.value" 
        @close="mobileMenu.close"
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
import { ref, onMounted, onUnmounted, provide } from 'vue';
import { useRouter } from 'vue-router';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import HintModal from './components/HintModal.vue';
import MobileMenu from './components/MobileMenu.vue';
import AuthFlyout from './components/auth/AuthFlyout.vue';
import WineLoader from './components/WineLoader.vue';
import "./styles/main.css";
import { useHelpContent } from './composables/useHelpContent';
import { useAuthStore } from './stores/auth';
import { useNavigation } from './composables/useNavigation';
import { useHelp } from './composables/useHelp';
import { useMobileMenu } from './composables/useMobileMenu';

// Utility function for delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Reference to the loader
const loader = ref(null);

// Provide the loader methods globally with guaranteed minimum display time
provide('showLoader', () => loader.value?.show());
provide('hideLoader', (delay = 1000) => loader.value?.hide(delay));

// Router
const router = useRouter();

// Auth store
const authStore = useAuthStore();

// Mobile detection
const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

// Mobile menu
const mobileMenu = useMobileMenu();

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
  
  // Initialize auth store
  authStore.initializeFromStorage();
  authStore.setAuthHeaders();
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
  mobileMenu.toggle();
};

const handleCloseMobileMenu = () => {
  mobileMenu.close();
};

// Auth state
const isAuthOpen = ref(false);

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
    
    const result = await authStore.login(credentials.email, credentials.password);
    
    if (result.success) {
      // Calculate elapsed time and ensure minimum display time
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 1000 - elapsedTime);
      if (remainingTime > 0) {
        await delay(remainingTime);
      }
      
      // Hide the loader and close auth
      loader.value?.hide();
      closeAuth();
      router.push('/profile');
    }
  } catch (error) {
    console.error('Authentication error:', error);
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
  overflow: hidden;
}

/* Main content area */
.main-content {
  flex: 1;
  position: relative;
  z-index: 1;
}

/* Overlay layer */
.overlay-layer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.5);
  display: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.overlay-layer.is-active {
  display: block;
  opacity: 1;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
