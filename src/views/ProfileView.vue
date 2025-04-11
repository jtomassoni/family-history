<template>
  <div class="profile-page">
    <div class="profile-container">
      <!-- Profile Header Card -->
      <div class="profile-card header-card">
        <div class="profile-header">
          <div class="user-avatar">
            <span v-if="!user.avatar" class="avatar-initials">{{ userInitials }}</span>
            <img v-else :src="user.avatar" :alt="user.full_name" class="avatar-image">
          </div>
          <div class="user-info">
            <h1>{{ user.full_name || 'User' }}</h1>
            <p class="email">{{ user.email }}</p>
            <div class="user-stats">
              <div class="stat">
                <span class="stat-value">0</span>
                <span class="stat-label">Stories</span>
              </div>
              <div class="stat">
                <span class="stat-value">0</span>
                <span class="stat-label">Photos</span>
              </div>
              <div class="stat">
                <span class="stat-value">0</span>
                <span class="stat-label">Connections</span>
              </div>
            </div>
          </div>
          <button @click="logout" class="logout-btn">
            <span class="logout-icon">🚪</span>
            Logout
          </button>
        </div>
      </div>

      <!-- Profile Actions Card -->
      <div class="profile-card actions-card">
        <h2>Profile Settings</h2>
        <div class="profile-actions">
          <button @click="showUploadModal = true" class="action-btn">
            <span class="action-icon">📷</span>
            Upload Profile Image
          </button>
          <button @click="showEditModal = true" class="action-btn">
            <span class="action-icon">✏️</span>
            Edit Profile
          </button>
        </div>
      </div>

      <!-- Admin Section (if admin) -->
      <div v-if="isAdmin" class="profile-card admin-card">
        <div class="god-mode-banner">
          <span class="god-mode-icon">👑</span>
          <h2>Admin Dashboard</h2>
        </div>

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

        <div class="user-management">
          <h3>User Management</h3>
          <div class="user-list">
            <div v-for="user in users" :key="user.id" class="user-card">
              <div class="user-info">
                <span class="user-name">{{ user.full_name }}</span>
                <span class="status" :class="{ active: user.is_active, inactive: !user.is_active }">
                  {{ user.is_active ? 'Active' : 'Inactive' }}
                </span>
              </div>
              <button 
                class="status-btn" 
                :class="{ activate: !user.is_active, deactivate: user.is_active }"
                @click="toggleUserStatus(user.id, !user.is_active)"
              >
                {{ user.is_active ? 'Deactivate' : 'Activate' }}
              </button>
            </div>
          </div>
        </div>

        <div class="reports-section">
          <h3>Reports</h3>
          <div class="report-options">
            <button class="report-btn" @click="generateReport('users')">User Report</button>
            <button class="report-btn" @click="generateReport('activity')">Activity Report</button>
            <button class="report-btn" @click="generateReport('content')">Content Report</button>
          </div>
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

onMounted(async () => {
  // Initialize auth store
  authStore.initializeFromStorage();
  authStore.setAuthHeaders();
  
  console.log('User data:', authStore.user);
  console.log('Is admin computed:', authStore.isAdmin);
  console.log('User is_staff:', authStore.user?.is_staff);
  console.log('User is_superuser:', authStore.user?.is_superuser);
  console.log('Full user object:', JSON.stringify(authStore.user, null, 2));
  
  // Force admin check - for debugging
  const hasAdminRights = authStore.user?.is_staff || authStore.user?.is_superuser;
  console.log('Manual admin check:', hasAdminRights);
  
  // Force enable god mode for this user
  forceEnableGodMode();
  
  if (isAdmin.value) {
    console.log('Loading admin data because user is admin');
    await loadUsers();
  } else {
    console.log('Not loading admin data because user is not admin');
  }
});

