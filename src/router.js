import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import AboutView from './views/AboutView.vue';
import GalleryView from './views/GalleryView.vue';
import FamilyTreeView from './views/FamilyTreeView.vue';
import StoriesView from './views/StoriesView.vue';
import AuthView from './views/AuthView.vue';
import ProfileView from './views/ProfileView.vue';
import AuthCallback from './views/AuthCallback.vue';
import EmailVerifyView from './views/EmailVerifyView.vue';
import NotFound from './views/NotFound.vue'; // Your 404 page component
import { useAuthStore } from './stores/auth';

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/about', name: 'About', component: AboutView, meta: { hideBreadcrumbs: true } },
  { path: '/gallery', name: 'Gallery', component: GalleryView },
  { path: '/family-tree', name: 'FamilyTree', component: FamilyTreeView, meta: { hideBreadcrumbs: true } },
  { path: '/stories', name: 'Stories', component: StoriesView, meta: { hideBreadcrumbs: true } },
  // Authentication routes
  { path: '/login', name: 'Login', component: AuthView },
  { path: '/signup', name: 'Signup', component: AuthView, props: { signup: true } },
  { path: '/profile', name: 'Profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/auth/callback', name: 'AuthCallback', component: AuthCallback, meta: { hideBreadcrumbs: true } },
  { path: '/verify-email/:code', name: 'EmailVerify', component: EmailVerifyView, meta: { hideBreadcrumbs: true } },
  { path: '/admin', name: 'DjangoAdmin', beforeEnter() { window.location.href = 'http://localhost:8000/admin'; } },
  { path: '/404', name: 'NotFound', component: NotFound },
  // Any unmatched route will redirect to home
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // Initialize auth store from localStorage
  authStore.initializeFromStorage();
  authStore.setAuthHeaders();
  
  if (to.meta.requiresAuth && !authStore.user) {
    next('/login');
  } else {
    next();
  }
});

export default router;
