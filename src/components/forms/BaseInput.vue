<template>
  <div 
    class="base-input"
    :class="{
      'base-input--disabled': disabled,
      'base-input--error': error,
      'base-input--focused': focused,
      [`base-input--${size}`]: size
    }"
  >
    <component
      v-if="prefixIcon"
      :is="prefixIcon"
      class="input-icon input-icon--prefix"
      :class="{ 'input-icon--clickable': onPrefixClick }"
      @click="onPrefixClick && onPrefixClick()"
    />
    
    <input
      ref="inputRef"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      v-bind="$attrs"
      :disabled="disabled"
      :placeholder="placeholder"
      :type="type"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${id}-error` : undefined"
      @focus="focused = true"
      @blur="focused = false"
      class="input-field"
    />
    
    <component
      v-if="suffixIcon"
      :is="suffixIcon"
      class="input-icon input-icon--suffix"
      :class="{ 'input-icon--clickable': onSuffixClick }"
      @click="onSuffixClick && onSuffixClick()"
    />
  </div>
  
  <div 
    v-if="error"
    :id="`${id}-error`"
    class="input-error"
    role="alert"
  >
    {{ error }}
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  prefixIcon: {
    type: [Object, Function],
    default: null
  },
  suffixIcon: {
    type: [Object, Function],
    default: null
  },
  onPrefixClick: {
    type: Function,
    default: null
  },
  onSuffixClick: {
    type: Function,
    default: null
  }
});

defineEmits(['update:modelValue']);

const inputRef = ref(null);
const focused = ref(false);
const id = `input-${crypto.randomUUID()}`;
</script>

<style scoped>
.base-input {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-md);
  transition: all 0.2s ease;
}

.base-input:hover:not(.base-input--disabled) {
  border-color: var(--color-gray-400);
}

.base-input--focused:not(.base-input--disabled) {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 2px var(--color-primary-100);
}

.base-input--error {
  border-color: var(--color-error-500);
}

.base-input--error:hover,
.base-input--error.base-input--focused {
  border-color: var(--color-error-600);
  box-shadow: 0 0 0 2px var(--color-error-100);
}

.base-input--disabled {
  background-color: var(--color-gray-50);
  cursor: not-allowed;
}

/* Sizes */
.base-input--sm {
  height: 32px;
  font-size: var(--font-size-sm);
}

.base-input--md {
  height: 40px;
  font-size: var(--font-size-base);
}

.base-input--lg {
  height: 48px;
  font-size: var(--font-size-lg);
}

/* Input Field */
.input-field {
  width: 100%;
  height: 100%;
  padding: 0 var(--spacing-sm);
  border: none;
  background: none;
  color: var(--color-gray-900);
  outline: none;
}

.input-field::placeholder {
  color: var(--color-gray-400);
}

.input-field:disabled {
  cursor: not-allowed;
}

/* Icons */
.input-icon {
  flex-shrink: 0;
  width: var(--font-size-lg);
  height: var(--font-size-lg);
  color: var(--color-gray-400);
}

.input-icon--prefix {
  margin-left: var(--spacing-sm);
}

.input-icon--suffix {
  margin-right: var(--spacing-sm);
}

.input-icon--clickable {
  cursor: pointer;
  transition: color 0.2s ease;
}

.input-icon--clickable:hover {
  color: var(--color-gray-600);
}

/* Error Message */
.input-error {
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-error-600);
}
</style> 