<template>
  <button 
    class="big-nav-arrow" 
    :class="[
      `big-nav-arrow--${direction}`,
      { 'big-nav-arrow--disabled': disabled }
    ]" 
    @click="handleClick"
    @touchend="handleTouchEnd"
    :aria-label="label"
    :disabled="disabled"
  >
    <component 
      :is="direction === 'left' ? ChevronLeftIcon : ChevronRightIcon" 
      class="big-nav-arrow__icon" 
      :aria-hidden="true"
    />
    <span 
      class="big-nav-arrow__hint" 
      :class="{ 'big-nav-arrow__hint--visible': showHint }"
      role="tooltip"
    >
      {{ label }}
    </span>
  </button>
</template>

<script setup>
import { ref } from 'vue';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
  direction: {
    type: String,
    required: true,
    validator: (value) => ['left', 'right'].includes(value)
  },
  label: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click', 'boundary']);
const showHint = ref(false);

// Handle desktop clicks
const handleClick = () => {
  if (window.innerWidth < 768) return;
  
  if (!props.disabled) {
    emit('click');
  } else {
    showHint.value = true;
    emit('boundary');
    setTimeout(() => {
      showHint.value = false;
    }, 2000);
  }
};

// Handle mobile double-tap
let lastTap = 0;
const handleTouchEnd = (event) => {
  event.preventDefault(); // Prevent zoom on double tap
  const currentTime = new Date().getTime();
  const tapLength = currentTime - lastTap;
  
  if (tapLength > 0 && tapLength < 300) {
    if (!props.disabled) {
      emit('click');
    } else {
      showHint.value = true;
      emit('boundary');
      setTimeout(() => {
        showHint.value = false;
      }, 2000);
    }
  }
  lastTap = currentTime;
};
</script>

<style scoped>
.big-nav-arrow {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  background-color: var(--color-white);
  border: var(--border-width-base) solid var(--color-gray-200);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  cursor: pointer;
  transition: all var(--transition-base);
  z-index: var(--z-index-fixed);
  box-shadow: var(--shadow-md);
  color: var(--color-primary);
}

.big-nav-arrow--left {
  left: var(--spacing-md);
}

.big-nav-arrow--right {
  right: var(--spacing-md);
}

.big-nav-arrow:hover:not(:disabled) {
  background-color: var(--color-gray-50);
  transform: translateY(-50%) scale(1.1);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary);
}

.big-nav-arrow:active:not(:disabled) {
  transform: translateY(-50%) scale(0.95);
  box-shadow: var(--shadow-sm);
}

.big-nav-arrow--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.big-nav-arrow__icon {
  width: var(--font-size-xl);
  height: var(--font-size-xl);
  transition: transform var(--transition-fast);
}

.big-nav-arrow:hover:not(:disabled) .big-nav-arrow__icon {
  transform: scale(1.1);
}

.big-nav-arrow__hint {
  position: absolute;
  top: 120%;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--color-gray-900);
  color: var(--color-white);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  opacity: 0;
  transition: opacity var(--transition-fast);
  pointer-events: none;
  white-space: nowrap;
  box-shadow: var(--shadow-md);
}

.big-nav-arrow__hint--visible {
  opacity: 1;
}

.big-nav-arrow__hint::before {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: var(--spacing-xs) solid transparent;
  border-bottom-color: var(--color-gray-900);
}

/* Focus State */
.big-nav-arrow:focus-visible {
  outline: var(--border-width-thick) solid var(--color-primary);
  outline-offset: var(--border-width-base);
}

/* Mobile Styles */
@media (max-width: var(--breakpoint-md)) {
  .big-nav-arrow {
    padding: var(--spacing-sm);
    background-color: var(--color-white);
    opacity: 0.9;
  }
  
  .big-nav-arrow--left {
    left: var(--spacing-xs);
  }
  
  .big-nav-arrow--right {
    right: var(--spacing-xs);
  }
  
  .big-nav-arrow__icon {
    width: var(--font-size-lg);
    height: var(--font-size-lg);
  }

  /* Double-tap hint */
  .big-nav-arrow::after {
    content: 'Double tap to navigate';
    position: absolute;
    bottom: calc(-1 * var(--spacing-xl));
    left: 50%;
    transform: translateX(-50%);
    font-size: var(--font-size-xs);
    color: var(--color-gray-600);
    white-space: nowrap;
    opacity: 0.8;
    background-color: var(--color-white);
    padding: var(--spacing-xxs) var(--spacing-xs);
    border-radius: var(--border-radius-sm);
    box-shadow: var(--shadow-sm);
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .big-nav-arrow {
    transition: none;
  }

  .big-nav-arrow:hover:not(:disabled) {
    transform: translateY(-50%);
  }

  .big-nav-arrow__icon {
    transition: none;
  }
}
</style> 