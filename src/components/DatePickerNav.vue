<template>
  <div class="datepicker-nav">
    <!-- Start Screen: Oldest, Select a Date, Newest -->
    <div v-if="currentLevel === 'start'" class="default-buttons">
      <button class="oldest-btn" @click="selectOldest" :disabled="isOldestDisabled">
        <span class="desktop-label">Oldest</span>
        <span class="mobile-label">Oldest</span>
      </button>

      <button class="select-date-btn" @click="startSelection">
        <span class="desktop-label">Select a Date</span>
        <span class="mobile-label">🗓️</span>
      </button>

      <button class="newest-btn" @click="selectMostRecent" :disabled="isMostRecentDisabled">
        <span class="desktop-label">Newest</span>
        <span class="mobile-label">Newest</span>
      </button>
    </div>

    <!-- Advanced Date Selection UI -->
    <div class="selected-path" v-if="selectedYear">
      <span v-if="selectedYear && currentLevel !== 'year'">Year: {{ selectedYear }}</span>
      <span v-if="selectedMonth && currentLevel !== 'month'"> | Month: {{ monthName(selectedMonth) }}</span>
    </div>

    <div v-if="currentLevel === 'year'" class="year-selection">
      <h3>Select a Year</h3>
      <div class="year-options">
        <button v-for="year in availableYears" :key="year" @click="selectYear(year)">
          {{ year }}
        </button>
      </div>
      <div class="back-button">
        <button @click="resetSelection">Back</button>
      </div>
    </div>

    <div v-if="currentLevel === 'month'" class="month-selection">
      <h3>Select a Month</h3>
      <div class="month-options">
        <button v-for="month in availableMonths" :key="month" @click="selectMonth(month)">
          {{ monthName(month) }}
        </button>
      </div>
      <div class="back-button">
        <button @click="resetToYear">Back</button>
      </div>
    </div>

    <div v-if="currentLevel === 'day'" class="day-selection">
      <h3>Select a Day</h3>
      <div class="day-options">
        <button
          v-for="day in availableDays"
          :key="day"
          @click="selectedDay === day ? confirmSelection() : selectDay(day)"
          :class="{ active: selectedDay === day, confirm: selectedDay === day }"
        >
          {{
            selectedDay === day
              ? `Confirm Selection? ${monthName(selectedMonth)} ${day}, ${selectedYear}`
              : day
          }}
        </button>
      </div>
      <div class="back-button">
        <button @click="resetToMonth">Back</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import "../styles/DatePickerNav.css";

const emit = defineEmits(['select']);

/* Local State */
const selectedYear = ref(null);
const selectedMonth = ref(null);
const selectedDay = ref(null);
const currentLevel = ref('start');

/* Props */
const props = defineProps({
  events: {
    type: Array,
    default: () => []
  },
  currentIndex: {
    type: Number,
    default: 0
  }
});

/* Compute available years, months, and days */
const availableYears = computed(() => {
  const years = props.events.map(e => e.eventDate.getUTCFullYear());
  return [...new Set(years)].sort((a, b) => a - b);
});
const availableMonths = computed(() => {
  if (!selectedYear.value) return [];
  return [...new Set(
    props.events
      .filter(e => e.eventDate.getUTCFullYear() === selectedYear.value)
      .map(e => e.eventDate.getUTCMonth() + 1)
  )].sort((a, b) => a - b);
});
const availableDays = computed(() => {
  if (!selectedYear.value || !selectedMonth.value) return [];
  return [...new Set(
    props.events
      .filter(e =>
        e.eventDate.getUTCFullYear() === selectedYear.value &&
        e.eventDate.getUTCMonth() + 1 === selectedMonth.value
      )
      .map(e => e.eventDate.getUTCDate())
  )].sort((a, b) => a - b);
});

/* Disable Oldest/Newest */
const isOldestDisabled = computed(() => props.currentIndex === props.events.length - 1);
const isMostRecentDisabled = computed(() => props.currentIndex === 0);

/* Select Oldest/Newest */
function selectOldest() {
  if (isOldestDisabled.value || !props.events.length) return;
  emit('select', props.events[props.events.length - 1]);
}
function selectMostRecent() {
  if (isMostRecentDisabled.value || !props.events.length) return;
  emit('select', props.events[0]);
}

/* Date Selection */
function startSelection() { currentLevel.value = 'year'; }
function selectYear(year) { selectedYear.value = year; selectedMonth.value = null; selectedDay.value = null; currentLevel.value = 'month'; }
function selectMonth(month) { selectedMonth.value = month; selectedDay.value = null; currentLevel.value = 'day'; }
function selectDay(day) { selectedDay.value = day; }
function confirmSelection() {
  if (!selectedYear.value || !selectedMonth.value || !selectedDay.value) return;
  const event = props.events.find(e =>
    e.eventDate.getUTCFullYear() === selectedYear.value &&
    e.eventDate.getUTCMonth() + 1 === selectedMonth.value &&
    e.eventDate.getUTCDate() === selectedDay.value
  );
  if (event) {
    emit('select', event);
    resetSelection();
  }
}

/* Reset Flows */
function resetSelection() { selectedYear.value = null; selectedMonth.value = null; selectedDay.value = null; currentLevel.value = 'start'; }
function resetToYear() { selectedMonth.value = null; selectedDay.value = null; currentLevel.value = 'year'; }
function resetToMonth() { selectedDay.value = null; currentLevel.value = 'month'; }

/* Convert Month Number to Name */
function monthName(num) { return new Date(0, num - 1).toLocaleString('default', { month: 'long' }); }
</script>
