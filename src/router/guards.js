import { useAuthStore } from '../stores/auth';

export function setupRouterGuards(router) {
  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next('/login');
    } else {
      next();
    }
  });
} 