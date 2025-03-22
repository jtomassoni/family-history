<template>
  <div class="about-page">
    <div class="content-grid">
      <!-- Project Overview Section -->
      <section class="project-overview card">
        <div class="section-header" :class="{ open: isProjectOpen }" @click="toggleProject">
          <h2>About This Project</h2>
          <div class="mobile-controls">
            <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div v-show="!isMobile || isProjectOpen" class="section-content">
          <p>The Tomassoni Family History website preserves our family's heritage through photos, stories, and memories that define our journey.</p>
          <div class="features">
            <div class="feature">
              <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div class="feature-content">
                <h3>Photo Gallery</h3>
                <p>Explore our visual legacy</p>
              </div>
            </div>
            <div class="feature">
              <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div class="feature-content">
                <h3>Family Stories</h3>
                <p>Discover our narratives</p>
              </div>
            </div>
            <div class="feature">
              <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div class="feature-content">
                <h3>Family Tree</h3>
                <p>Map our connections</p>
              </div>
            </div>
          </div>
          <div class="tech-stack">
            <h4>Built with:</h4>
            <ul>
              <li>Vue.js</li>
              <li>Modern CSS</li>
              <li>Interactive Visualizations</li>
              <li>Responsive Design</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section class="contact-section card">
        <div class="section-header" :class="{ open: isContactOpen }" @click="toggleContact">
          <h2>Get in Touch</h2>
          <div class="mobile-controls">
            <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div v-show="!isMobile || isContactOpen" class="section-content">
          <p class="contact-intro">Share your stories with us. Photo uploads coming soon!</p>
          <form class="contact-form" @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="name">Name</label>
              <input 
                type="text" 
                id="name" 
                v-model="formData.name" 
                required
                placeholder="Your name"
              >
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                v-model="formData.email" 
                required
                placeholder="your.email@example.com"
              >
            </div>
            <div class="form-group">
              <label for="message">Message</label>
              <textarea 
                id="message" 
                v-model="formData.message" 
                required
                placeholder="Your message here..."
              ></textarea>
            </div>
            <button type="submit" class="submit-button" disabled>
              Coming Soon
            </button>
          </form>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const formData = ref({
  name: '',
  email: '',
  message: ''
});

const isSubmitting = ref(false);
const isProjectOpen = ref(true);
const isContactOpen = ref(false);
const isMobile = ref(window.innerWidth <= 768);

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

const toggleProject = () => {
  if (isMobile.value) {
    isProjectOpen.value = !isProjectOpen.value;
    if (isProjectOpen.value) {
      isContactOpen.value = false;
    }
  }
};

const toggleContact = () => {
  if (isMobile.value) {
    isContactOpen.value = !isContactOpen.value;
    if (isContactOpen.value) {
      isProjectOpen.value = false;
    }
  }
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    // TODO: Implement form submission logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Message sent successfully!');
    formData.value = { name: '', email: '', message: '' };
  } catch (error) {
    alert('Failed to send message. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: var(--spacing-xl);
}

.content-grid {
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-xl);
  margin: 0 auto;
}

.content-grid::-webkit-scrollbar {
  width: 8px;
}

.content-grid::-webkit-scrollbar-track {
  background: var(--color-surface);
  border-radius: var(--border-radius-full);
}

.content-grid::-webkit-scrollbar-thumb {
  background: var(--color-surface-hover);
  border-radius: var(--border-radius-full);
}

.card {
  background: var(--color-surface);
  border-radius: var(--border-radius-xl);
  padding: var(--spacing-lg);
  width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: none;
  box-shadow: var(--shadow-sm);
}

.card h2 {
  font-family: var(--font-family-display);
  font-size: var(--font-size-xl);
  color: var(--color-primary-500);
  margin-bottom: var(--spacing-md);
  position: relative;
  display: inline-block;
}

.card p {
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
  line-height: 1.5;
  font-size: var(--font-size-base);
}

/* Features Grid */
.features {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
}

