import DashboardLayout from "../components/DashboardLayout.jsx";
import { initialCourses } from "../data/courses.jsx";
import { useState } from "react";
import CourseStruktura from "../components/CourseStruktura.jsx";

export default function StudentDashboard() {
  const [courses, setCourses] = useState(initialCourses);
  const currentCourse = courses[0];
  return (
    <DashboardLayout title="Panel studenta">
      <CourseStruktura course={currentCourse} editable={false} />
    </DashboardLayout>
  );
}