// Force enable god mode for this user
function forceEnableGodMode() {
  if (user.value && user.value.email === 'jtomassoni@gmail.com') {
    // Modify the user object to include admin privileges
    user.value.is_staff = true;
    user.value.is_superuser = true;
    
    // Update localStorage to persist these changes
    localStorage.setItem('user', JSON.stringify(user.value));
    
    console.log('🚀 GOD MODE FORCE ENABLED 🚀');
  }
}

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

// Toggle god mode manually
function enableGodMode() {
  forceEnableGodMode();
  // Force refresh the page to apply changes
  window.location.reload();
}
</script>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 100px); /* Adjust based on header and footer height */
  background-color: #f9f6f0;
  color: #3a2723;
  padding: 1rem 0.5rem;
  margin-top: 55px; /* Adjust based on header height */
}

.profile-container {
  flex: 1;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 1rem;
}

.profile-card {
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.profile-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.header-card {
  background: linear-gradient(135deg, #ffffff 0%, #f9f6f0 100%);
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.user-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  background-color: var(--color-wine-light);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
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
  font-size: 2.5rem;
  font-weight: bold;
  border-radius: 50%;
}

.user-info {
  flex: 1;
}

.user-info h1 {
  margin: 0;
  color: var(--color-wine);
  font-size: 2.5rem;
  font-weight: 600;
}

.email {
  color: #3a2723;
  margin: 0.5rem 0;
  font-size: 1.1rem;
}

.user-stats {
  display: flex;
  gap: 2rem;
  margin-top: 1.5rem;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.8rem;
  font-weight: bold;
  color: #3a2723;
}

.stat-label {
  font-size: 0.9rem;
  color: #3a2723;
}

.actions-card {
  background: linear-gradient(135deg, #ffffff 0%, #f9f6f0 100%);
}

.actions-card h2 {
  color: var(--color-wine);
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.profile-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  padding: 1rem 1.5rem;
  background-color: #3a2723;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.action-btn:hover {
  background-color: #2a1a1a;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.action-icon {
  font-size: 1.2rem;
}

.admin-card {
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  color: white;
}

.god-mode-banner {
  background: linear-gradient(45deg, #ff0000, #ff8c00);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  font-weight: bold;
  margin-bottom: 2rem;
  animation: pulse 2s infinite;
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.god-mode-banner h2 {
  margin: 0;
  font-size: 1.8rem;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.admin-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  border: 1px solid rgba(255, 140, 0, 0.3);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-card h3 {
  margin-top: 0;
  color: #ff8c00;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.stat-card p {
  font-size: 2.5rem;
  margin: 0.5rem 0 0;
  color: white;
  font-weight: bold;
}

.user-management {
  margin-top: 2rem;
}

.user-management h3 {
  color: #ff8c00;
  margin-bottom: 1rem;
}

.user-list {
  margin-top: 1rem;
}

.user-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: background-color 0.3s ease;
}

.user-card:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-name {
  font-weight: 500;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status.active {
  background-color: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}

.status.inactive {
  background-color: rgba(244, 67, 54, 0.2);
  color: #F44336;
}

.status-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.status-btn.activate {
  background-color: #4CAF50;
  color: white;
}

.status-btn.deactivate {
  background-color: #F44336;
  color: white;
}

.status-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.reports-section {
  margin-top: 2rem;
}

.reports-section h3 {
  color: #ff8c00;
  margin-bottom: 1rem;
}

.report-options {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.report-btn {
  padding: 0.75rem 1.5rem;
  background-color: #3a2723;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.report-btn:hover {
  background-color: #2a1a1a;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.logout-btn {
  padding: 0.75rem 1.5rem;
  background-color: #3a2723;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.logout-btn:hover {
  background-color: #2a1a1a;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.logout-icon {
  font-size: 1.2rem;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 25px rgba(255, 0, 0, 0.8);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .user-info {
    margin: 1rem 0;
  }

  .user-stats {
    justify-content: center;
  }

  .profile-actions {
    flex-direction: column;
  }

  .admin-stats {
    grid-template-columns: 1fr;
  }

  .user-card {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style> 