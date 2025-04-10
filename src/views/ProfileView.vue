<template>
  <div class="profile-page">
    <div class="profile-container">
      <div class="profile-header">
        <div class="user-avatar">
          <span v-if="showInitials" class="avatar-initials">{{ userInitials }}</span>
          <img 
            v-else 
            :src="getProfilePictureUrl(user.picture)" 
            :alt="user.full_name" 
            class="avatar-image" 
            @error="handleImageError"
          >
        </div>
        <div class="user-info">
          <h1>{{ user.full_name || 'User' }}</h1>
          <p>{{ user.email }}</p>
        </div>
        <button @click="logout" class="logout-btn">
          <span class="logout-icon">🚪</span>
          Logout
        </button>
      </div>

      <!-- Admin Section -->
      <div v-if="isAdmin" class="admin-section">
        <h2>Admin Dashboard</h2>
        
        <!-- Admin Stats -->
        <div class="admin-stats">
          <div class="stat-card">
            <h3>Total Users</h3>
            <p>{{ adminStats.totalUsers }}</p>
          </div>
          <div class="stat-card">
            <h3>Active Users</h3>
            <p>{{ adminStats.activeUsers }}</p>
          </div>
          <div class="stat-card">
            <h3>Total Content</h3>
            <p>{{ adminStats.totalContent }}</p>
          </div>
        </div>

        <!-- User Management -->
        <div class="user-management">
          <h3>User Management</h3>
          <div class="user-list">
            <div v-for="user in users" :key="user.id" class="user-card">
              <div class="user-info">
                <span>{{ user.email }}</span>
                <span :class="['status', user.is_active ? 'active' : 'inactive']">
                  {{ user.is_active ? 'Active' : 'Inactive' }}
                </span>
              </div>
              <div class="user-actions">
                <button 
                  @click="toggleUserStatus(user.id, !user.is_active)"
                  :class="['status-btn', user.is_active ? 'deactivate' : 'activate']"
                >
                  {{ user.is_active ? 'Deactivate' : 'Activate' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Reports -->
        <div class="reports-section">
          <h3>Reports</h3>
          <div class="report-options">
            <button @click="generateReport('users')" class="report-btn">User Report</button>
            <button @click="generateReport('activity')" class="report-btn">Activity Report</button>
            <button @click="generateReport('content')" class="report-btn">Content Report</button>
          </div>
        </div>
      </div>

      <!-- Regular User Section -->
      <div v-if="!isAdmin" class="user-section">
        <h2>My Profile</h2>
        <div class="profile-actions">
          <button @click="showUploadModal = true" class="action-btn">Upload Profile Image</button>
          <button @click="showEditModal = true" class="action-btn">Edit Profile</button>
        </div>
      </div>

      <!-- Modals -->
      <Modal v-if="showUploadModal" @close="showUploadModal = false">
        <template #header>Upload Profile Image</template>
        <template #body>
          <div class="upload-container">
            <input type="file" @change="handleFileUpload" accept="image/*" />
            <button @click="uploadImage" :disabled="!selectedFile">Upload</button>
          </div>
        </template>
      </Modal>

      <Modal v-if="showEditModal" @close="showEditModal = false">
        <template #header>Edit Profile</template>
        <template #body>
          <form @submit.prevent="updateProfile">
            <div class="form-group">
              <label>Full Name</label>
              <input v-model="editForm.full_name" type="text" />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="editForm.email" type="email" />
            </div>
            <button type="submit">Save Changes</button>
          </form>
        </template>
      </Modal>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import Modal from '../components/Modal.vue';

const authStore = useAuthStore();
const router = useRouter();
const user = computed(() => authStore.user || {});
const isAdmin = computed(() => authStore.isAdmin);
const adminStats = computed(() => authStore.adminStats || {
  totalUsers: 0,
  activeUsers: 0,
  totalContent: 0,
  recentActivity: []
});

const showUploadModal = ref(false);
const showEditModal = ref(false);
const selectedFile = ref(null);
const users = ref([]);
const showInitials = ref(!user.value?.picture);

const editForm = ref({
  full_name: '',
  email: ''
});

// Update editForm when user data changes
watch(user, (newUser) => {
  if (newUser) {
    editForm.value = {
      full_name: newUser.full_name || '',
      email: newUser.email || ''
    };
  }
}, { immediate: true });

const userInitials = computed(() => {
  if (!user.value?.full_name) return '?';
  return user.value.full_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
});

function getProfilePictureUrl(url) {
  if (!url) return '';
  
  // If it's a Google profile picture URL, add the size parameter
  if (url.includes('googleusercontent.com')) {
    // Ensure we're not adding size parameters multiple times
    const baseUrl = url.split('=')[0];
    // Use a moderate size parameter to ensure we get a good quality image
    return `${baseUrl}=s200-c`;
  }
  
  return url;
}

function handleImageError(event) {
  console.log('Image failed to load:', {
    url: event.target.src,
    error: event,
    user: authStore.user,
    picture: authStore.user?.picture,
    avatar: authStore.user?.avatar
  });
  
  // Try to use avatar as fallback if picture fails
  if (authStore.user?.avatar && authStore.user.avatar !== authStore.user.picture) {
    event.target.src = authStore.user.avatar;
  } else {
    showInitials.value = true;
  }
}

onMounted(async () => {
  // Initialize auth store
  authStore.initializeFromStorage();
  authStore.setAuthHeaders();
  
  if (isAdmin.value) {
    await loadUsers();
  }
});

async function loadUsers() {
  try {
    users.value = await authStore.getAllUsers();
  } catch (error) {
    console.error('Failed to load users:', error);
  }
}

async function toggleUserStatus(userId, isActive) {
  try {
    await authStore.updateUserStatus(userId, isActive);
    await loadUsers();
  } catch (error) {
    console.error('Failed to update user status:', error);
  }
}

async function generateReport(type) {
  try {
    const report = await authStore.generateReport(type);
    // Handle report download or display
    console.log('Generated report:', report);
  } catch (error) {
    console.error('Failed to generate report:', error);
  }
}

function handleFileUpload(event) {
  selectedFile.value = event.target.files[0];
}

async function uploadImage() {
  if (!selectedFile.value) return;
  
  try {
    const formData = new FormData();
    formData.append('avatar', selectedFile.value);
    
    // Implement image upload logic here
    console.log('Uploading image:', selectedFile.value);
    
    showUploadModal.value = false;
    selectedFile.value = null;
  } catch (error) {
    console.error('Failed to upload image:', error);
  }
}

async function updateProfile() {
  try {
    // Implement profile update logic here
    console.log('Updating profile:', editForm.value);
    
    showEditModal.value = false;
  } catch (error) {
    console.error('Failed to update profile:', error);
  }
}

function logout() {
  authStore.logout();
  router.push('/');
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: #f9f6f0;
  color: #3a2723;
  padding: 2rem 1rem;
}

.profile-container {
  max-width: 1200px;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.user-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  background-color: var(--color-wine-light);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-wine);
  color: white;
  font-size: 2rem;
  font-weight: bold;
}

.user-info {
  flex: 1;
  margin-left: 2rem;
}

.user-info h1 {
  margin: 0;
  color: var(--color-wine);
}

.email {
  color: var(--color-gray);
  margin: 0.5rem 0;
}

.god-mode-banner {
  display: none; /* Hide the god mode banner completely */
}

.admin-section {
  background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-top: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border: 2px solid #ff8c00;
}

.admin-section h2 {
  color: #ff8c00;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(255, 140, 0, 0.5);
}

.admin-stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  border: 1px solid rgba(255, 140, 0, 0.3);
}

