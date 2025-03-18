<template>
  <div class="person-card" @click="openOverlay">
    <img class="profile-pic" src="/photos/profile_placeholder.jpeg" alt="Profile" />
    <div class="person-info">
      <h3>{{ person.name }}</h3>
      <p>{{ person.birthday }}</p>
    </div>
    <!-- Dark overlay that fades in on click; clicking anywhere in it (including text) closes it -->
    <transition name="fade">
      <div v-if="showOverlay" class="info-overlay" @click.stop="closeOverlay">
        <div class="overlay-content">
          <p>Birthday: {{ person.birthday }}</p>
          <p>{{ person.bio }}</p>
          <p v-if="person.parents && person.parents.length">
            Parents: {{ person.parents.join(', ') }}
          </p>
          <p v-if="person.children && person.children.length">
            Children: {{ person.children.join(', ') }}
          </p>
          <p v-if="person.siblings && person.siblings.length">
            Siblings: {{ person.siblings.join(', ') }}
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  person: {
    type: Object,
    required: true
  }
})

const showOverlay = ref(false)

const openOverlay = () => {
  showOverlay.value = true
}

const closeOverlay = () => {
  showOverlay.value = false
}
</script>

<style scoped>
.person-card {
  position: relative;
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 300px;
  min-height: 250px;
  margin: 1rem;
  overflow: hidden;
}

.person-card:hover {
  transform: scale(1.03);
}

.profile-pic {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 0.75rem;
}

.person-info h3 {
  margin: 0.5rem 0 0;
  font-size: 1.3rem;
  text-align: center;
  color: #333;
}

.person-info p {
  margin: 0.25rem 0;
  font-size: 1rem;
  color: #666;
  text-align: center;
}

/* Info overlay with subtle blur */
.info-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  color: #fff;
  padding: 0.5rem;
  box-sizing: border-box;
}

.overlay-content {
  text-align: center;
  font-size: 0.9rem;
  line-height: 1.2;
  max-height: 90%;
  overflow-y: auto;
  width: 95%;
}

/* Fade transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}

/* Responsive adjustments for mobile devices */
@media (max-width: 600px) {
  .person-card {
    width: 90%;
    margin: 1rem auto;
  }
  .profile-pic {
    width: 80px;
    height: 80px;
  }
  .person-info h3 {
    font-size: 1.2rem;
  }
  .person-info p {
    font-size: 0.9rem;
  }
  .overlay-content {
    font-size: 0.8rem;
  }
}
</style>
