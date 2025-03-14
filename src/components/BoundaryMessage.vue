<template>
  <transition name="fade">
    <div v-if="visible" class="boundary-message">
      <span class="close-btn" @click.stop="dismissMessage">✖</span>
      {{ message }}
    </div>
  </transition>
</template>

<script setup>
import { ref, defineProps } from "vue";
import "../styles/BoundaryMessage.css";

const props = defineProps({
  message: String,
});

const visible = ref(true);

const dismissMessage = () => {
  visible.value = false;
};
</script>
