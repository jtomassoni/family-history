<template>
  <div 
    class="card"
    :class="[
      `card--${variant}`,
      { 'card--hoverable': hoverable },
      { 'card--selected': selected },
      { 'card--loading': loading }
    ]"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space="handleClick"
  >
    <!-- Card Media -->
    <div v-if="$slots.media" class="card__media">
      <slot name="media"></slot>
    </div>

    <!-- Card Header -->
    <div v-if="$slots.header" class="card__header">
      <slot name="header"></slot>
    </div>

    <!-- Card Content -->
    <div 
      class="card__content"
      :class="{ 'card__content--no-padding': noPadding }"
    >
      <slot></slot>
    </div>

    <!-- Card Footer -->
    <div v-if="$slots.footer" class="card__footer">
      <slot name="footer"></slot>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="card__loading-overlay" role="status">
      <div class="card__loading-spinner"></div>
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'outlined', 'elevated'].includes(value)
  },
  hoverable: {
    type: Boolean,
    default: false
  },
  selected: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  },
  noPadding: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click']);

const handleClick = (event) => {
  if (props.clickable && !props.loading) {
    emit('click', event);
  }
};
</script>

<style scoped>
.card {
  position: relative;
  background-color: var(--card-bg);
  border-radius: var(--card-border-radius);
  overflow: hidden;
  transition: all var(--transition-base);
}

/* Variants */
.card--default {
  border: var(--border-width-base) solid var(--card-border);
  box-shadow: var(--card-shadow);
}

.card--outlined {
  border: var(--border-width-base) solid var(--card-border);
}

.card--elevated {
  border: none;
  box-shadow: var(--shadow-lg);
}

/* Media Section */
.card__media {
  position: relative;
  width: 100%;
}

.card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Header Section */
.card__header {
  padding: var(--card-padding);
  border-bottom: var(--border-width-base) solid var(--card-border);
}

/* Content Section */
.card__content {
  padding: var(--card-padding);
}

.card__content--no-padding {
  padding: 0;
}

/* Footer Section */
.card__footer {
  padding: var(--card-padding);
  border-top: var(--border-width-base) solid var(--card-border);
}

/* Interactive States */
.card--hoverable {
  cursor: pointer;
}

.card--hoverable:hover:not(.card--loading) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

.card--hoverable:active:not(.card--loading) {
  transform: translateY(0);
}

.card--selected {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary);
}

/* Loading State */
.card--loading {
  cursor: wait;
  pointer-events: none;
}

.card__loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-index-above);
}

.card__loading-spinner {
  width: var(--font-size-xl);
  height: var(--font-size-xl);
  border: var(--border-width-thick) solid var(--color-gray-200);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: card-spin 1s linear infinite;
}

@keyframes card-spin {
  to {
    transform: rotate(360deg);
  }
}

/* Focus State */
.card[tabindex]:focus-visible {
  outline: var(--border-width-thick) solid var(--color-primary);
  outline-offset: 2px;
}

/* Screen Reader Only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Touch Device Optimization */
@media (hover: none) {
  .card--hoverable:hover:not(.card--loading) {
    transform: none;
    box-shadow: var(--card-shadow);
  }

  .card--hoverable:active:not(.card--loading) {
    transform: scale(0.98);
  }
}

/* High Contrast Mode */
@media (forced-colors: active) {
  .card {
    border: var(--border-width-thick) solid ButtonText;
  }

  .card--selected {
    border-color: Highlight;
  }

  .card__loading-spinner {
    border-color: ButtonText;
    border-top-color: Highlight;
  }
}
</style> 