<template>
  <footer class="site-footer">
    <p>&copy; {{ currentYear }} All rights reserved. Built with love by James and ChatGPT.</p>
  </footer>
</template>

<script setup>
import "../styles/Footer.css";
const currentYear = new Date().getFullYear();
</script>
