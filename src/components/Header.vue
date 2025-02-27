<template>
  <header class="site-header">
    <h1 class="site-title">{{ title }}</h1>
  </header>
</template>

<script setup>
import { defineProps } from 'vue';
import "../styles/Header.css";

const props = defineProps({
  title: { type: String, default: "Tomassoni Family History" }
});

</script>
