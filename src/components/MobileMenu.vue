<template>
  <transition name="fade">
    <div v-if="isOpen" class="overlay" @click.self="closeMenu">
      <div class="mobile-menu">
        <!-- Close button -->
        <button class="close-button" @click="closeMenu">&times;</button>

        <!-- Profile Section -->
        <div class="profile-section">
          <img :src="profileImage" alt="Profile" class="profile-pic" />
          <div class="profile-text">Howdy, Admin</div>
        </div>

        <!-- Mobile Navigation -->
        <nav class="mobile-nav">
          <ul class="menu-list">
            <li><router-link to="/" :class="{ current: route.path === '/' }" @click="closeMenu">Home</router-link></li>
            <li><router-link to="/gallery" :class="{ current: route.path === '/gallery' }" @click="closeMenu">Gallery</router-link></li>
            <li><router-link to="/stories" :class="{ current: route.path === '/stories' }" @click="closeMenu">Stories</router-link></li>
            <li><router-link to="/family-tree" :class="{ current: route.path === '/family-tree' }" @click="closeMenu">Family Tree</router-link></li>
            <li><router-link to="/about" :class="{ current: route.path === '/about' }" @click="closeMenu">About</router-link></li>
            <li><router-link to="/contact" :class="{ current: route.path === '/contact' }" @click="closeMenu">Contact</router-link></li>
          </ul>
        </nav>

        <!-- Authentication Section -->
        <div class="auth-section">
          <router-link v-if="!isLoggedIn" to="/login" class="login-button" @click="closeMenu">Login</router-link>
        </div>
      </div>
    </div>
  </transition>
</template>


<script setup>
import { defineProps, defineEmits, ref } from "vue";
import { useRoute } from "vue-router";
import "../styles/MobileMenu.css";


// Props to control visibility
const props = defineProps({
  isOpen: Boolean,
});

// Emit event when menu needs to close
const emit = defineEmits(["close"]);

// Profile image
const profileImage = "/photos/profile_placeholder.jpeg";
const isLoggedIn = ref(false);

// Get current route for active link highlighting
const route = useRoute();

const closeMenu = () => {
  emit("close");
};
</script>