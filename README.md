Family History Timeline
=======================

Family History Timeline is a Vue and Django application that displays your family's history in an interactive timeline. The app showcases family photos, stories, and milestones in a beautiful, chronological layout.

Overview
--------

This application allows you to explore your family history through an interactive timeline view. Built with Vue.js for the frontend and Django for the backend, the app is designed to be responsive and user-friendly.

View the app at [www.thetomassonis.com](www.thetomassonis.com)(add host info here)

TODO
----

*   make sure hover,disable, etc status effects work for all buttons
*   ADD BUTTON FOR VIEW ALL STORIES IN SINGLE PAGE
*   link family tree to stories
*   link stories to gallery
*   link gallery to stories
*   Build backend DB for images
*   Pipe those images into front end
*   User profiles with auth
*   Upload new pics with auth
*   Upload pics from mobile w auth
*   Comments (create, edit your own, delete), report to admin.
*   Activity logs (who uploaded what, who changed descriptions when from what to do)

Features
--------

*   **Timeline View:** Explore family history in a dynamic timeline.
*   **Image Gallery:** View family photos in context with historical events.
*   **Responsive Design:** Optimized for both desktop and mobile devices.
*   **Future Enhancements:** User authentication, image uploads, commenting, and activity logging.

Tech Stack
----------

*   **Frontend:** Vue.js
*   **Backend:** Django
*   **Database:** TBD (for images and metadata)
*   **Authentication:** (Future) User profiles with secure auth

Roadmap
-------

*   **Backend Enhancements:**
    *   Build a robust database for images and family data.
    *   Implement user authentication and profile management.
*   **Frontend Enhancements:**
    *   Allow authorized users to upload photos.
    *   Add commenting functionality with full CRUD (create, read, update, delete).
*   **Activity Logging:**
    *   Track who uploaded or updated information, with timestamps.
*   **UI/UX Improvements:**
    *   Enhance the timeline interface and add engaging animations.

Installation
------------

### 1\. Clone the Repository

    git clone https://github.com/yourusername/family-history-timeline.git
    cd family-history-timeline

### 2\. Backend Setup (Django)

*   **Create and activate a virtual environment:**

    python -m venv venv
    source venv/bin/activate    # On Linux/macOS
    venv\Scripts\activate       # On Windows

*   **Install backend dependencies:**

    pip install -r requirements.txt

*   **Run migrations:**

    python manage.py migrate

*   **Start the Django development server:**

    python manage.py runserver

### 3\. Frontend Setup (Vue)

*   **Navigate to the Vue project directory (if separate):**

    cd frontend

*   **Install frontend dependencies:**

    npm install

*   **Start the development server:**

    npm run serve

Contributing
------------

Contributions are welcome! If you have any bug fixes, enhancements, or new features, please open an issue or submit a pull request.

License
-------

This project is licensed under the MIT License.

# Family History Web Application

This is a web application for maintaining and sharing family history information. It includes features for user authentication, profile management, uploading content to a gallery, and more.

## Authentication

The application supports the following authentication methods:

- **Google Single Sign-On (SSO)**: Allows users to log in using their Google account.
- **Email/Password**: Traditional email and password-based authentication.

### Setting Up Google OAuth

1. **Create OAuth Credentials in Google Cloud Console**:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Navigate to "APIs & Services" > "OAuth consent screen"
   - Configure the consent screen (external or internal)
   - Add scopes for "email" and "profile"
   - Add your test users
   - Navigate to "Credentials" > "Create Credentials" > "OAuth client ID"
   - Select "Web application" as the application type
   - Add authorized JavaScript origins (e.g., `http://localhost:5173`)
   - Add authorized redirect URIs (e.g., `http://localhost:5173/auth/callback`)
   - Save and note your Client ID

2. **Configure Environment Variables**:
   - Set the following in your `.env` file:
   ```
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback
   VITE_API_URL=http://localhost:3000
   ```

## User Profile

After authentication, users are redirected to their profile page which offers:

- **Personal Information**: Users can update their display name, bio, and profile picture.
- **Activity Log**: Shows a record of user actions within the application.
- **Gallery Uploads**: Allows users to upload and manage content in their personal gallery.

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your configuration (see above)
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Building for Production

```bash
npm run build
```

## Testing Authentication

1. Start the development server
2. Navigate to the login page
3. Choose to log in with Google
4. You'll be redirected to Google's consent screen
5. After granting permission, you'll be redirected back to the application
6. You should be automatically logged in and redirected to your profile page

## Troubleshooting

- **Redirect URI Mismatch**: Ensure the redirect URI in Google Cloud Console exactly matches what you're using in your application
- **API Not Enabled**: Make sure you've enabled the necessary APIs in Google Cloud Console
- **Client ID Issues**: Double-check that your Client ID is correctly set in the `.env` file