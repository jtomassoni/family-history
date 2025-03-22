import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

export const useNavigation = () => {
  const route = useRoute();
  
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/stories', label: 'Stories' },
    { path: '/family-tree', label: 'Family Tree' },
    { path: '/about', label: 'About' }
  ];

  const isCurrentRoute = (path) => route.path === path;

  const currentNavItem = computed(() => 
    navItems.find(item => isCurrentRoute(item.path))
  );

  return {
    navItems,
    isCurrentRoute,
    currentNavItem
  };
}; 