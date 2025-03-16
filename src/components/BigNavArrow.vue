<template>
  <button 
    class="big-nav-arrow" 
    :class="[direction, { disabled }]" 
    @click="handleClick"
    @touchend="handleTouchEnd"
    :aria-label="label"
  >
    <component 
      :is="direction === 'left' ? ChevronLeftIcon : ChevronRightIcon" 
      class="big-nav-icon" 
    />
    <span class="arrow-hint"></span>
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid';
import "../styles/BigNavArrow.css";

const props = defineProps({
  direction: { type: String, required: true }, // 'left' or 'right'
  label: { type: String, required: true },
  disabled: Boolean
});

const emit = defineEmits(["click", "boundary"]);

// Single click works only on desktop
const handleClick = () => {
  if (window.innerWidth < 768) {
    console.log("Single tap ignored on mobile");
    return;
  }
  if (!props.disabled) {
    console.log(`Arrow clicked (desktop): ${props.direction}`);
    emit("click");
  } else {
    console.log(`Arrow disabled (desktop): ${props.direction} - emitting boundary`);
    emit("boundary");
  }
};

// For mobile: detect double-tap using touchend events (if applicable)
let lastTap = 0;
const handleTouchEnd = () => {
  const currentTime = new Date().getTime();
  const tapLength = currentTime - lastTap;
  if (tapLength > 0 && tapLength < 300) {
    console.log(`Double tap detected on mobile for ${props.direction}`);
    if (!props.disabled) {
      emit("click");
    } else {
      emit("boundary");
    }
  }
  lastTap = currentTime;
};
</script>
