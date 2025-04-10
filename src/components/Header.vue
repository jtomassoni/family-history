<template>
  <header class="header">
    <div class="header-content">
      <!-- Help Button (Mobile) -->
      <button class="help-button mobile-help" :class="{ active: isHelpActive }" @click="$emit('help')" aria-label="Help">
        <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 17v.01" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- Logo/Site Title -->
      <router-link to="/" class="site-title">
        <h1 class="title">
          <span class="site-name">{{ siteTitle }}</span>
          <span class="site-subtitle">Family History</span>
        </h1>
      </router-link>

      <!-- Desktop Navigation -->
      <nav class="desktop-nav">
        <ul class="nav-list">
          <li v-for="item in navItems" :key="item.path" class="nav-item">
            <router-link 
              :to="item.path" 
              :class="{ 'current': isCurrentRoute(item.path) }"
              class="nav-link"
            >
              {{ item.label }}
              <span class="nav-indicator"></span>
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- Header Right Section -->
      <div class="header-right">
        <!-- Help Button (Desktop) -->
        <button class="help-button" :class="{ active: isHelpActive }" @click="$emit('help')" aria-label="Help">
          <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 17v.01" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <!-- Desktop Auth/Profile Button -->
        <div class="profile-dropdown-container" v-if="isAuthenticated">
          <button 
            class="profile-button" 
            @click="toggleProfileDropdown" 
            aria-label="Profile Menu"
            :aria-expanded="isProfileDropdownOpen"
          >
            <div v-if="user?.picture" class="avatar-mini">
              <img :src="getProfilePictureUrl(user.picture)" alt="Profile" @error="handleImageError" />
            </div>
            <div v-else class="avatar-mini" :class="{ 'admin-avatar': isAdmin }">
              <span class="avatar-initials">{{ isAdmin ? 'A' : userInitials }}</span>
            </div>
            <svg class="dropdown-arrow" viewBox="0 0 24 24" :class="{ 'open': isProfileDropdownOpen }">
              <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          
          <div v-if="isProfileDropdownOpen" class="profile-dropdown">
            <div class="dropdown-header">
              <div class="user-info">
                <div v-if="user?.picture" class="dropdown-avatar">
                  <img :src="getProfilePictureUrl(user.picture)" alt="Profile" @error="handleImageError" />
                </div>
                <div v-else class="dropdown-avatar" :class="{ 'admin-avatar': isAdmin }">
                  <span class="avatar-initials">{{ isAdmin ? 'A' : userInitials }}</span>
                </div>
                <div class="user-details">
                  <p class="user-name">{{ user.full_name || 'User' }}</p>
                  <p class="user-email">{{ user.email }}</p>
                </div>
              </div>
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-content">
              <router-link to="/profile" class="dropdown-item" @click="closeProfileDropdown">
                <svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>My Profile</span>
              </router-link>
              <router-link v-if="isAdmin" to="/admin" class="dropdown-item" @click="closeProfileDropdown">
                <svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
                <span>Django Admin Dashboard</span>
              </router-link>
              <router-link to="/settings" class="dropdown-item" @click="closeProfileDropdown">
                <svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                <span>Settings</span>
              </router-link>
            </div>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item logout-item" @click="handleLogout">
              <svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
        <button v-else class="auth-button" @click="$emit('auth')" aria-label="Login">
          <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10 17l5-5-5-5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15 12H3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Login</span>
        </button>

        <!-- Mobile Menu Button -->
        <button class="menu-button" @click="$emit('toggle-mobile-menu')" aria-label="Menu">
          <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12h18M3 6h18M3 18h18" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useNavigation } from '../composables/useNavigation';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const props = defineProps({
  isHelpActive: Boolean
});

const emit = defineEmits(['help', 'auth', 'toggle-mobile-menu']);
const router = useRouter();

const { navItems, isCurrentRoute } = useNavigation();
const authStore = useAuthStore();

const siteTitle = 'Tomassoni';
const isAuthenticated = computed(() => !!authStore.user);
const user = computed(() => authStore.user || {});
const isAdmin = computed(() => authStore.isAdmin);
const isProfileDropdownOpen = ref(false);

