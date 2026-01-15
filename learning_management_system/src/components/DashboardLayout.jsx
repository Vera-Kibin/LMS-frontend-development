import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function DashboardLayout({ title, topContent, children }) {
  const navigate = useNavigate();
  const { wylogowanie, uzytkownik } = useAuth();

  const role = uzytkownik?.role;
  const dashboardPath =
    role === "admin"
      ? "/admin"
      : role === "instructor"
      ? "/instructor"
      : "/student";

  function wroc() {
    wylogowanie();
    navigate("/login");
  }

  function toggleTheme(e) {
    const root = document.documentElement;
    const next = e.target.checked ? "light" : "dark";
    root.dataset.theme = next;
  }

  return (
    <main className="layout">
      <header className="layout_header">
        <Link
          className="layout_brand"
          to={dashboardPath}
          aria-label="Dashboard"
        >
          edu<span>CAT</span>e.me
        </Link>

        <div className="layout_center" aria-hidden="true">
          <img className="layout_gif" src="/videos/art_cat.gif" alt="" />
        </div>
        <div className="layout_controls">
          <label className="theme-switch" title="Motyw">
            <input type="checkbox" onChange={toggleTheme} />
            <span className="theme-slider" />
          </label>

          <button
            className="logout-btn"
            onClick={wroc}
            aria-label="Wyloguj się"
          >
            <img src="/icons/logout.png" alt="" />
          </button>
        </div>
      </header>

      <section className="layout_content">
        {topContent ? <div className="layout_top">{topContent}</div> : null}
        {children}
      </section>
    </main>
  );
}
