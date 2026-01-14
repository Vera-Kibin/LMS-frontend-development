import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import InstructorDashboard from "./pages/InstructorDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import CoursesPage from "./pages/education/CoursesPage.jsx";
import CoursePage from "./pages/education/CoursePage.jsx";
import LessonPage from "./pages/education/LessonPage.jsx";
import ForumPage from "./pages/ForumPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/instructor"
        element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <InstructorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses"
        element={
          <ProtectedRoute allowedRoles={["student", "instructor", "admin"]}>
            <CoursesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:courseId"
        element={
          <ProtectedRoute allowedRoles={["student", "instructor", "admin"]}>
            <CoursePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:courseId/lessons/:lessonId"
        element={
          <ProtectedRoute allowedRoles={["student", "instructor", "admin"]}>
            <LessonPage />
          </ProtectedRoute>
        }
      />
      <Route path="/forum" element={<ForumPage />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
