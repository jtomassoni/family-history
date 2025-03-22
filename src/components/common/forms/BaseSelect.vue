<template>
  <div 
    class="select-wrapper"
    :class="[
      `select-wrapper--${size}`,
      { 'select-wrapper--error': error },
      { 'select-wrapper--disabled': disabled }
    ]"
  >
    <label 
      v-if="label" 
      :for="id" 
      class="select-label"
    >
      {{ label }}
      <span v-if="required" class="select-required">*</span>
    </label>

    <div class="select-container">
      <select
        :id="id"
        ref="selectRef"
        v-model="localValue"
        :disabled="disabled"
        :required="required"
        :aria-describedby="error ? `${id}-error` : undefined"
        :aria-invalid="!!error"
        class="base-select"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
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
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>

      <ChevronDownIcon class="select-icon" aria-hidden="true" />
    </div>

    <div 
      v-if="error" 
      :id="`${id}-error`" 
      class="select-error" 
      role="alert"
    >
      {{ error }}
    </div>

    <div 
      v-if="hint && !error" 
      class="select-hint"
    >
      {{ hint }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ChevronDownIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  id: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(option => 
        typeof option === 'object' && 
        'value' in option && 
        'label' in option
      );
    }
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Select an option'
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
  }
});

const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'change']);

const selectRef = ref(null);
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

const handleChange = (event) => {
  emit('change', event);
};

// Method to focus the select programmatically
const focus = () => {
  selectRef.value?.focus();
};

// Expose methods to parent components
defineExpose({ focus });
</script>

<style scoped>
.select-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  width: 100%;
}

.select-label {
  color: var(--color-gray-700);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
}

.select-required {
  color: var(--color-danger);
  margin-left: var(--spacing-xxs);
}

.select-container {
  position: relative;
  width: 100%;
}

.base-select {
  width: 100%;
  font-family: var(--font-family-base);
  background-color: var(--input-bg);
  border: var(--border-width-base) solid var(--input-border);
  border-radius: var(--input-border-radius);
  padding: var(--input-padding);
  padding-right: calc(var(--spacing-xl) + var(--spacing-xs));
  color: var(--color-gray-900);
  transition: all var(--transition-fast);
  box-shadow: var(--input-shadow);
  appearance: none;
  cursor: pointer;
}

.select-icon {
  position: absolute;
  right: var(--spacing-sm);
  top: 50%;
  transform: translateY(-50%);
  width: var(--font-size-base);
  height: var(--font-size-base);
  color: var(--color-gray-500);
  pointer-events: none;
  transition: transform var(--transition-fast);
}

.base-select:hover:not(:disabled) {
  border-color: var(--color-gray-400);
}

.base-select:focus {
  outline: none;
  border-color: var(--input-border-focus);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
}

.base-select:focus + .select-icon {
  transform: translateY(-50%) rotate(180deg);
  color: var(--color-primary);
}

/* Size Variants */
.select-wrapper--sm .base-select {
  padding: var(--spacing-xs) var(--spacing-sm);
  padding-right: calc(var(--spacing-lg) + var(--spacing-xs));
  font-size: var(--font-size-sm);
}

.select-wrapper--md .base-select {
  padding: var(--spacing-sm) var(--spacing-md);
  padding-right: calc(var(--spacing-xl) + var(--spacing-xs));
  font-size: var(--font-size-base);
}

.select-wrapper--lg .base-select {
  padding: var(--spacing-md) var(--spacing-lg);
  padding-right: calc(var(--spacing-2xl) + var(--spacing-xs));
  font-size: var(--font-size-lg);
}

/* Error State */
.select-wrapper--error .base-select {
  border-color: var(--color-danger);
}

.select-wrapper--error .base-select:focus {
  box-shadow: 0 0 0 3px rgba(var(--color-danger-rgb), 0.1);
}

.select-error {
  color: var(--color-danger);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xxs);
}

/* Disabled State */
.select-wrapper--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.select-wrapper--disabled .select-label {
  cursor: not-allowed;
}

.base-select:disabled {
  background-color: var(--color-gray-100);
  cursor: not-allowed;
}

/* Hint Text */
.select-hint {
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xxs);
}

/* Touch Device Optimization */
@media (hover: none) {
  .base-select:hover:not(:disabled) {
    border-color: var(--input-border);
  }
}

/* High Contrast Mode */
@media (forced-colors: active) {
  .base-select {
    border: var(--border-width-thick) solid ButtonText;
  }
  
  .select-icon {
    forced-color-adjust: none;
    color: ButtonText;
  }
}
</style> 