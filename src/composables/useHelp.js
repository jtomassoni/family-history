import { ref } from 'vue';

export function useHelp() {
  const showHintModal = ref(false);
  const helpContent = ref({
    desktopHint: '',
    mobileHint: ''
  });

  const toggleHintModal = () => {
    showHintModal.value = !showHintModal.value;
  };

  const dismissHintModal = () => {
    showHintModal.value = false;
  };

  const setHelpContent = (content) => {
    helpContent.value = {
      desktopHint: content.desktopHint || '',
      mobileHint: content.mobileHint || ''
    };
  };

  return {
    showHintModal,
    helpContent,
    toggleHintModal,
    dismissHintModal,
    setHelpContent
  };
} 