import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import AboutView from './views/AboutView.vue';
import GalleryView from './views/GalleryView.vue';
import FamilyTreeView from './views/FamilyTreeView.vue';
import StoriesView from './views/StoriesView.vue';
import AuthView from './views/AuthView.vue';
import AuthCallback from './views/AuthCallback.vue';
import ProfileView from './views/ProfileView.vue';
import NotFound from './views/NotFound.vue'; // Your 404 page component
import { useAuthStore } from './stores/auth';

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/about', name: 'About', component: AboutView, meta: { hideBreadcrumbs: true } },
  { path: '/gallery', name: 'Gallery', component: GalleryView },
  { path: '/family-tree', name: 'FamilyTree', component: FamilyTreeView, meta: { hideBreadcrumbs: true } },
  { path: '/stories', name: 'Stories', component: StoriesView, meta: { hideBreadcrumbs: true } },
  // Use the same component for both login and signup:
  { path: '/auth', name: 'Auth', component: AuthView, alias: '/login' },
  { 
    path: '/profile', 
    name: 'profile',
    component: ProfileView,
    meta: {
      requiresAuth: true
    }
  },
  { 
    path: '/auth/callback', 
    name: 'AuthCallback',
    component: AuthCallback,
    meta: { hideBreadcrumbs: true }
  },
  { path: '/404', name: 'NotFound', component: NotFound },
  // Any unmatched route will redirect to home
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/auth');
  } else if ((to.path === '/auth' || to.path === '/login') && authStore.isAuthenticated) {
    next('/profile');
  } else {
    next();
  }
});

export default router;
