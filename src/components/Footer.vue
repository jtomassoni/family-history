<template>
  <footer class="site-footer">
    <p>Built with ❤️ by JT and AI in Denver. &copy; {{ currentYear }} All rights reserved.</p>
  </footer>
</template>

<script setup>
import "../styles/Footer.css";
const currentYear = new Date().getFullYear();
</script>
