<template>
  <div class="home-view">
    <div class="hero">
      <h1 class="hero-title">
        <span class="title-main">Welcome to</span>
        <span class="title-family">TOMASSONI</span>
        <span class="title-sub">Family History</span>
      </h1>
      <p class="hero-description">
        Explore our rich family heritage through stories, photos, and memories. Discover the journey of generations that shaped who we are today.
      </p>
      <p class="construction-note">
        Many sections of our site are currently under construction. For now, please enjoy browsing through our photo gallery!
      </p>
      <div class="cta-container">
        <CTAButton to="/gallery" text="Explore Gallery" variant="primary">
          <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </CTAButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import CTAButton from '../components/common/buttons/CTAButton.vue';

// Using scoped styles instead of external CSS file
</script>

<style scoped>
.home-view {
  position: fixed;
  top: var(--header-height);
  left: 0;
  right: 0;
  bottom: var(--footer-height);
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("/images/background.jpeg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
  width: 100vw;
}

.home-view::before {
  content: '';
  position: fixed;
  top: var(--header-height);
  left: 0;
  right: 0;
  bottom: var(--footer-height);
  background: rgba(0, 0, 0, 0.65);
  z-index: 1;
  width: 100vw;
}

.hero {
  text-align: center;
  max-width: var(--max-width-md);
  width: 90%;
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-xl);
  position: relative;
  z-index: 2;
}

.hero-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
}

.title-main {
  font-family: var(--font-family-display);
  font-size: var(--font-size-xl);
  font-weight: 500;
  color: var(--color-text-secondary);
}

.title-family {
  font-family: var(--font-family-display);
  font-size: calc(var(--font-size-2xl) * 1.5);
  font-weight: 800;
  color: var(--color-text-primary);
  letter-spacing: 0.05em;
  line-height: 1;
  text-transform: uppercase;
}

.title-sub {
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
  font-weight: 500;
  color: var(--color-text-secondary);
}

.hero-description {
  font-size: var(--font-size-lg);
  line-height: 1.6;
  max-width: 600px;
  color: var(--color-text-secondary);
}

.construction-note {
  font-size: var(--font-size-base);
  color: var(--color-accent-200);
  font-style: italic;
  max-width: 500px;
  margin-bottom: var(--spacing-md);
}

.cta-container {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

/* Mobile styles */
@media (max-width: 768px) {
  .home-view {
    align-items: center;
  }

  .hero {
    padding: var(--spacing-lg);
    gap: var(--spacing-lg);
    width: 100%;
    max-width: 100%;
  }

  .hero-description {
    font-size: var(--font-size-base);
    padding: 0 var(--spacing-md);
  }

  .construction-note {
    font-size: var(--font-size-sm);
    padding: 0 var(--spacing-md);
  }

  .cta-container {
    flex-direction: column;
    align-items: center;
    width: 90%;
    max-width: 400px;
  }

  .cta-button {
    width: 100%;
    justify-content: center;
    padding: var(--spacing-sm) var(--spacing-xl);
  }

  .title-main {
    font-size: var(--font-size-lg);
  }

  .title-family {
    font-size: calc(var(--font-size-xl) * 1.5);
  }

  .title-sub {
    font-size: var(--font-size-base);
  }
}

/* Landscape mobile styles */
@media (max-width: 926px) and (orientation: landscape) {
  .hero {
    padding: var(--spacing-md);
    gap: var(--spacing-sm);
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas: 
      "title description"
      "title cta";
    align-items: center;
    text-align: left;
    max-width: 900px;
  }

  .hero-title {
    grid-area: title;
    align-items: flex-start;
    padding-right: var(--spacing-xl);
  }

  .hero-description {
    grid-area: description;
    padding: 0;
    font-size: var(--font-size-sm);
  }

  .construction-note {
    grid-area: description;
    font-size: var(--font-size-xs);
    padding: 0;
    margin-bottom: 0;
  }

  .cta-container {
    grid-area: cta;
    flex-direction: row;
    width: 100%;
    margin-top: 0;
  }

  .cta-button {
    padding: var(--spacing-xs) var(--spacing-md);
    font-size: var(--font-size-sm);
  }

  .title-main {
    font-size: var(--font-size-base);
  }

  .title-family {
    font-size: calc(var(--font-size-lg) * 1.5);
  }

  .title-sub {
    font-size: var(--font-size-sm);
  }

  .button-icon {
    width: 16px;
    height: 16px;
  }
}
</style>
