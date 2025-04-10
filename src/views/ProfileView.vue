<template>
  <div class="profile-container">
    <div class="profile-content">
      <!-- Debug Section - To be removed later -->
      <div class="debug-section" style="background: rgba(0,0,0,0.1); padding: 10px; margin-bottom: 20px; border-radius: 5px;">
        <h3>Debug Info:</h3>
        <pre style="overflow: auto; max-height: 150px;">{{ JSON.stringify(authStore.user, null, 2) }}</pre>
        <br/>
        <pre style="overflow: auto; max-height: 150px;">isAuthenticated: {{ authStore.isAuthenticated }}</pre>
      </div>
      
      <!-- Profile Header with User Info -->
      <div class="profile-header">
        <div class="avatar-container">
          <div class="avatar">
            <img v-if="authStore.user?.picture" :src="authStore.user.picture" alt="Profile" />
            <div v-else class="initials">{{ userInitials }}</div>
          </div>
        </div>
        <div class="user-info">
          <h1 class="username">{{ authStore.user?.name || 'User' }}</h1>
          <p class="user-email">{{ authStore.user?.email || 'user@example.com' }}</p>
          <p class="user-status">Joined {{ formatDate(new Date()) }}</p>
        </div>
        <div class="profile-actions">
          <button class="logout-button" @click="handleLogout">
            <svg class="logout-icon" viewBox="0 0 24 24">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor"/>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="profile-tabs">
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'info' }" 
          @click="activeTab = 'info'"
        >
          Personal Info
        </button>
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'activity' }" 
          @click="activeTab = 'activity'"
        >
          Activity Log
        </button>
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'gallery' }" 
          @click="activeTab = 'gallery'"
        >
          Your Uploads
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content-container">
        <!-- Personal Info Tab -->
        <div v-if="activeTab === 'info'" class="tab-content">
          <form @submit.prevent="updateProfile" class="profile-form">
            <div class="form-row">
              <div class="form-group">
                <label for="displayName">Display Name</label>
                <input 
                  type="text" 
                  id="displayName" 
                  v-model="profileForm.displayName" 
                  placeholder="Enter your display name"
                />
              </div>
              
              <div class="form-group">
                <label for="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  :value="authStore.user?.email || ''" 
                  disabled
                  placeholder="Your email address"
                />
              </div>
            </div>
            
            <div class="form-group">
              <label for="bio">Bio</label>
              <textarea
                id="bio"
                v-model="profileForm.bio"
                placeholder="Tell us about yourself"
                rows="3"
              ></textarea>
            </div>
            
            <div class="form-group">
              <label>Profile Picture</label>
              <div class="avatar-upload">
                <div class="current-avatar">
                  <img v-if="avatarPreview || authStore.user?.picture" :src="avatarPreview || authStore.user?.picture" alt="Profile" />
                  <div v-else class="initials">{{ userInitials }}</div>
                </div>
                <div class="upload-controls">
                  <input 
                    type="file" 
                    id="profile-image" 
                    ref="fileInput" 
                    @change="handleFileChange" 
                    accept="image/jpeg, image/png, image/gif"
                    class="file-input"
                  />
                  <button type="button" class="upload-button" @click="triggerFileInput">
                    Upload New Picture
                  </button>
                  <p class="upload-help">JPG, PNG or GIF, max 2MB</p>
                  <button 
                    v-if="avatarPreview" 
                    type="button" 
                    class="remove-button"
                    @click="removeImage"
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="submit" class="save-button">
                Save Changes
              </button>
            </div>
          </form>
        </div>
        
        <!-- Activity Log Tab -->
        <div v-else-if="activeTab === 'activity'" class="tab-content">
          <div class="activity-log">
            <div class="activity-empty">
              <p>No activity recorded yet.</p>
              <p>Your actions like uploads and comments will appear here.</p>
            </div>
          </div>
        </div>
        
        <!-- Gallery Tab -->
        <div v-else-if="activeTab === 'gallery'" class="tab-content">
          <div class="gallery-upload">
            <div class="upload-area">
              <svg class="upload-icon" viewBox="0 0 24 24">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" fill="currentColor"/>
              </svg>
              <p>Drag and drop files here</p>
              <p>or</p>
              <button type="button" class="upload-button">Select Files</button>
              <p class="upload-help">JPG, PNG, GIF or PDF files, max 10MB each</p>
            </div>
            
            <div class="upload-empty">
              <p>No uploads yet.</p>
              <p>Your gallery items will appear here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useLoader } from '@/composables/useLoader';

