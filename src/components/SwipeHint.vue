<template>
  <div class="swipe-hint-overlay" v-if="showHint">
    <div class="swipe-hint-content">
      <p class="hint-text">
        Swipe left or right to navigate through history.<br>
        You can also use the
        <span class="datepicker-text">
          <span class="calendar-icon">🗓️</span> date picker
        </span>
        at the top!
      </p>
      <div class="arrow-container">
        <span class="arrow arrow-left">⟵</span>
        <span class="arrow arrow-right">⟶</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import "../styles/SwipeHint.css";

const showHint = ref(false);

onMounted(() => {
  if (window.innerWidth < 768) {
    showHint.value = true;
    setTimeout(() => {
      showHint.value = false;
    }, 4000); // Hide after 4 seconds
  }
});
</script>
