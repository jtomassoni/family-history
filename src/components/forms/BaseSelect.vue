<template>
  <div 
    class="base-select"
    :class="{
      'base-select--disabled': disabled,
      'base-select--error': error,
      'base-select--focused': focused,
      [`base-select--${size}`]: size
    }"
  >
    <select
      ref="selectRef"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      v-bind="$attrs"
      :disabled="disabled"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${id}-error` : undefined"
      @focus="focused = true"
      @blur="focused = false"
      class="select-field"
    >
      <option 
        v-if="placeholder"
        value=""
        disabled
        selected
      >
        {{ placeholder }}
      </option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

    <ChevronDownIcon class="select-icon" />
  </div>
  
  <div 
    v-if="error"
    :id="`${id}-error`"
    class="select-error"
    role="alert"
  >
    {{ error }}
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ChevronDownIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    required: true,
    validator: (options) => options.every(option => 
      'value' in option && 'label' in option
    )
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
});

defineEmits(['update:modelValue']);

const selectRef = ref(null);
const focused = ref(false);
const id = `select-${crypto.randomUUID()}`;
</script>

<style scoped>
.base-select {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-md);
  transition: all 0.2s ease;
}

.base-select:hover:not(.base-select--disabled) {
  border-color: var(--color-gray-400);
}

.base-select--focused:not(.base-select--disabled) {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 2px var(--color-primary-100);
}

.base-select--error {
  border-color: var(--color-error-500);
}

.base-select--error:hover,
.base-select--error.base-select--focused {
  border-color: var(--color-error-600);
  box-shadow: 0 0 0 2px var(--color-error-100);
}

.base-select--disabled {
  background-color: var(--color-gray-50);
  cursor: not-allowed;
}

/* Sizes */
.base-select--sm {
  height: 32px;
  font-size: var(--font-size-sm);
}

.base-select--md {
  height: 40px;
  font-size: var(--font-size-base);
}

.base-select--lg {
  height: 48px;
  font-size: var(--font-size-lg);
}

/* Select Field */
.select-field {
  width: 100%;
  height: 100%;
  padding: 0 calc(var(--spacing-lg) + var(--spacing-sm)) 0 var(--spacing-sm);
  border: none;
  background: none;
  color: var(--color-gray-900);
  outline: none;
  appearance: none;
  cursor: pointer;
}

.select-field:disabled {
  cursor: not-allowed;
}

.select-field option {
  color: var(--color-gray-900);
  background-color: var(--color-white);
}

.select-field option:disabled {
  color: var(--color-gray-400);
}

/* Icon */
.select-icon {
  position: absolute;
  right: var(--spacing-sm);
  width: var(--font-size-lg);
  height: var(--font-size-lg);
  color: var(--color-gray-400);
  pointer-events: none;
  transition: transform 0.2s ease;
}

.base-select--focused .select-icon {
  transform: rotate(180deg);
}

/* Error Message */
.select-error {
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-error-600);
}
</style> 