<template>
  <header class="site-header" ref="header">
    <h1 class="site-title">{{ title }}</h1>
    <nav class="header-nav">
      <ul class="nav-list">
        <li class="nav-item">
          <a href="/" class="nav-link">Home</a>
        </li>
        <li class="nav-item">
          <a href="/about" class="nav-link">About</a>
        </li>
        <li class="nav-item">
          <a href="/contact" class="nav-link">Contact</a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { defineProps, onMounted, ref } from "vue";
import "../styles/Header.css";

const props = defineProps({
  title: {
    type: String,
    default: "My Awesome Site"
  }
});

const header = ref(null);

onMounted(() => {
  const headerHeight = header.value.offsetHeight;
  document.documentElement.style.setProperty('--header-height', headerHeight + 'px');
});
</script>
