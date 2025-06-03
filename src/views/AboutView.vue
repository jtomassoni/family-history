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
        <Transition name="section-transition">
          <div v-if="!isMobile || isProjectOpen" class="section-content" :class="{ open: isProjectOpen }">
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
        </Transition>
      </section>

      <!-- Contact Form Section -->
      <section class="contact-section card">
        <div class="section-header" :class="{ open: isContactOpen }" @click="toggleContact">
          <h2>Contact Us</h2>
          <div class="mobile-controls">
            <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <Transition name="section-transition">
          <div v-if="!isMobile || isContactOpen" class="section-content" :class="{ open: isContactOpen }">
            <form class="contact-form" @submit.prevent="handleSubmit">
              <div class="form-group">
                <label for="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  v-model="formData.name" 
                  required 
                  placeholder="Your name"
                />
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="formData.email" 
                  required 
                  placeholder="Your email"
                />
              </div>
              <div class="form-group">
                <label for="message">Message</label>
                <textarea 
                  id="message" 
                  v-model="formData.message" 
                  required 
                  placeholder="Your message"
                  rows="4"
                ></textarea>
              </div>
              <button type="submit" class="submit-button" :disabled="isSubmitting">
                {{ isSubmitting ? 'Sending...' : 'Send Message' }}
              </button>
            </form>
          </div>
        </Transition>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';

const isProjectOpen = ref(true);
const isContactOpen = ref(false);
const isMobile = ref(window.innerWidth <= 768);
const isSubmitting = ref(false);

const formData = ref({
  name: '',
  email: '',
  message: ''
});

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

const toggleProject = () => {
  if (isMobile.value) {
    if (!isProjectOpen.value) {
      isContactOpen.value = false;
    }
    isProjectOpen.value = !isProjectOpen.value;
  }
};

const toggleContact = () => {
  if (isMobile.value) {
    if (!isContactOpen.value) {
      isProjectOpen.value = false;
    }
    isContactOpen.value = !isContactOpen.value;
  }
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    await axios.post('/api/contact/', formData.value);
    formData.value = { name: '', email: '', message: '' };
    alert('Message sent successfully!');
  } catch (error) {
    alert('Failed to send message. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  box-sizing: border-box;
  padding: var(--spacing-xl);
  padding-top: calc(var(--header-height) + var(--spacing-xl));
  padding-bottom: calc(var(--footer-height) + var(--spacing-xl));
}

.content-grid {
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-xl);
  margin: 0 auto;
}

.card {
  background: var(--color-surface);
  border-radius: 24px;
  padding: var(--spacing-lg);
  width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
  overflow: hidden;
}

.card:hover {
  box-shadow: var(--shadow-md);
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

/* Contact Form Styles */
.contact-form {
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
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  transition: border-color var(--transition-base);
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-primary-400);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.submit-button {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-primary-500);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  transition: background-color var(--transition-base);
}

.submit-button:hover:not(:disabled) {
  background: var(--color-primary-600);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Mobile Styles */
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
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
  }

  .card {
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-md);
  }

  .card p {
    font-size: var(--font-size-sm);
    margin-bottom: var(--spacing-sm);
    line-height: 1.4;
  }

  .section-content {
    display: none;
    opacity: 0;
  }

  .section-content.open {
    display: flex;
    flex-direction: column;
    opacity: 1;
  }

  .form-group input,
  .form-group textarea {
    font-size: var(--font-size-sm);
  }

  .mobile-controls {
    display: flex !important;
  }

  .chevron {
    display: block !important;
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
}

@media (min-width: 769px) {
  .mobile-controls {
    display: none !important;
  }

  .section-content {
    display: flex !important;
    opacity: 1 !important;
    flex-direction: column;
  }

  .section-header {
    cursor: default;
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

.chevron {
  width: 16px;
  height: 16px;
  color: var(--color-primary-400);
  transition: transform 0.3s ease;
}

.section-header.open .chevron {
  transform: rotate(180deg);
}

/* Vue transition classes */
.section-transition-enter-active,
.section-transition-leave-active {
  transition: all 0.3s ease;
  max-height: 1000px;
  opacity: 1;
}

.section-transition-enter-from,
.section-transition-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}

.mobile-controls {
  display: none;
  align-items: center;
  gap: var(--spacing-sm);
}
</style>
