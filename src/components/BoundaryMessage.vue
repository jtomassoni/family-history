<template>
  <div class="boundary-message">
    {{ message }}
  </div>
</template>

<script setup>
import "../styles/BoundaryMessage.css";
defineProps({
  message: String
});
</script>
