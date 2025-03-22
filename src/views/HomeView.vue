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
      <div class="cta-container">
        <router-link to="/gallery" class="cta-button primary">
          <span>Explore Gallery</span>
          <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </router-link>
        <router-link to="/stories" class="cta-button secondary">
          <span>Read Stories</span>
          <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
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
  background: url("https://i2.pickpik.com/photos/614/325/207/tuscany-villa-italian-nature-preview.jpg");
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

.cta-container {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.cta-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius-full);
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-base);
}

.cta-button.primary {
  background: var(--color-primary-600);
  color: var(--color-surface);
}

.cta-button.secondary {
  background: transparent;
  color: var(--color-primary-600);
  border: 2px solid var(--color-primary-600);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.button-icon {
  width: 20px;
  height: 20px;
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
