<template>
  <footer class="site-footer">
    <p>&copy; {{ currentYear }} My Awesome Site. All rights reserved.</p>
  </footer>
</template>

<script setup>
import "../styles/Footer.css";
const currentYear = new Date().getFullYear();
</script>
