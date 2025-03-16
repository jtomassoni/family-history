<template>
  <div class="mobile-menu" :class="{ open: isOpen }">
    <div class="mobile-menu-header">
      <h2>Menu</h2>
      <button class="mobile-menu-close" @click="closeMenu">&times;</button>
    </div>
    <ul class="mobile-menu-list">
      <li class="mobile-menu-item" v-for="(item, index) in menuItems" :key="index">
        <a :href="item.href">{{ item.text }}</a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';
import "../styles/MobileMenu.css";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close']);

const menuItems = ref([
  { text: 'Home', href: '#' },
  { text: 'About', href: '#' },
  { text: 'Contact', href: '#' },
]);

function closeMenu() {
  emit('close');
}
</script>