.feature {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--color-surface-hover);
  border-radius: var(--border-radius-lg);
  text-align: left;
}

.feature-icon {
  width: 16px;
  height: 16px;
  color: var(--color-primary-400);
}

.feature-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.feature h3 {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  margin: 0;
}

.feature p {
  font-size: var(--font-size-xs);
  color: var(--color-primary-300);
  margin: 0;
}

/* Contact Form */
.contact-intro {
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
}

.contact-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-group label {
  font-weight: 500;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
}

.form-group input,
.form-group textarea {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-surface-hover);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.form-group textarea {
  height: 60px;
}

.submit-button {
  margin-top: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-lg);
  background: var(--color-primary-500);
  color: white;
  border: none;
  border-radius: var(--border-radius-full);
  font-weight: 600;
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-base);
}

.submit-button:hover:not(:disabled) {
  background: var(--color-primary-600);
  transform: none;
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--color-surface-hover);
  color: var(--color-text-secondary);
}

/* Tech Stack */
.tech-stack {
  margin-top: auto;
  padding-top: var(--spacing-lg);
}

.tech-stack h4 {
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-xs);
}

.tech-stack ul {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  list-style: none;
  padding: 0;
  margin: 0;
}

.tech-stack li {
  background: var(--color-surface-hover);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xs);
  color: var(--color-primary-300);
}

/* Responsive Design */
@media (max-width: 768px) {
  .about-page {
    position: fixed;
    top: var(--header-height);
    bottom: var(--footer-height);
    left: 0;
    right: 0;
    overflow-y: auto;
    padding: var(--spacing-md);
  }

  .content-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
    width: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: var(--spacing-lg);
  }

  .card {
    border-radius: var(--border-radius-xl);
  }

  .card p {
    font-size: var(--font-size-sm);
    margin-bottom: var(--spacing-sm);
    line-height: 1.4;
  }

  .section-content.open {
    display: flex;
    flex-direction: column;
    padding-top: var(--spacing-xs);
  }

  .section-header {
    cursor: pointer;
    padding: var(--spacing-xs) var(--spacing-md);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .section-header h2 {
    font-size: var(--font-size-base);
    margin: 0;
  }

  .contact-intro {
    font-size: var(--font-size-sm);
    margin-bottom: var(--spacing-xs);
  }

  .form-group {
    gap: calc(var(--spacing-xs) / 2);
  }

  .form-group label {
    font-size: var(--font-size-sm);
  }

  .form-group input,
  .form-group textarea {
    padding: var(--spacing-xs) var(--spacing-sm);
  }

  .form-group textarea {
    height: 50px;
  }

  .submit-button {
    margin-top: var(--spacing-xs);
  }

  .chevron {
    width: 16px;
    height: 16px;
  }
}

@media (min-width: 769px) {
  .mobile-controls {
    display: none !important;
  }

  .section-content {
    display: block !important;
  }
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border-radius: var(--border-radius-lg);
  -webkit-tap-highlight-color: transparent;
  cursor: default;
  margin: 0;
  padding: 0;
}

.section-header svg {
  width: 24px;
  height: 24px;
  color: var(--color-primary-400);
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  display: none;
}

.section-header.open svg {
  transform: rotate(180deg);
}

.section-header h2 {
  font-size: var(--font-size-xl);
  margin: 0;
}

.section-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Transition styles */
.collapse-enter-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 1000px; /* Arbitrary large value */
}

.collapse-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 0;
}

.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-8px);
}

.collapse-enter-to,
.collapse-leave-from {
  max-height: 1000px;
  opacity: 1;
  transform: translateY(0);
}

.mobile-controls {
  display: none;
  align-items: center;
  gap: var(--spacing-sm);
}

.chevron {
  width: 20px;
  height: 20px;
  color: var(--color-primary-400);
  transition: transform 0.3s ease;
}

.section-header.open .chevron {
  transform: rotate(180deg);
}

.mobile-indicator {
  font-size: var(--font-size-sm);
  color: var(--color-primary-400);
}
</style>