.stat-card h3 {
  margin-top: 0;
  color: #ff8c00;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.stat-card p {
  font-size: 2rem;
  margin: 0.5rem 0 0;
  color: var(--color-wine-dark);
}

.user-management {
  margin-top: 2rem;
}

.user-list {
  margin-top: 1rem;
}

.user-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--color-gray-light);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.status.active {
  background-color: var(--color-success-light);
  color: var(--color-success);
}

.status.inactive {
  background-color: var(--color-error-light);
  color: var(--color-error);
}

.status-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.status-btn.activate {
  background-color: var(--color-success);
  color: white;
}

.status-btn.deactivate {
  background-color: var(--color-error);
  color: white;
}

.reports-section {
  margin-top: 2rem;
}

.report-options {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.report-btn {
  padding: 0.5rem 1rem;
  background-color: var(--color-wine);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.report-btn:hover {
  background-color: var(--color-wine-dark);
}

.user-section {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  background-color: var(--color-wine);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.action-btn:hover {
  background-color: var(--color-wine-dark);
}

.upload-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.form-group label {
  font-weight: bold;
  color: var(--color-wine);
}

.form-group input {
  padding: 0.5rem;
  border: 1px solid var(--color-gray-light);
  border-radius: 4px;
}

button[type="submit"] {
  padding: 0.5rem 1rem;
  background-color: var(--color-wine);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type="submit"]:hover {
  background-color: var(--color-wine-dark);
}

.logout-btn {
  padding: 0.75rem 1.5rem;
  background-color: var(--color-wine);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logout-btn:hover {
  background-color: var(--color-wine-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.logout-icon {
  font-size: 1.2rem;
}
</style> 