<template>
  <button class="custom-button" @click="$emit('click')" :disabled="disabled">
    <slot></slot>
  </button>
</template>

<script setup>
import "../styles/CustomButton.css";
defineProps({
  disabled: Boolean
});
</script>
