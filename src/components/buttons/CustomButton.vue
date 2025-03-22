<template>
  <button
    :type="type"
    class="custom-button"
    :class="{
      'custom-button--disabled': disabled,
      'custom-button--loading': loading,
      [`custom-button--${variant}`]: variant,
      [`custom-button--${size}`]: size
    }"
    :disabled="disabled || loading"
    v-bind="$attrs"
    @click="$emit('click', $event)"
  >
    <component
      v-if="prefixIcon && !loading"
      :is="prefixIcon"
      class="button-icon button-icon--prefix"
    />
    
    <span 
      class="button-content"
      :class="{ 'button-content--loading': loading }"
    >
      <slot />
    </span>

    <component
      v-if="suffixIcon && !loading"
      :is="suffixIcon"
      class="button-icon button-icon--suffix"
    />

    <ArrowPathIcon
      v-if="loading"
      class="button-loading-icon"
    />
  </button>
</template>

<script setup>
import { ArrowPathIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value)
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => [
      'primary',
      'secondary',
      'outline',
      'ghost',
      'danger'
    ].includes(value)
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
  },
  prefixIcon: {
    type: [Object, Function],
    default: null
  },
  suffixIcon: {
    type: [Object, Function],
    default: null
  }
});

defineEmits(['click']);
</script>

<style scoped>
.custom-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  border: 1px solid transparent;
  border-radius: var(--border-radius-md);
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
}

/* Variants */
.custom-button--primary {
  background-color: var(--color-primary-500);
  color: var(--color-white);
}

.custom-button--primary:hover:not(:disabled) {
  background-color: var(--color-primary-600);
}

.custom-button--primary:active:not(:disabled) {
  background-color: var(--color-primary-700);
}

.custom-button--secondary {
  background-color: var(--color-gray-100);
  color: var(--color-gray-900);
}

.custom-button--secondary:hover:not(:disabled) {
  background-color: var(--color-gray-200);
}

.custom-button--secondary:active:not(:disabled) {
  background-color: var(--color-gray-300);
}

.custom-button--outline {
  border-color: var(--color-gray-300);
  background-color: transparent;
  color: var(--color-gray-700);
}

.custom-button--outline:hover:not(:disabled) {
  border-color: var(--color-gray-400);
  background-color: var(--color-gray-50);
}

.custom-button--outline:active:not(:disabled) {
  border-color: var(--color-gray-500);
  background-color: var(--color-gray-100);
}

.custom-button--ghost {
  background-color: transparent;
  color: var(--color-gray-700);
}

.custom-button--ghost:hover:not(:disabled) {
  background-color: var(--color-gray-100);
}

.custom-button--ghost:active:not(:disabled) {
  background-color: var(--color-gray-200);
}

.custom-button--danger {
  background-color: var(--color-error-500);
  color: var(--color-white);
}

.custom-button--danger:hover:not(:disabled) {
  background-color: var(--color-error-600);
}

.custom-button--danger:active:not(:disabled) {
  background-color: var(--color-error-700);
}

/* Sizes */
.custom-button--sm {
  height: 32px;
  padding: 0 var(--spacing-sm);
  font-size: var(--font-size-sm);
}

.custom-button--md {
  height: 40px;
  padding: 0 var(--spacing-md);
  font-size: var(--font-size-base);
}

.custom-button--lg {
  height: 48px;
  padding: 0 var(--spacing-lg);
  font-size: var(--font-size-lg);
}

/* States */
.custom-button--disabled,
.custom-button--loading {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Icons */
.button-icon {
  width: var(--font-size-lg);
  height: var(--font-size-lg);
}

.button-content--loading {
  opacity: 0;
}

.button-loading-icon {
  position: absolute;
  width: var(--font-size-lg);
  height: var(--font-size-lg);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 