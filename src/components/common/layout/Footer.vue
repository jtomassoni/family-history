<template>
  <footer class="site-footer">
    <div class="footer-content">
      <!-- Main Footer Content -->
      <div class="footer-sections">
        <!-- About Section -->
        <div class="footer-section">
          <h3 class="section-title">About</h3>
          <p class="section-text">{{ about }}</p>
        </div>

        <!-- Quick Links -->
        <div class="footer-section">
          <h3 class="section-title">Quick Links</h3>
          <ul class="footer-links">
            <li v-for="link in quickLinks" :key="link.path">
              <router-link :to="link.path">{{ link.label }}</router-link>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="footer-section">
          <h3 class="section-title">Contact</h3>
          <ul class="contact-list">
            <li>
              <EnvelopeIcon class="contact-icon" />
              <a :href="'mailto:' + contactEmail">{{ contactEmail }}</a>
            </li>
            <li v-if="phone">
              <PhoneIcon class="contact-icon" />
              <a :href="'tel:' + phone">{{ phone }}</a>
            </li>
          </ul>
        </div>

        <!-- Social Links -->
        <div class="footer-section">
          <h3 class="section-title">Follow Us</h3>
          <div class="social-links">
            <CustomButton
              v-for="social in socialLinks"
              :key="social.name"
              variant="text"
              size="sm"
              :aria-label="social.name"
              @click="openSocialLink(social.url)"
              class="social-button"
            >
              <component :is="social.icon" class="social-icon" />
            </CustomButton>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom">
        <p class="copyright">&copy; {{ currentYear }} {{ siteName }}. All rights reserved.</p>
        <div class="bottom-links">
          <router-link to="/privacy">Privacy Policy</router-link>
          <router-link to="/terms">Terms of Service</router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';
import {
  EnvelopeIcon,
  PhoneIcon,
} from '@heroicons/vue/24/outline';
import CustomButton from '../buttons/CustomButton.vue';

const props = defineProps({
  siteName: {
    type: String,
    required: true
  },
  about: {
    type: String,
    default: 'Discover and preserve your family history with our comprehensive genealogy platform.'
  },
  contactEmail: {
    type: String,
    default: 'contact@familyhistory.com'
  },
  phone: {
    type: String,
    default: ''
  }
});

const currentYear = computed(() => new Date().getFullYear());

const quickLinks = [
  { path: '/', label: 'Home' },
  { path: '/family-tree', label: 'Family Tree' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/stories', label: 'Stories' },
  { path: '/about', label: 'About' }
];

const socialLinks = [
  {
    name: 'Facebook',
    url: 'https://facebook.com',
    icon: 'FacebookIcon'
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com',
    icon: 'TwitterIcon'
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com',
    icon: 'InstagramIcon'
  }
];

const openSocialLink = (url) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};
</script>

<style scoped>
.site-footer {
  background: var(--footer-bg);
  color: var(--footer-text);
  padding: var(--spacing-xl) 0;
  margin-top: auto;
}

.footer-content {
  max-width: var(--content-width-xl);
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.footer-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: bold;
  margin-bottom: var(--spacing-sm);
  color: var(--footer-heading);
}

.section-text {
  line-height: var(--line-height-relaxed);
  opacity: 0.9;
}

.footer-links,
.contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.footer-links a,
.contact-list a {
  color: var(--footer-link);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.footer-links a:hover,
.contact-list a:hover {
  color: var(--footer-link-hover);
}

.contact-list li {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.contact-icon {
  width: var(--font-size-base);
  height: var(--font-size-base);
  color: var(--footer-icon);
}

.social-links {
  display: flex;
  gap: var(--spacing-sm);
}

.social-button {
  padding: var(--spacing-xs);
  border-radius: 50%;
  transition: background-color var(--transition-fast);
}

.social-icon {
  width: var(--font-size-xl);
  height: var(--font-size-xl);
  color: var(--footer-icon);
}

.footer-bottom {
  border-top: var(--border-width-base) solid var(--footer-border);
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.copyright {
  color: var(--footer-text-muted);
  font-size: var(--font-size-sm);
}

.bottom-links {
  display: flex;
  gap: var(--spacing-md);
}

.bottom-links a {
  color: var(--footer-text-muted);
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: color var(--transition-fast);
}

.bottom-links a:hover {
  color: var(--footer-link-hover);
}

@media (max-width: var(--breakpoint-md)) {
  .footer-sections {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }

  .bottom-links {
    justify-content: center;
  }
}
</style> 