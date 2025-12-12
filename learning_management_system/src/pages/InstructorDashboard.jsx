import DashboardLayout from "../components/DashboardLayout.jsx";
import { initialCourses } from "../data/courses.jsx";
import { useState } from "react";
import CourseStruktura from "../components/CourseStruktura.jsx";
import { reOrder } from "../utils/reOrder.jsx";

export default function InstructorDashboard() {
  const [courses, setCourses] = useState(initialCourses);
  const currentCourse = courses[0];

  function handleReorderModules(fromId, toId) {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === currentCourse.id
          ? {
              ...course,
              modules: reOrder(course.modules, fromId, toId),
            }
          : course
      )
    );
  }

  return (
    <DashboardLayout title="Panel instruktora">
      <CourseStruktura
        course={currentCourse}
        editable={true}
        onReorderModules={handleReorderModules}
      />
    </DashboardLayout>
  );
}
