<template>
  <div class="under-construction-overlay">
    <div class="content">
      <div class="icons-wrapper">
        <div class="icon-container">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
          </svg>
        </div>
      </div>
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
      <div class="buttons-container">
        <CTAButton to="/" text="Return Home" variant="primary">
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </CTAButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import CTAButton from './buttons/CTAButton.vue';

defineProps({
  title: {
    type: String,
    default: 'Coming Soon'
  },
  message: {
    type: String,
    default: 'We\'re currently working on this section. Check back soon!'
  }
});
</script>

<style scoped>
.under-construction-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.97);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-index-overlay);
  padding: var(--spacing-xl);
}

.content {
  text-align: center;
  max-width: 500px;
  animation: fadeIn 0.3s ease-out;
}

.icons-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-xl);
}

.icon-container {
  background: rgba(255, 255, 255, 0.1);
  width: 180px;
  height: 180px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.icon {
  width: 120px;
  height: 120px;
  position: absolute;
  stroke-width: 0.75;
  color: var(--color-primary-500);
  stroke: currentColor;
}

h2 {
  font-family: var(--font-family-display);
  font-size: var(--font-size-3xl);
  color: var(--color-primary-200);
  margin-bottom: var(--spacing-md);
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

p {
  color: white;
  font-size: var(--font-size-lg);
  line-height: 1.6;
  margin-bottom: var(--spacing-xl);
  opacity: 0.95;
}

.buttons-container {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-xl);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile styles */
@media (max-width: 768px) {
  .icon-container {
    width: 140px;
    height: 140px;
  }

  .icon {
    width: 90px;
    height: 90px;
  }
}
</style>