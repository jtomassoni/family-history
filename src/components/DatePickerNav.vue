<template>
  <div class="datepicker-nav">
    <CustomButton @click="selectMostRecent" :disabled="!hasEvents">
      Most Recent
    </CustomButton>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import CustomButton from './CustomButton.vue';
import "../styles/DatePickerNav.css";

const props = defineProps({
  // Array of event objects; we're not using dates here—just using the array order.
  events: {
    type: Array,
    default: () => []
  }
});
const emit = defineEmits(['select']);

// Determine if there are any events.
const hasEvents = computed(() => props.events.length > 0);

// The "most recent" event is defined as the final event in the array.
const mostRecentEvent = computed(() => {
  if (props.events.length === 0) return null;
  return props.events[0];
});

const selectMostRecent = () => {
  if (mostRecentEvent.value) {
    emit('select', mostRecentEvent.value);
  }
};
</script>
