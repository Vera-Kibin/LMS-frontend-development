import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function DashboardLayout({ title, topContent, children }) {
  const navigate = useNavigate();
  const { wylogowanie } = useAuth();

  function wroc() {
    wylogowanie();
    navigate("/login");
  }
  function toggleTheme() {
    const root = document.documentElement;
    root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
  }

  return (
    <main className="layout">
      <header className="layout_header">
        <button className="layout_back" onClick={wroc}>
          WYLOGOWANIE
        </button>
        <button className="layout_back" type="button" onClick={toggleTheme}>
          MOTYW
        </button>
        <h1>{title}</h1>
      </header>

      <section className="layout_content">
        {topContent ? <div className="layout_top">{topContent}</div> : null}
        {children}
      </section>
    </main>
  );
}
