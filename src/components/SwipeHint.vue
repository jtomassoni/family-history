<template>
  <div class="swipe-hint-overlay" v-if="showHint">
    <div class="swipe-hint-content">
      <p class="hint-text">
        <strong>Tap an image to learn more!</strong>
        Use the
        <span class="datepicker-text">
          <span class="calendar-icon">📅</span> date picker to go wherever you want.
        </span>
        <br><br>
      </p>
      <div class="arrow-container">
        <span class="arrow arrow-left">⟵</span>
        <span class="arrow arrow-right">⟶</span>
      </div><br>
      Swipe left or right to navigate through history.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import "../styles/SwipeHint.css";

const showHint = ref(false);

onMounted(() => {
  console.log("Mounted: Checking screen width...");
  
  if (window.innerWidth < 768) {
    console.log("Showing swipe hint on mobile.");
    showHint.value = true;
    
    // setTimeout(() => {
    //   console.log("Hiding swipe hint...");
    //   showHint.value = false;
    // }, 400000); // Hide after 4 seconds
  } else {
    console.log("Not mobile: Swipe hint will not show.");
  }
});
</script>