// Toggle profile dropdown
const toggleProfileDropdown = () => {
  isProfileDropdownOpen.value = !isProfileDropdownOpen.value;
};

// Close profile dropdown
const closeProfileDropdown = () => {
  isProfileDropdownOpen.value = false;
};

// Handle logout
const handleLogout = async () => {
  try {
    await authStore.logout();
    closeProfileDropdown();
    router.push('/');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  const dropdown = document.querySelector('.profile-dropdown-container');
  if (dropdown && !dropdown.contains(event.target) && isProfileDropdownOpen.value) {
    closeProfileDropdown();
  }
};

// Add event listener for clicking outside
if (typeof window !== 'undefined') {
  window.addEventListener('click', handleClickOutside);
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isProfileDropdownOpen.value) {
      closeProfileDropdown();
    }
  });
}

// Get user initials for avatar
const userInitials = computed(() => {
  if (!user.value?.full_name) return '?';
  const names = user.value.full_name.split(' ');
  if (names.length === 1) return names[0][0].toUpperCase();
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
});

const getProfilePictureUrl = (url) => {
  if (!url) return '';
  
  // If it's a Google profile picture URL, add the size parameter
  if (url.includes('googleusercontent.com')) {
    // Ensure we're not adding size parameters multiple times
    const baseUrl = url.split('=')[0];
    // Use a size parameter that works well for header avatars
    return `${baseUrl}=s96-c`;
  }
  
  return url;
};

// Handle image load error for profile pictures
const handleImageError = (event) => {
  console.log('Header avatar failed to load:', {
    url: event.target.src,
    user: authStore.user
  });
  
  // Force fallback to initials
  // This relies on vue reactivity - when the error occurs, 
  // we temporarily set the picture to null which will trigger the v-if/v-else
  const originalPicture = user.value.picture;
  user.value.picture = null;
  
  // After a moment, restore the original value to avoid permanently modifying the store
  setTimeout(() => {
    if (user.value) {
      user.value.picture = originalPicture;
    }
  }, 100);
};
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background-color: #2f201d;
  z-index: var(--z-index-header);
  display: flex;
  flex-direction: column;
}

.header-content {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 0 var(--spacing-md);
  max-width: var(--max-width);
  margin: 0 auto;
}

.site-title {
  text-decoration: none;
  display: flex;
  align-items: center;
}

.title {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0;
}

.site-name {
  font-family: var(--font-family-display);
  font-size: 32px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.05em;
  line-height: 1;
  position: relative;
  text-transform: uppercase;
  padding-bottom: 6px;
  margin-bottom: 2px;
}

.site-name::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #dc2626;
  border-radius: var(--border-radius-full);
}

.site-subtitle {
  font-family: var(--font-family-display);
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 0.02em;
  white-space: nowrap;
  line-height: 1;
}

.desktop-nav {
  display: flex;
  align-items: center;
  justify-self: end;
  height: 100%;
  margin-right: 0;
}

.nav-item {
  height: 100%;
  display: flex;
  align-items: center;
  margin-left: var(--spacing-sm);
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: flex-end;
}

.nav-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2xs);
  padding: 0 var(--spacing-2xs);
  color: rgba(255, 255, 255, 0.8);
  font-size: var(--font-size-sm);
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-base);
  height: 100%;
  justify-content: center;
}

.nav-link:hover {
  color: #fff;
}

.nav-link.current {
  color: #dc2626;
}

.nav-indicator {
  width: 16px;
  height: 2px;
  background-color: #dc2626;
  border-radius: var(--border-radius-full);
  transform: scaleX(0);
  transition: transform var(--transition-base);
}

.nav-link:hover .nav-indicator,
.nav-link.current .nav-indicator {
  transform: scaleX(1);
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.help-button,
.auth-button,
.menu-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  transition: all var(--transition-base);
}

.button-icon {
  width: 24px;
  height: 24px;
  fill: none;
  stroke: currentColor;
  margin: auto;
}

.help-button:hover,
.auth-button:hover,
.menu-button:hover {
  color: #fff;
}

