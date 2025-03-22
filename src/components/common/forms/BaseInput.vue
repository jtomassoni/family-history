<template>
  <div 
    class="input-wrapper"
    :class="[
      `input-wrapper--${size}`,
      { 'input-wrapper--error': error },
      { 'input-wrapper--disabled': disabled }
    ]"
  >
    <label 
      v-if="label" 
      :for="id" 
      class="input-label"
    >
      {{ label }}
      <span v-if="required" class="input-required">*</span>
    </label>

    <div class="input-container">
      <slot name="prefix"></slot>
      
      <input
        :id="id"
        ref="inputRef"
        v-model="localValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :autocomplete="autocomplete"
        :aria-describedby="error ? `${id}-error` : undefined"
        :aria-invalid="!!error"
        class="base-input"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
      />

      <slot name="suffix"></slot>
    </div>

    <div 
      v-if="error" 
      :id="`${id}-error`" 
      class="input-error" 
      role="alert"
    >
      {{ error }}
    </div>

    <div 
      v-if="hint && !error" 
      class="input-hint"
    >
      {{ hint }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
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
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  autocomplete: {
    type: String,
    default: 'off'
  }
});

const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'input']);

const inputRef = ref(null);
const isFocused = ref(false);

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const handleFocus = (event) => {
  isFocused.value = true;
  emit('focus', event);
};

const handleBlur = (event) => {
  isFocused.value = false;
  emit('blur', event);
};

const handleInput = (event) => {
  emit('input', event);
};

// Method to focus the input programmatically
const focus = () => {
  inputRef.value?.focus();
};

// Expose methods to parent components
defineExpose({ focus });
</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  width: 100%;
}

.input-label {
  color: var(--color-gray-700);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
}

.input-required {
  color: var(--color-danger);
  margin-left: var(--spacing-xxs);
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  width: 100%;
}

.base-input {
  width: 100%;
  font-family: var(--font-family-base);
  background-color: var(--input-bg);
  border: var(--border-width-base) solid var(--input-border);
  border-radius: var(--input-border-radius);
  padding: var(--input-padding);
  color: var(--color-gray-900);
  transition: all var(--transition-fast);
  box-shadow: var(--input-shadow);
}

.base-input::placeholder {
  color: var(--input-placeholder-color);
}

.base-input:hover:not(:disabled) {
  border-color: var(--color-gray-400);
}

.base-input:focus {
  outline: none;
  border-color: var(--input-border-focus);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
}

/* Size Variants */
.input-wrapper--sm .base-input {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
}

.input-wrapper--md .base-input {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-base);
}

.input-wrapper--lg .base-input {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-lg);
}

/* Error State */
.input-wrapper--error .base-input {
  border-color: var(--color-danger);
}

.input-wrapper--error .base-input:focus {
  box-shadow: 0 0 0 3px rgba(var(--color-danger-rgb), 0.1);
}

.input-error {
  color: var(--color-danger);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xxs);
}

/* Disabled State */
.input-wrapper--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input-wrapper--disabled .input-label {
  cursor: not-allowed;
}

.base-input:disabled {
  background-color: var(--color-gray-100);
  cursor: not-allowed;
}

/* Hint Text */
.input-hint {
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xxs);
}

/* Autofill Styles */
.base-input:-webkit-autofill,
.base-input:-webkit-autofill:hover,
.base-input:-webkit-autofill:focus {
  -webkit-text-fill-color: var(--color-gray-900);
  -webkit-box-shadow: 0 0 0px 1000px var(--input-bg) inset;
  transition: background-color 5000s ease-in-out 0s;
}

/* Touch Device Optimization */
@media (hover: none) {
  .base-input:hover:not(:disabled) {
    border-color: var(--input-border);
  }
}
</style> 