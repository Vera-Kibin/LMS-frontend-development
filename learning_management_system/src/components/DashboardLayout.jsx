import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function DashboardLayout({ title, children }) {
  const navigate = useNavigate();
  const { wylogowanie } = useAuth();
  function wroc() {
    wylogowanie();
    navigate("/login");
  }

  return (
    <main className="layout">
      <header className="layout_header">
        <button className="layout_back" onClick={wroc}>
          WYLOGOWANIE
        </button>
        <h1>{title}</h1>
      </header>
      <section className="layout_content">{children}</section>
    </main>
  );
}
