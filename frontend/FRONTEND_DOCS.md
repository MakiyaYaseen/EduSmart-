# Frontend Documentation 💻

This document provides a technical overview of the LMS frontend.

## 📁 Folder Structure

- `src/`: Main source code.
  - `components/`: Reusable UI components.
  - `pages/`: Page-level components (Login, Dashboard, etc.).
  - `store/`: Redux store and slices for state management.
  - `hooks/`: Custom React hooks.
  - `utils/`: Helper functions.
- `public/`: Static assets.
- `tailind.config.js`: Tailwind styling configuration.

## 🔧 Core Technologies

- **React 19**: Modern UI rendering.
- **Vite**: Ultra-fast build tool and dev server.
- **Redux Toolkit**: Centralized state for user auth, courses, and search results.
- **React Router Dom**: Client-side routing.
- **Tailwind CSS**: Utility-first styling.
- **Axios**: HTTP client for API requests.

## 🏪 State Management (Redux)

The application uses Redux Toolkit for managing global state. Major slices include:
- `authSlice`: Manages user login state and profile data.
- `courseSlice`: Stores course listings and details.
- `orderSlice`: Tracks purchase status and payment info.

## 🎨 Styling & UI

The UI is designed with a premium feel using:
- **Responsive Layouts**: Fully adaptive for mobile and desktop.
- **Lucide Icons**: Clean and consistent iconography.
- **Glassmorphism**: Subtle effects across dashboards.
- **Transitions**: Smooth page and component transitions.

## 🛠️ Key Scripts

- `npm run dev`: Launch the development server.
- `npm run build`: Build the production application.
- `npm run lint`: Run ESLint for code quality.
