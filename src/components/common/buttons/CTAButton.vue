<template>
  <router-link :to="to" class="cta-button" :class="[variant]">
    <span class="button-content">
      {{ text }}
      <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <slot />
      </svg>
    </span>
  </router-link>
</template>

<script setup>
defineProps({
  to: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary'].includes(value)
  },
  defaultIcon: {
    type: Boolean,
    default: true
  }
});
</script>

<style scoped>
.cta-button {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-xl);
  border-radius: var(--border-radius-full);
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-base);
  background: rgba(255, 255, 255, 0.15);
  color: var(--color-text-inverse);
  border: 1px solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
}

.button-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.button-icon {
  width: 20px;
  height: 20px;
  transition: transform var(--transition-base);
}

/* Variants */
.cta-button.primary {
  background: rgba(255, 255, 255, 0.15);
  border-color: var(--color-primary-400);
}

.cta-button.primary:hover {
  background: var(--color-primary-500);
  border-color: var(--color-primary-400);
}

.cta-button.primary:hover .button-icon {
  transform: scale(1.2);
  color: white;
}

.cta-button.secondary {
  background: rgba(255, 255, 255, 0.15);
  border-color: var(--color-accent-400);
}

.cta-button.secondary:hover {
  background: var(--color-accent-500);
  border-color: var(--color-accent-400);
}

.cta-button.secondary:hover .button-icon {
  transform: scale(1.2);
  color: white;
}

/* Mobile styles */
@media (max-width: 768px) {
  .cta-button {
    width: 100%;
    justify-content: center;
  }
}
</style> 