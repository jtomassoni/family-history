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
import { defineProps, defineEmits, onMounted, onUnmounted } from "vue";
import "../styles/BigNavArrow.css";

const props = defineProps({
  direction: { type: String, required: true }, // 'left' or 'right'
  label: { type: String, required: true },
  disabled: Boolean
});

const emit = defineEmits(["click"]);

const handleClick = () => {
  if (!props.disabled) {
    console.log(`Arrow clicked: ${props.direction}`);
    emit("click");
  } else {
    console.log(`Arrow disabled: ${props.direction}`);
  }
};

// Keydown event handler (optional)
const handleKeydown = (event) => {
  if (event.key === "ArrowLeft" && props.direction === "left") {
    handleClick();
  }
  if (event.key === "ArrowRight" && props.direction === "right") {
    handleClick();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>
