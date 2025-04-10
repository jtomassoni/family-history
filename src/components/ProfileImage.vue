<template>
  <div class="profile-image" :class="[size, { 'has-image': hasImage }]">
    <img
      v-if="hasImage"
      :src="imageUrl"
      :alt="altText"
      class="profile-photo"
    />
    <div v-else class="initials">
      {{ initials }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
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

const hasImage = computed(() => user.value?.picture)
const imageUrl = computed(() => user.value?.picture)
const altText = computed(() => user.value?.name || 'Profile')

const initials = computed(() => {
  if (!user.value?.name) return '?'
  return user.value.name
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})
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