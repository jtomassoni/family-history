<template>
  <div class="photo-section">
    <h2>{{ photo.externalName }} ({{ photo.month }} {{ photo.day }}, {{ photo.year }})</h2>
    <img :src="photo.url" alt="Photo" @error="onImageError" />
    <p><strong>Description:</strong> {{ photo.description }}</p>
    <p><strong>Event Date:</strong> {{ photo.eventDate.toISOString().split("T")[0] }}</p>
    <p><strong>Uploaded At:</strong> {{ new Date(photo.uploadedAt).toLocaleString("default", { timeZone: "UTC" }) }}</p>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import "../styles/PhotoTile.css";

const props = defineProps({
  photo: { type: Object, required: true }
});

const onImageError = (event) => {
  event.target.src = "https://placehold.co/400x250?text=Image+Not+Available";
};
</script>
