<template>
  <button class="nav-arrow right-arrow" @click="$emit('click')" :disabled="disabled" aria-label="Next Event">
    &gt;
  </button>
</template>

<script setup>
import "../styles/RightArrow.css";
defineProps({
  disabled: Boolean
});
</script>
