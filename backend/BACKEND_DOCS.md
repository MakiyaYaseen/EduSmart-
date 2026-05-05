# Backend Documentation 🛠️

This document provides a technical overview of the LMS backend.

## 📁 Folder Structure

- `config/`: Database connection setup.
- `controller/`: Request handlers and business logic.
- `middleware/`: Custom middleware (Auth, Multer).
- `model/`: Mongoose schemas (User, Course, Lecture, etc.).
- `route/`: API route definitions.
- `index.js`: Server entry point.

## 📡 API Reference

### Authentication (`/api/auth`)
- `POST /register`: User registration.
- `POST /login`: User login (sets cookie).
- `GET /logout`: Clear auth cookie.

### Courses (`/api/course`)
- `GET /getpublished`: Fetch all published courses.
- `GET /getcourse/:courseId`: Get course details by ID.
- `POST /create`: Create a new course (Auth required).
- `POST /editcourse/:courseId`: Update course thumbnail and details.
- `DELETE /remove/:courseId`: Soft/Hard delete course.

### Lectures (`/api/course`)
- `POST /createlecture/:courseId`: Add lecture to course.
- `GET /courselecture/:courseId`: Fetch all lectures for a course.
- `POST /editlecture/:lectureId`: Update lecture video and details.

### Orders & Payments (`/api/order`)
- `POST /create-stripe-order`: Initiate Stripe checkout session.
- `POST /enroll-user`: Direct enrollment.

### AI Search (`/api/course/search`)
- `POST /search`: AI-enhanced search using Gemini API.

## 🗄️ Database Models

### Course Schema
- `title`: String (Required)
- `category`: String (Required)
- `level`: Enum [Beginner, Intermediate, Advanced]
- `price`: Number
- `lectures`: Array of ObjectIDs (Ref: Lecture)
- `creator`: ObjectID (Ref: User)

## 🔑 Environment Variables

Required variables in `backend/.env`:
- `PORT`: Port number (default 8000).
- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key for token signing.
- `STRIPE_SECRET_KEY`: Stripe API key.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Media management.
- `GEMINI_API_KEY`: Google Gemini AI key.
