<template>
  <div class="photo-section">
    <h2>{{ photo.externalName }} ({{ photo.month }} {{ photo.day }}, {{ photo.year }})</h2>
    <img :src="photo.url" alt="Photo" @error="onImageError" />
    <p><strong>Description:</strong> {{ photo.description }}</p>
    <p><strong>Event Date:</strong> {{ photo.date }}</p>
    <p><strong>Uploaded At:</strong> {{ formattedUploadedAt }}</p>
  </div>
</template>

<script setup>
import { computed } from "vue";
import "../styles/PhotoTile.css";

const props = defineProps({
  photo: { type: Object, required: true }
});

const onImageError = (event) => {
  event.target.src = "https://placehold.co/400x250?text=Image+Not+Available";
};

const formattedUploadedAt = computed(() => new Date(props.photo.uploadedAt).toLocaleString());
</script>
