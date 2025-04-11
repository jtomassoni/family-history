# Family History Timeline

Family History Timeline is a Vue and Django application that displays your family's history in an interactive timeline. The app showcases family photos, stories, and milestones in a beautiful, chronological layout.

## Overview

This application allows you to explore your family history through an interactive timeline view. Built with Vue.js for the frontend and Django for the backend, the app is designed to be responsive and user-friendly.

View the app at [www.thetomassonis.com](www.thetomassonis.com) (add host info here).

## TODO

- Make sure hover, disable, etc., status effects work for all buttons.
- Add button for viewing all stories on a single page.
- Link family tree to stories.
- Link stories to gallery.
- Link gallery to stories.
- Build backend DB for images.
- Pipe those images into the frontend.
- User profiles with auth.
- Upload new pics with auth.
- Upload pics from mobile with auth.
- Comments (create, edit your own, delete), report to admin.
- Activity logs (who uploaded what, who changed descriptions when from what to do).

## Features

- **Timeline View:** Explore family history in a dynamic timeline.
- **Image Gallery:** View family photos in context with historical events.
- **Responsive Design:** Optimized for both desktop and mobile devices.
- **User Authentication:** Secure login and profile management.
- **Image Uploads:** Upload and manage family photos.
- **Commenting System:** Engage with stories through comments.
- **Activity Logging:** Track user activities and changes.

## Tech Stack

- **Frontend:** Vue.js
- **Backend:** Django
- **Database:** TBD (for images and metadata)
- **Authentication:** User profiles with secure auth

## Roadmap

- **Backend Enhancements:**
  - Build a robust database for images and family data.
  - Implement user authentication and profile management.
- **Frontend Enhancements:**
  - Allow authorized users to upload photos.
  - Add commenting functionality with full CRUD (create, read, update, delete).
- **Activity Logging:**
  - Track who uploaded or updated information, with timestamps.
- **UI/UX Improvements:**
  - Enhance the timeline interface and add engaging animations.

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/family-history-timeline.git
cd family-history-timeline
```

### 2. Backend Setup (Django)

- **Create and activate a virtual environment:**

  ```bash
  python -m venv venv
  source venv/bin/activate    # On Linux/macOS
  venv\Scripts\activate       # On Windows
  ```

- **Install backend dependencies:**

  ```bash
  pip install -r requirements.txt
  ```

- **Run migrations:**

  ```bash
  python manage.py migrate
  ```

- **Start the Django development server:**

  ```bash
  python manage.py runserver
  ```

### 3. Frontend Setup (Vue)

- **Navigate to the Vue project directory (if separate):**

  ```bash
  cd frontend
  ```

- **Install frontend dependencies:**

  ```bash
  npm install
  ```

- **Start the development server:**

  ```bash
  npm run serve
  ```

## Contributing

Contributions are welcome! If you have any bug fixes, enhancements, or new features, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.