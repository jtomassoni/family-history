<template>
  <div class="modal-overlay" @keydown="handleKeydown" tabindex="0">
    <div class="modal-content">
      <p>{{ message }}</p>
      <div class="modal-buttons">
        <CustomButton @click="confirm">Yes</CustomButton>
        <CustomButton @click="cancel">No</CustomButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import CustomButton from "./CustomButton.vue";
import { onMounted } from "vue";
import "../styles/CustomModal.css";

const props = defineProps({
  message: { type: String, required: true }
});
const emit = defineEmits(["confirm", "cancel"]);

const confirm = () => { emit("confirm"); };
const cancel = () => { emit("cancel"); };

const handleKeydown = (event) => {
  if (event.key === "Enter") confirm();
  else if (event.key === "Escape") cancel();
};

onMounted(() => {
  const modal = document.querySelector(".modal-overlay");
  if (modal) modal.focus();
});
</script>
