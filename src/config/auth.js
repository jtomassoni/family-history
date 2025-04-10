export const authConfig = {
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
    redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/callback`,
    scope: 'profile email',
  },
  endpoints: {
    login: `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/login`,
    signup: `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/signup`,
    googleAuth: `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/google`,
    profile: `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/profile`,
  }
}; 