<template>
  <transition name="hint-fade">
    <div class="hint-modal-overlay" v-if="showHint" @click="dismissHint">
      <div class="hint-modal-content" @click.stop>
        <button class="close-btn" @click="dismissHint">✖</button>
        <p class="hint-text">
          <strong>Get curious!</strong><br>
          Tap an image to uncover its story.
        </p>
        <p class="instruction-text mobile-instructions">
          <span class="icon">📱</span>
          Swipe left or right to journey through history.
        </p>
        <p class="instruction-text desktop-instructions">
          <span class="icon">⌨️</span>
          Use the navigation arrows or press the left/right arrow keys on your keyboard.
        </p>
        <p class="fun-facts desktop-instructions">
          <span class="icon">⚡</span>
          Hotkey tip: Shift+Arrow keys jump directly to the boundary!
        </p>
        <p class="fun-facts mobile-instructions">
          <span class="icon">📅</span>
          Fun fact: Tap the calendar icon to open the date picker.
        </p>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import "../styles/HintModal.css";

const showHint = ref(false);

const dismissHint = () => {
  showHint.value = false;
};

onMounted(() => {
  // On mobile and desktop, show the hint immediately on first load for 5 seconds.
  showHint.value = true;
  setTimeout(() => {
    showHint.value = false;
  }, 5000);

  // Optionally, dismiss the hint if user presses arrow keys.
  const handleKeydown = (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      dismissHint();
    }
  };
  window.addEventListener("keydown", handleKeydown);
  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeydown);
  });
});
</script>
