<template>
  <Transition name="fade">
    <div v-if="isVisible" class="wine-loader-overlay">
      <div class="wine-loader-container">
        <div class="spinner"></div>
        <div class="loading-text">Loading...</div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, provide, onBeforeUnmount } from 'vue';

// Create a reactive state for visibility
const isVisible = ref(false);
let timeoutId = null;
let startTime = 0;
const MIN_DISPLAY_TIME = 1000; // 1 second minimum display time

// Method to show the loader
const show = () => {
  clearTimeout(timeoutId);
  if (!isVisible.value) {
    startTime = Date.now();
    isVisible.value = true;
    console.log('WineLoader: Started showing at', startTime);
  }
};

// Method to hide the loader with optional minimum display time
const hide = (minDelay = MIN_DISPLAY_TIME) => {
  // If not currently visible, do nothing
  if (!isVisible.value) {
    return;
  }

  const now = Date.now();
  const elapsedTime = now - startTime;
  const remainingTime = Math.max(0, minDelay - elapsedTime);
  
  clearTimeout(timeoutId);
  console.log(`WineLoader: Will hide after ${remainingTime}ms delay, elapsed: ${elapsedTime}ms`);
  
  // Force immediate hide if minDelay is 0
  if (minDelay === 0) {
    console.log('WineLoader: Force immediate hide');
    isVisible.value = false;
    return;
  }
  
  timeoutId = setTimeout(() => {
    isVisible.value = false;
    console.log('WineLoader: Hidden at', Date.now());
  }, remainingTime);
};

// Clean up on unmount
onBeforeUnmount(() => {
  clearTimeout(timeoutId);
});

// Provide loader methods to all components in the app
provide('loader', {
  show,
  hide
});

// Export for direct component access
defineExpose({
  show,
  hide
});
</script>

<style scoped>
.wine-loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.wine-loader-container {
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  border: 2px solid var(--accent-color, #8b4513);
}

.spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 1.5rem;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: var(--accent-color, #8b4513);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--accent-color, #8b4513);
  margin-top: 1rem;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 