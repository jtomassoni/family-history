<template>
  <button 
    :class="[
      'custom-button',
      `custom-button--${variant}`,
      `custom-button--${size}`,
      { 'custom-button--loading': loading }
    ]"
    @click="$emit('click')" 
    :disabled="disabled || loading"
    type="button"
  >
    <span v-if="loading" class="custom-button__loader"></span>
    <span :class="{ 'custom-button__content--hidden': loading }" class="custom-button__content">
      <slot></slot>
    </span>
  </button>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'text'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
});

defineEmits(['click']);
</script>

<style scoped>
.custom-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  border: var(--border-width-base) solid transparent;
  border-radius: var(--button-border-radius);
  cursor: pointer;
  transition: all var(--button-transition);
  position: relative;
  min-width: 80px;
  gap: var(--spacing-xs);
  line-height: var(--button-line-height);
}

/* Size Variants */
.custom-button--sm {
  padding: var(--button-padding-sm);
  font-size: var(--button-font-size-sm);
}

.custom-button--md {
  padding: var(--button-padding-base);
  font-size: var(--button-font-size-base);
}

.custom-button--lg {
  padding: var(--button-padding-lg);
  font-size: var(--button-font-size-lg);
}

/* Color Variants */
.custom-button--primary {
  background-color: var(--color-primary);
  color: var(--color-white);
  box-shadow: var(--shadow-sm);
}

.custom-button--primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
  box-shadow: var(--shadow-md);
}

.custom-button--primary:active:not(:disabled) {
  background-color: var(--color-primary-dark);
  box-shadow: var(--shadow-sm);
}

.custom-button--secondary {
  background-color: var(--color-secondary);
  color: var(--color-white);
  box-shadow: var(--shadow-sm);
}

.custom-button--secondary:hover:not(:disabled) {
  background-color: var(--color-secondary-dark);
  box-shadow: var(--shadow-md);
}

.custom-button--secondary:active:not(:disabled) {
  background-color: var(--color-secondary-dark);
  box-shadow: var(--shadow-sm);
}

.custom-button--outline {
  background-color: transparent;
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.custom-button--outline:hover:not(:disabled) {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.custom-button--outline:active:not(:disabled) {
  background-color: var(--color-primary-dark);
}

.custom-button--text {
  background-color: transparent;
  color: var(--color-primary);
  padding-left: var(--spacing-xs);
  padding-right: var(--spacing-xs);
  min-width: auto;
  border-radius: var(--border-radius-sm);
}

.custom-button--text:hover:not(:disabled) {
  background-color: var(--color-gray-100);
  color: var(--color-primary-dark);
}

.custom-button--text:active:not(:disabled) {
  background-color: var(--color-gray-200);
}

/* Disabled State */
.custom-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

/* Loading State */
.custom-button--loading {
  cursor: wait;
}

.custom-button__content {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  transition: opacity var(--transition-fast);
}

.custom-button__content--hidden {
  opacity: 0;
}

.custom-button__loader {
  position: absolute;
  width: var(--font-size-base);
  height: var(--font-size-base);
  border: var(--border-width-thick) solid currentColor;
  border-radius: var(--border-radius-full);
  border-right-color: transparent;
  animation: button-spin var(--transition-base) linear infinite;
}

@keyframes button-spin {
  to {
    transform: rotate(360deg);
  }
}

/* Focus State */
.custom-button:focus-visible {
  outline: var(--border-width-thick) solid var(--color-primary);
  outline-offset: 2px;
}

/* Touch Device Optimization */
@media (hover: none) {
  .custom-button:not(:disabled):active {
    transform: scale(0.95);
  }
}
</style> 