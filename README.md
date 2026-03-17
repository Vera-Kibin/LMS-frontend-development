# eduCATe.me 🐈‍⬛

**A role-based Learning Management System (LMS) frontend prototype built with React as a Single Page Application.**

---

## Overview

**eduCATe.me** is a frontend-only portfolio project that simulates a Learning Management System (LMS). The application is designed to showcase:

- **Role-based UI** for Students, Instructors, and Admins
- **Nested course structure** with modules and lessons
- **Client-side state management** using React Context API
- **Progress tracking** and analytics visualization
- **Drag-and-drop editing** for course content

The project focuses on simulating real-world frontend architecture for an educational platform, including role-based access control, progress tracking, discussion systems, and gamification mechanics.

This project uses **browser localStorage** as a lightweight persistence layer and **React Context** to simulate persistent application state. It is fully frontend-based, with no backend API.

---

## Key Features

### Learning Systems

- Quiz engine supporting multiple input types and score validation
- Per-user student progress tracking across lessons and courses
- Video and transcript synchronization for guided learning
- Lightweight gamification system with XP, levels, and achievement badges

### Learning Flow

- Role-based access control for Students, Instructors, and Admins
- Course browsing interface
- Structured lesson pages with video, transcripts, and learning materials
- Lesson progression through modules and lessons

### Rich Text Discussion System

The discussion interface includes a lightweight rich text editor built using the `contentEditable` API.

Users can format messages with:

- bold
- italic
- lists
- links

User-generated HTML is sanitized before rendering to prevent potential XSS vulnerabilities.  
The sanitizer enforces a whitelist of allowed tags and removes unsafe attributes.

### Instructor Tools

- Course structure editor with modules and lessons
- Drag-and-drop reordering of course content
- Instructor dashboard with learning analytics and charts

### Admin Tools

- Admin panel for managing users and roles
- Role-aware controls for user management

### Frontend Architecture

- Component-based architecture with reusable UI blocks
- React Context API for global state management
- Local data persistence using browser storage
- Role-aware navigation and conditional rendering

### External Data Integration

The dashboard includes a **Quote of the Day** widget fetched from a public API.

Data fetching is handled using **React Query**, which provides:

- request caching
- automatic retries
- stale data management
- background refetching

---

## Demo

### Registration & Role Selection

The registration screen introduces role-based access and client-side validation powered by Formik and Yup.

![Registration Screenshot](https://github.com/user-attachments/assets/6582ea9e-8364-48a4-b796-fce5bfd4e2b9)

### Student Experience

Students can browse available courses, open structured lessons, watch video materials, and follow their learning progress within the platform.

<video src="https://github.com/user-attachments/assets/864578e4-b9b5-4aec-9abd-de3642f459c5"  width="900" controls muted playsinline></video>

### Instructor Experience

Instructors can monitor learning activity through analytics and manage course structure directly in the interface.

#### Instructor Analytics Dashboard

<video src="https://github.com/user-attachments/assets/b9bdba4e-9f61-4694-8a4b-00e019b697db"  width="900" controls muted playsinline></video>

#### Course Editor with Drag-and-Drop

<video src="https://github.com/user-attachments/assets/d91ddcd1-6cfd-4249-97c0-30d62f15aba5"  width="900" controls muted playsinline></video>

### Admin Experience

Admins can manage users through a dedicated grid with filtering and role-aware controls.

<video src="https://github.com/user-attachments/assets/379c67f6-a039-4f10-aa8d-9d1fdaeae67f"  width="900" controls muted playsinline></video>

### Forum & Discussion

The platform also includes a discussion interface for course-related interaction and threaded communication.

![Forum Screenshot](https://github.com/user-attachments/assets/49fcc608-0044-4038-a43a-589a8bcc340b)

---

## Architecture Highlights

- **Single Page Application (SPA)** built with React
- **React Context API** for global state management
- **Browser localStorage** used as a lightweight persistence layer
- **Nested course structure** modeled as modules and lessons
- **Role-based conditional rendering** for UI components
- **Drag-and-drop editing** for course structure
- **Reusable components** for course outlines and lesson lists
- **Client-side quiz validation engine**
- **Threaded comment tree rendering**
- **Video transcript synchronization**
- **Rich text editing with sanitized user-generated content**
- **Client-side event system for progress and gamification updates**
- **Event-driven progress updates triggering gamification rewards**

---

## Tech Stack

- React
- React Router
- Context API
- Formik
- Yup
- React Query
- Recharts
- Vite
- SCSS / custom CSS styling
- Browser localStorage for persistence

---

## Running Locally

To run this project locally, follow these steps:

1. Ensure you have **Node.js** installed.
2. Clone the repository.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.

---

## Learning / Engineering Focus

- Designing a multi-role SPA with React
- Managing complex client-side state with React Context
- Transforming flat data into hierarchical UI structures (threaded discussions)
- Safely rendering user-generated HTML content
- Synchronizing media playback with UI state
- Structuring reusable components for scalability
- Building role-aware navigation and UI
- Visualizing aggregated learning data with charts
- Implementing drag-and-drop interaction patterns

---

## Future Improvements

The current version of the project focuses on frontend architecture and client-side logic.  
Several features could be added to evolve the platform into a more production-like system.

### Backend Integration

Migration from localStorage-based persistence to a real backend service.  
This would allow:

- real user authentication
- persistent course data
- server-side validation
- multi-user collaboration

### API-based Content

Replace locally stored course content with a remote API.  
This would enable dynamic course loading and centralized content management.

### Advanced Instructor Analytics

Extend the instructor dashboard with more detailed analytics, such as:

- average lesson completion rates
- student activity timelines
- time spent per lesson
- engagement heatmaps

### Real-time Discussion

Introduce real-time discussion threads using WebSockets or similar technologies.  
This would allow students and instructors to interact live during lessons.

### File Uploads and Rich Lesson Content

Allow instructors to upload attachments, slides, or additional resources directly into lessons.

### Authentication & Authorization

Implement a proper authentication system with token-based sessions (e.g., JWT) and protected API routes.

### Automated Testing

Add component and integration tests using tools such as:

- React Testing Library
- Jest
- Playwright

This would improve reliability and maintainability of the codebase.

### Accessibility Improvements

Improve accessibility (a11y) by introducing:

- keyboard navigation
- ARIA roles
- screen reader support

---
