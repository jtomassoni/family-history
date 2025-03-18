<template>
  <div class="filter-search">
    <input
      type="text"
      v-model="localSearch"
      @input="updateSearch"
      placeholder="Search family member..."
    />
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:modelValue'])

// Local state for search input, synchronized with the parent via v-model
const localSearch = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  localSearch.value = newVal
})

const updateSearch = () => {
  emit('update:modelValue', localSearch.value)
}
</script>

<style scoped>
.filter-search input {
  width: 100%;
  max-width: 300px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s;
}

.filter-search input:focus {
  border-color: #5d3a1a;
}
</style>
