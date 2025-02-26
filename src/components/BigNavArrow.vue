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
import { defineProps, defineEmits, onMounted, onUnmounted } from "vue";

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

// Keydown event handler
const handleKeydown = (event) => {
  console.log(`Key pressed: ${event.key}, Arrow direction: ${props.direction}`);

  if (event.key === "ArrowLeft" && props.direction === "left") {
    console.log("Left arrow key pressed, triggering click");
    handleClick();
  }
  if (event.key === "ArrowRight" && props.direction === "right") {
    console.log("Right arrow key pressed, triggering click");
    handleClick();
  }
};

onMounted(() => {
  console.log(`Mounted arrow component with direction: ${props.direction}`);
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>