// Define component name for keep-alive
defineOptions({
  name: 'ProfileView'
});

const router = useRouter();
const authStore = useAuthStore();
// Changed from computed to direct reference for testing
// const user = computed(() => authStore.user);
const loader = useLoader();

// Tab navigation
const activeTab = ref('info');

// Profile form data
const profileForm = ref({
  displayName: '',
  bio: '',
  picture: null
});

// File handling
const fileInput = ref(null);
const avatarPreview = ref(null);

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  // Check file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    alert('File is too large. Maximum size is 2MB.');
    event.target.value = '';
    return;
  }
  
  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    avatarPreview.value = e.target.result;
    profileForm.value.picture = file;
  };
  reader.readAsDataURL(file);
};

const removeImage = () => {
  avatarPreview.value = null;
  profileForm.value.picture = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// Format date helper
const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

// Initialize form with user data
watch(() => authStore.user, (newUser) => {
  if (newUser) {
    console.log('Watch triggered with user:', newUser);
    profileForm.value.displayName = newUser.name || '';
    profileForm.value.bio = newUser.bio || '';
  }
}, { immediate: true, deep: true });

// Generate user initials for the avatar
const userInitials = computed(() => {
  if (!authStore.user?.name) return 'GU';
  console.log('Computing initials for:', authStore.user.name);
  return authStore.user.name
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

onMounted(() => {
  console.log('ProfileView mounted - Initial user state:', authStore.user);
  
  // Try to get user data directly from localStorage
  try {
    const storedUserStr = localStorage.getItem('auth_user');
    console.log('Raw localStorage auth_user value:', storedUserStr);
    
    if (storedUserStr) {
      const storedUser = JSON.parse(storedUserStr);
      console.log('Parsed localStorage user:', storedUser);
      
      // Directly set to the authStore
      authStore.user = storedUser;
      
      console.log('Updated auth store user after direct localStorage load:', authStore.user);
    }
  } catch (e) {
    console.error('Error parsing localStorage user:', e);
  }
  
  // Force refresh from localStorage using the store method
  refreshFromStorage();
  
  // Force hide any loader that might still be visible
  loader.forceHide();
  
  // Check auth status and redirect if not authenticated
  if (!authStore.isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    router.push('/auth');
  } else {
    console.log('User is authenticated:', authStore.user);
  }
});

// Submit profile update
const updateProfile = async () => {
  try {
    // Update the user name in store
    if (authStore.user) {
      const updatedUser = {
        ...authStore.user,
        name: profileForm.value.displayName,
        bio: profileForm.value.bio
      };
      
      // If we have a new image, update the picture URL
      if (avatarPreview.value) {
        updatedUser.picture = avatarPreview.value;
      }
      
      // Update store and localStorage
      authStore.user = updatedUser;
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      
      // Show a success message
      alert('Profile updated successfully!');
    }
  } catch (error) {
    console.error('Failed to update profile:', error);
  }
};

const handleLogout = async () => {
  try {
    await authStore.logout();
    router.push('/auth');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

// Function to refresh user data from storage
const refreshFromStorage = () => {
  console.log('Refreshing user data from localStorage');
  
  const storedUser = localStorage.getItem('auth_user');
  const storedToken = localStorage.getItem('auth_token');
  
  console.log('LocalStorage data:', { 
    user: storedUser ? 'found' : 'missing',
    token: storedToken ? 'found' : 'missing'
  });
  
  if (storedUser) {
    try {
      const userData = JSON.parse(storedUser);
      console.log('Parsed user data from localStorage:', userData);
      
      // Force update the auth store
      authStore.user = userData;
      
      // Update form
      profileForm.value.displayName = userData.name || '';
      profileForm.value.bio = userData.bio || '';
      
      console.log('Current user after refresh:', authStore.user);
    } catch (e) {
      console.error('Error parsing user data', e);
    }
  } else {
    console.log('No user data found in localStorage');
  }
  
  // Always double-check with the auth store's refresh method too
  authStore.refreshUserData();
};
</script>

<style scoped>
.profile-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
  padding-bottom: 2rem;
}

.profile-content {
  width: 100%;
  max-width: 1200px;
  background: rgba(42, 29, 29, 0.9);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  margin: 1rem auto 2rem;
}

.profile-header {
  display: flex;
  align-items: center;
  padding: 2rem;
  background: #3a1f1f;
  border-bottom: 1px solid #8b4513;
}

.avatar-container {
  margin-right: 2rem;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #f4e85b;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 3px solid #8b4513;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.initials {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2a1d1d;
}

.user-info {
  flex: 1;
}

.username {
  margin: 0 0 0.5rem;
  font-size: 2rem;
  color: white;
  font-weight: 600;
}

.user-email {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  color: #a67b5b;
}

.user-status {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

.profile-actions {
  margin-left: auto;
}

.logout-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #8b4513;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-button:hover {
  background: #6d2e0b;
}

.logout-icon {
  width: 18px;
  height: 18px;
}

.profile-tabs {
  display: flex;
  padding: 0 2rem;
  background: #2a1d1d;
  border-bottom: 1px solid rgba(166, 123, 91, 0.3);
}

.tab-button {
  background: transparent;
  border: none;
  color: #a67b5b;
  font-size: 1rem;
  padding: 1rem 1.5rem;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

.tab-button:hover {
  color: white;
}

.tab-button.active {
  color: white;
  font-weight: 600;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #8b4513;
}

.tab-content-container {
  padding: 2rem;
}

.tab-content {
  width: 100%;
}

.profile-form {
  text-align: left;
  max-width: 800px;
  margin: 0 auto;
}

.form-row {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-row .form-group {
  flex: 1;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #a67b5b;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid rgba(166, 123, 91, 0.3);
  background: rgba(42, 29, 29, 0.5);
  color: white;
  font-size: 1rem;
}

.form-group input:disabled {
  background: rgba(42, 29, 29, 0.8);
  color: rgba(255, 255, 255, 0.6);
  cursor: not-allowed;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #8b4513;
  box-shadow: 0 0 0 2px rgba(139, 69, 19, 0.3);
}

.avatar-upload {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.current-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f4e85b;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px solid #8b4513;
}

.upload-controls {
  flex: 1;
}

.upload-button {
  background: #8b4513;
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.upload-button:hover {
  background: #6d2e0b;
}

.upload-help {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.save-button {
  background: #8b4513;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.save-button:hover {
  background: #6d2e0b;
}

.activity-log,
.gallery-upload {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.activity-empty,
.upload-empty {
  text-align: center;
  padding: 3rem 1rem;
  color: rgba(255, 255, 255, 0.6);
}

.upload-area {
  text-align: center;
  padding: 2rem;
  border: 2px dashed rgba(166, 123, 91, 0.3);
  border-radius: 8px;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.8);
}

.upload-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
  color: #a67b5b;
}

.file-input {
  display: none;
}

.remove-button {
  margin-top: 0.75rem;
  background: transparent;
  color: #a67b5b;
  border: 1px solid #a67b5b;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.remove-button:hover {
  background: rgba(139, 69, 19, 0.1);
  color: #fff;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .avatar-container {
    margin-right: 0;
    margin-bottom: 1.5rem;
  }
  
  .profile-actions {
    margin-left: 0;
    margin-top: 1.5rem;
  }
  
  .form-row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .profile-tabs {
    overflow-x: auto;
    padding: 0;
  }
  
  .tab-button {
    padding: 1rem;
    white-space: nowrap;
  }
  
  .avatar-upload {
    flex-direction: column;
    align-items: center;
  }
  
  .current-avatar {
    margin-bottom: 1rem;
  }
  
  .upload-controls {
    text-align: center;
  }
}
</style> 