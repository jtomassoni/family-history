<template>
  <div 
    class="textarea-wrapper"
    :class="[
      `textarea-wrapper--${size}`,
      { 'textarea-wrapper--error': error },
      { 'textarea-wrapper--disabled': disabled }
    ]"
  >
    <label 
      v-if="label" 
      :for="id" 
      class="textarea-label"
    >
      {{ label }}
      <span v-if="required" class="textarea-required">*</span>
    </label>

    <div class="textarea-container">
      <textarea
        :id="id"
        ref="textareaRef"
        v-model="localValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :rows="rows"
        :maxlength="maxLength"
        :aria-describedby="getAriaDescribedBy"
        :aria-invalid="!!error"
        class="base-textarea"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
      ></textarea>

      <div 
        v-if="showCharCount" 
        class="char-count"
        :class="{ 'char-count--limit': isNearLimit }"
      >
        {{ currentLength }} / {{ maxLength }}
      </div>
    </div>

    <div 
      v-if="error" 
      :id="`${id}-error`" 
      class="textarea-error" 
      role="alert"
    >
      {{ error }}
    </div>

    <div 
      v-if="hint && !error" 
      :id="`${id}-hint`"
      class="textarea-hint"
    >
      {{ hint }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
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
  placeholder: {
    type: String,
    default: ''
  },
  rows: {
    type: Number,
    default: 3
  },
  maxLength: {
    type: Number,
    default: undefined
  },
  showCharCount: {
    type: Boolean,
    default: false
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

const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'input']);

const textareaRef = ref(null);
const isFocused = ref(false);

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const currentLength = computed(() => props.modelValue.length);

const isNearLimit = computed(() => {
  if (!props.maxLength) return false;
  return currentLength.value >= props.maxLength * 0.9;
});

const getAriaDescribedBy = computed(() => {
  const ids = [];
  if (props.error) ids.push(`${props.id}-error`);
  if (props.hint && !props.error) ids.push(`${props.id}-hint`);
  return ids.length ? ids.join(' ') : undefined;
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

// Method to focus the textarea programmatically
const focus = () => {
  textareaRef.value?.focus();
};

// Expose methods to parent components
defineExpose({ focus });
</script>

<style scoped>
.textarea-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  width: 100%;
}

.textarea-label {
  color: var(--color-gray-700);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
}

.textarea-required {
  color: var(--color-danger);
  margin-left: var(--spacing-xxs);
}

.textarea-container {
  position: relative;
  width: 100%;
}

.base-textarea {
  width: 100%;
  min-height: 80px;
  font-family: var(--font-family-base);
  background-color: var(--input-bg);
  border: var(--border-width-base) solid var(--input-border);
  border-radius: var(--input-border-radius);
  padding: var(--input-padding);
  color: var(--color-gray-900);
  transition: all var(--transition-fast);
  box-shadow: var(--input-shadow);
  resize: vertical;
  line-height: var(--line-height-relaxed);
}

.base-textarea::placeholder {
  color: var(--input-placeholder-color);
}

.base-textarea:hover:not(:disabled) {
  border-color: var(--color-gray-400);
}

.base-textarea:focus {
  outline: none;
  border-color: var(--input-border-focus);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
}

/* Size Variants */
.textarea-wrapper--sm .base-textarea {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
  min-height: 60px;
}

.textarea-wrapper--md .base-textarea {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-base);
  min-height: 80px;
}

.textarea-wrapper--lg .base-textarea {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-lg);
  min-height: 100px;
}

/* Character Count */
.char-count {
  position: absolute;
  right: var(--spacing-xs);
  bottom: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
  background-color: var(--color-white);
  padding: var(--spacing-xxs) var(--spacing-xs);
  border-radius: var(--border-radius-sm);
  pointer-events: none;
}

.char-count--limit {
  color: var(--color-danger);
  font-weight: var(--font-weight-medium);
}

/* Error State */
.textarea-wrapper--error .base-textarea {
  border-color: var(--color-danger);
}

.textarea-wrapper--error .base-textarea:focus {
  box-shadow: 0 0 0 3px rgba(var(--color-danger-rgb), 0.1);
}

.textarea-error {
  color: var(--color-danger);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xxs);
}

/* Disabled State */
.textarea-wrapper--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.textarea-wrapper--disabled .textarea-label {
  cursor: not-allowed;
}

.base-textarea:disabled {
  background-color: var(--color-gray-100);
  cursor: not-allowed;
  resize: none;
}

/* Hint Text */
.textarea-hint {
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xxs);
}

/* Touch Device Optimization */
@media (hover: none) {
  .base-textarea:hover:not(:disabled) {
    border-color: var(--input-border);
  }
}

/* High Contrast Mode */
@media (forced-colors: active) {
  .base-textarea {
    border: var(--border-width-thick) solid ButtonText;
  }
}
</style> 