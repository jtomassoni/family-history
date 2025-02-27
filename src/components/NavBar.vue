<template>
  <nav class="navbar">
    <!-- Datepicker Breadcrumb Content -->
    <div class="breadcrumb">
      <span class="breadcrumb-item">{{ openMonth }} {{ openYear }}</span>
      <span class="breadcrumb-item">{{ selectedDay }}</span>
      <span class="breadcrumb-item">({{ validYears }})</span>
    </div>
  </nav>
</template>

<script setup>
import { defineProps } from "vue";
import "../styles/NavBar.css";

const props = defineProps({
  openYear: { type: String, default: "" },
  openMonth: { type: String, default: "" },
  selectedDay: { type: String, default: "" },
  validYears: { type: String, default: "" }
});
</script>
