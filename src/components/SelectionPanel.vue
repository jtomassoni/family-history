<template>
  <div class="selection-panel">
    <ul class="nav-list">
      <li v-for="item in items" :key="item" class="nav-item">
        <CustomButton @click="$emit('select', item)">{{ item }}</CustomButton>
      </li>
    </ul>
  </div>
</template>

<script setup>
import CustomButton from "./CustomButton.vue";
import "../styles/SelectionPanel.css";
const props = defineProps({
  items: { type: Array, required: true }
});
const emit = defineEmits(["select"]);
</script>
