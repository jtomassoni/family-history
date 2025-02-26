<template>
  <button class="nav-arrow left-arrow" @click="$emit('click')" :disabled="disabled" aria-label="Previous Event">
    &lt;
  </button>
</template>

<script setup>
import "../styles/LeftArrow.css";
defineProps({
  disabled: Boolean
});
</script>
