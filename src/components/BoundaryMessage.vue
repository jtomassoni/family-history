<template>
  <transition name="fade">
    <div v-if="visible" class="boundary-message" @click.stop="dismissMessage">
      <span class="close-btn">✖</span>
      {{ message }}
    </div>
  </transition>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";
import "../styles/BoundaryMessage.css";

const props = defineProps({
  message: String,
});

const emit = defineEmits(["close"]);
const visible = ref(true);

const dismissMessage = () => {
  visible.value = false;
  emit("close"); // Emit event so App.vue can track when it's dismissed
};
</script>
