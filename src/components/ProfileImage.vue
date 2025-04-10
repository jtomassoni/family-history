<template>
  <div class="profile-image" :class="[size, { 'has-image': hasImage }]">
    <img
      v-if="hasImage"
      :src="getProfilePictureUrl(user?.picture)"
      :alt="altText"
      class="profile-photo"
      @error="handleImageError"
    />
    <div v-else class="initials">
      {{ initials }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const props = defineProps({
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  }
})

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const showInitials = ref(false)

const hasImage = computed(() => user.value?.picture && !showInitials.value)
const altText = computed(() => user.value?.full_name || 'Profile')

const initials = computed(() => {
  if (!user.value?.full_name) return '?'
  return user.value.full_name
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

function getProfilePictureUrl(url) {
  if (!url) return '';
  
  // If it's a Google profile picture URL, add the size parameter
  if (url.includes('googleusercontent.com')) {
    // Ensure we're not adding size parameters multiple times
    const baseUrl = url.split('=')[0];
    
    // Select size based on component size prop
    let sizeParam = 's96-c'; // Default for medium
    if (props.size === 'small') sizeParam = 's64-c';
    if (props.size === 'large') sizeParam = 's200-c';
    
    return `${baseUrl}=${sizeParam}`;
  }
  
  return url;
}

function handleImageError() {
  console.log('ProfileImage component: Image failed to load', { user: user.value });
  showInitials.value = true;
}
</script>

<style scoped>
.profile-image {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--accent-color, #8b4513);
  color: white;
  font-weight: bold;
  overflow: hidden;
  width: 40px;
  height: 40px;
  font-size: 16px;
}

.profile-image.has-image {
  background: transparent;
}

.profile-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.initials {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

/* Size variations */
.profile-image.small {
  width: 32px;
  height: 32px;
  font-size: 14px;
}

.profile-image.medium {
  width: 40px;
  height: 40px;
  font-size: 16px;
}

.profile-image.large {
  width: 72px;
  height: 72px;
  font-size: 24px;
}
</style> 