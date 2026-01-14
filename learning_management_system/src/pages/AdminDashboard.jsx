import DashboardLayout from "../components/DashboardLayout.jsx";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminDashboard() {
  const { uzytkownik } = useAuth();
  const name = uzytkownik?.name || "Administrator";

  return (
    <DashboardLayout
      title="Panel administratora"
      topContent={
        <section className="dash-card">
          <h2>Witaj, {name}!</h2>
          <p className="muted">Rola: {uzytkownik?.role}</p>
        </section>
      }
    >
      <p>Zarządzanie systemem:</p>
      <Link className="btn-ghost" to="/courses">
        Zarządzaj kursami
      </Link>
    </DashboardLayout>
  );
}
