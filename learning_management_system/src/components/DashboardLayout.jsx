import { useNavigate } from "react-router-dom";

export default function DashboardLayout({ title, children }) {
  const navigate = useNavigate();
  function wroc() {
    navigate("/login");
  }

  return (
    <main className="layout">
      <header className="layout_header">
        <button className="layout_back" onClick={wroc}>
          powrót
        </button>
        <h1>{title}</h1>
      </header>
      <section className="layout_content">{children}</section>
    </main>
  );
}
