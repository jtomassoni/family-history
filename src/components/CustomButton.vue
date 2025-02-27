<template>
  <button 
    class="custom-button" 
    @click="$emit('click')" 
    :disabled="disabled"
    :style="{ 
      padding: padding, 
      border: border, 
      margin: margin 
    }"
  >
    <slot></slot>
  </button>
</template>

<script setup>
import "../styles/CustomButton.css";

defineProps({
  disabled: Boolean,
  padding: {
    type: String,
    default: "5px 10px"  // Default padding
  },
  border: {
    type: String,
    default: "none"  // Default border
  },
  margin: {
    type: String,
    default: "0"  // Default margin
  }
});
</script>
