<template>
  <div class="swipe-hint-overlay" v-if="showHint">
    <div class="swipe-hint-content">
      <p class="hint-text">
        Swipe left or right to navigate through history.<br>
        You can also use the
        <span class="datepicker-text">
          <span class="calendar-icon">📅</span> date picker
        </span>
        at the top!<br><br>
        <strong>Tap an image to enlarge it/shrink it!</strong>
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
  console.log("Mounted: Checking screen width...");
  
  if (window.innerWidth < 768) {
    console.log("Showing swipe hint on mobile.");
    showHint.value = true;
    
    setTimeout(() => {
      console.log("Hiding swipe hint...");
      showHint.value = false;
    }, 4000); // Hide after 4 seconds
  } else {
    console.log("Not mobile: Swipe hint will not show.");
  }
});
</script>
