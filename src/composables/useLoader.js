import { inject } from 'vue';

export function useLoader() {
  const showLoader = inject('showLoader', null);
  const hideLoader = inject('hideLoader', null);
  
  /**
   * Show the loader
   */
  const show = () => {
    if (showLoader) {
      console.log('useLoader: Show loader called');
      showLoader();
    } else {
      console.warn('useLoader: Loader not available');
    }
  };
  
  /**
   * Hide the loader
   * @param {number} delay - Optional delay in ms before hiding
   */
  const hide = (delay = 0) => {
    if (hideLoader) {
      console.log(`useLoader: Hide loader called with delay ${delay}ms`);
      hideLoader(delay);
    } else {
      console.warn('useLoader: Loader not available');
    }
  };
  
  /**
   * Force hide the loader immediately
   */
  const forceHide = () => {
    if (hideLoader) {
      console.log('useLoader: Force hide loader called');
      hideLoader(0);
    } else {
      console.warn('useLoader: Loader not available');
    }
  };
  
  return {
    show,
    hide,
    forceHide
  };
} 