.help-button.active,
.mobile-help.active {
  color: #dc2626 !important;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: var(--border-radius-md);
}

.help-button.active .button-icon,
.mobile-help.active .button-icon {
  fill: none !important;
  stroke: #dc2626 !important;
}

.profile-dropdown-container {
  position: relative;
}

.profile-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.375rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  color: rgba(255, 255, 255, 0.9);
  gap: 0.5rem;
}

.profile-button:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  color: white;
}

.dropdown-arrow {
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.avatar-mini {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  background-color: var(--color-wine);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.avatar-mini img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.admin-avatar {
  background: linear-gradient(135deg, var(--color-wine), #ff6b00);
  box-shadow: 0 0 8px rgba(255, 107, 0, 0.5);
}

.avatar-initials {
  color: white;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0.5px;
}

.admin-avatar .avatar-initials {
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 1px;
}

.profile-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 250px;
  background: white;
  border-radius: var(--border-radius-md);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  animation: dropdownFade 0.2s ease;
}

@keyframes dropdownFade {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-header {
  padding: 1rem;
  background: linear-gradient(to right, #2f201d, #3f2a25);
  color: white;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.dropdown-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background-color: var(--color-wine);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.dropdown-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.user-name {
  font-weight: 600;
  margin: 0;
  font-size: 0.9rem;
}

.user-email {
  font-size: 0.75rem;
  margin: 0;
  opacity: 0.8;
}

.dropdown-content {
  padding: 0.5rem 0;
}

.dropdown-divider {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  margin: 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #333;
  text-decoration: none;
  transition: background-color 0.2s ease;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  font-size: 0.9rem;
}

.dropdown-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.item-icon {
  width: 18px;
  height: 18px;
  stroke: #555;
}

.logout-item {
  color: #e53e3e;
}

.logout-item .item-icon {
  stroke: #e53e3e;
}

/* Mobile styles */
@media (max-width: 768px) {
  .header {
    height: 60px;
    background-color: #2f201d;
  }

  .header-content {
    padding: 0 var(--spacing-sm);
    grid-template-columns: 40px 1fr 40px;
    gap: 0;
  }

  .site-title {
    justify-self: center;
    grid-column: 2;
    text-align: center;
  }

  .title {
    align-items: center;
  }

  .mobile-help {
    grid-column: 1;
    color: rgba(255, 255, 255, 0.8);
    margin-left: 4px;
  }

  .menu-button {
    grid-column: 3;
    color: rgba(255, 255, 255, 0.8);
    position: relative;
    display: flex;
    margin-right: 4px;
    width: 40px;
    height: 40px;
    background: transparent;
    border: none;
    z-index: 10;
  }

  .menu-button .button-icon {
    width: 24px;
    height: 24px;
    stroke: currentColor;
    fill: none;
  }

  .mobile-help:hover,
  .menu-button:hover {
    color: #fff;
  }

  .site-name {
    font-size: 32px;
    color: #fff;
    padding-bottom: 4px;
  }

  .site-subtitle {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    margin-top: 2px;
  }

  .desktop-nav,
  .header-right .help-button,
  .header-right .auth-button {
    display: none;
  }

  .header-right {
    display: flex;
    align-items: center;
  }

  .profile-dropdown-container {
    display: none;
  }

  .profile-dropdown {
    position: fixed;
    top: unset;
    bottom: 0;
    right: 0;
    left: 0;
    border-radius: var(--border-radius-md) var(--border-radius-md) 0 0;
    width: 100%;
    max-width: 100%;
    animation: slideUp 0.3s ease;
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
}

/* Desktop styles */
@media (min-width: 768px) {
  .header-content {
    grid-template-columns: auto 1fr auto;
  }

  .desktop-nav {
    grid-column: 2;
    justify-self: end;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .header-right {
    grid-column: 3;
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .mobile-help,
  .menu-button {
    display: none;
  }

  .profile-dropdown-container {
    display: block;
  }

  .help-button {
    color: rgba(255, 255, 255, 0.8);
  }

  .help-button:hover {
    color: #fff;
  }

  .help-button.active {
    color: #dc2626 !important;
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: var(--border-radius-md);
  }
}
</style>
