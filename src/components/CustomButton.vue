<template>
  <button class="custom-button" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<script setup>
  // No internal styling; styles are imported from CustomButton.css.
  import "../styles/CustomButton.css";
  
</script>
