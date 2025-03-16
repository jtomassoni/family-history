<template>
  <transition name="hint-fade">
    <div class="hint-modal-overlay" @click="dismiss">
      <div class="hint-modal-content" @click.stop>
        <button class="close-btn" @click.stop="dismiss">✖</button>
        <p class="hint-text">
          <strong>Get curious!</strong><br>
          Tap an image to uncover its story.
        </p>
        <!-- Mobile-specific instructions -->
        <p class="instruction-text mobile-only">
          <span class="icon">📱</span>
          Swipe left or right to navigate photos.
        </p>
        <p class="fun-facts mobile-only">
          <span class="icon">📅</span>
          Tap the calendar icon to open the date picker.
        </p>
        <!-- Desktop-specific instructions -->
        <p class="instruction-text desktop-only">
          <span class="icon">⌨️</span>
          Use the left/right arrow keys to navigate photos.
        </p>
        <p class="fun-facts desktop-only">
          <span class="icon">⚡</span>
          Hotkey tip: Shift+Arrow keys jump directly to the boundary!
        </p>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineEmits } from "vue";
import "../styles/HintModal.css";

const emit = defineEmits(["close"]);

function dismiss() {
  console.log("dismiss triggered");
  emit("close");
}
</script>
