<template>
  <header class="site-header" ref="header">
    <h1 class="site-title">{{ title }}</h1>
    <!-- Additional header content, if needed -->
  </header>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue';
import "../styles/Header.css";

const props = defineProps({
  title: { type: String, default: "My Awesome Site" }
});

const header = ref(null);

onMounted(() => {
  const headerHeight = header.value.offsetHeight;
  document.documentElement.style.setProperty('--header-height', headerHeight + 'px');
});
</script>
