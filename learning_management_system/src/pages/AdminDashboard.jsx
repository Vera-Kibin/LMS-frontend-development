import DashboardLayout from "../components/DashboardLayout.jsx";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <DashboardLayout title="Panel administratora">
      <p>Wybierz kurs do edycji:</p>
      <Link className="layout_back" to="/courses">
        COURSES
      </Link>
    </DashboardLayout>
  );
}
