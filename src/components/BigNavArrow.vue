<template>
  <button 
    class="big-nav-arrow" 
    :class="[direction, { disabled }]" 
    @click="handleClick"
    :aria-label="label"
  >
    {{ direction === 'left' ? '‹' : '›' }}
  </button>
</template>

<script setup>
import "../styles/BigNavArrow.css";
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  direction: { type: String, required: true }, // 'left' or 'right'
  label: { type: String, required: true },
  disabled: Boolean
});

const emit = defineEmits(["click"]);

const handleClick = () => {
  if (!props.disabled) {
    console.log(`Arrow clicked: ${props.direction}`); // ✅ Debug Log
    emit("click");
  } else {
    console.log(`Arrow disabled: ${props.direction}`);
  }
};
</script>
