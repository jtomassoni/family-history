import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const isAuthModalVisible = ref(false);
  const authModalType = ref('sso'); // 'sso' or 'email'

  function showAuthModal() {
    isAuthModalVisible.value = true;
    authModalType.value = 'sso';
  }

  function hideAuthModal() {
    isAuthModalVisible.value = false;
  }

  function setAuthModalType(type) {
    authModalType.value = type;
  }

  return {
    isAuthModalVisible,
    authModalType,
    showAuthModal,
    hideAuthModal,
    setAuthModalType
  };
}); 