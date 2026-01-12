import DashboardLayout from "../components/DashboardLayout.jsx";
import { Link } from "react-router-dom";
import { initialCourses } from "../data/courses.jsx";
import { useState } from "react";
import CourseStruktura from "../components/CourseStruktura.jsx";

export default function StudentDashboard() {
  return (
    <DashboardLayout title="Panel studenta">
      <p>Wybierz kurs do edycji:</p>
      <Link className="layout_back" to="/courses">
        KURSY
      </Link>
    </DashboardLayout>
  );
}
