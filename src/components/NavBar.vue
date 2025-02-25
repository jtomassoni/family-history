<template>
  <nav class="persistent-nav">
    <CustomButton @click="onYearClick">
      {{ openYear ? openYear : validYears }}
    </CustomButton>
    <template v-if="openYear">
      <span class="breadcrumb-separator">&gt;</span>
      <CustomButton @click="onMonthClick">
        {{ openMonth ? openMonth : 'All Months' }}
      </CustomButton>
    </template>
    <template v-if="openMonth">
      <span class="breadcrumb-separator">&gt;</span>
      <CustomButton @click="onDayClick">
        {{ selectedDay ? selectedDay : 'All Days' }}
      </CustomButton>
    </template>
  </nav>
</template>

<script setup>
import CustomButton from "./CustomButton.vue";
import { defineProps, defineEmits } from "vue";
import "../styles//NavBar.css";

const props = defineProps({
  openYear: String,
  openMonth: String,
  selectedDay: String,
  validYears: { type: String, default: "" }
});
const emit = defineEmits(["yearClick", "monthClick", "dayClick"]);

const onYearClick = () => emit("yearClick");
const onMonthClick = () => emit("monthClick");
const onDayClick = () => emit("dayClick");
</script>
