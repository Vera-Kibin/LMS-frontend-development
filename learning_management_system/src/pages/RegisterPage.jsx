import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useMemo, useState } from "react";

function validateName(raw) {
  const v = (raw ?? "").trim();
  if (!v) return "Imię jest wymagane.";
  if (v.length < 2) return "Imię za krótkie (min. 2 znaki).";
  return "";
}

function validateEmail(raw) {
  const v = (raw ?? "").trim().toLowerCase();
  if (!v) return "Email jest wymagany.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Niepoprawny email.";
  return "";
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { rejestracja } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [apiError, setApiError] = useState("");

  const errName = useMemo(() => validateName(name), [name]);
  const errEmail = useMemo(() => validateEmail(email), [email]);
  const canRegister = !errName && !errEmail;

  function wybor(role) {
    setTouched(true);
    setApiError("");

    if (!canRegister) return;

    const res = rejestracja({ name, email, role });
    if (!res.ok) {
      setApiError(res.error);
      return;
    }

    if (role === "student") navigate("/student");
    if (role === "instructor") navigate("/instructor");
    if (role === "admin") navigate("/admin");
  }

  return (
    <main className="auth">
      <div className="auth__top" aria-label="Brand">
        <img
          src="/videos/art_cat.gif"
          alt=""
          className="auth__gif"
          aria-hidden="true"
        />
        <div className="auth__logo">eduCATe.me</div>
      </div>

      <div className="auth__box">
        <h1 className="auth__logo">REJESTRACJA</h1>

        <label className="auth__field">
          <input
            type="text"
            placeholder="IMIĘ"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched(true)}
            autoComplete="name"
          />
        </label>
        {touched && errName && <p className="auth__warn">{errName}</p>}

        <label className="auth__field">
          <input
            type="email"
            placeholder="EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            autoComplete="email"
          />
        </label>
        {touched && errEmail && <p className="auth__warn">{errEmail}</p>}

        {apiError && <p className="auth__warn">{apiError}</p>}

        <p className="auth__hint">
          {canRegister ? "Wybierz rolę" : "Uzupełnij dane"}
        </p>

        <div className="auth__buttons">
          <button
            type="button"
            className="role-btn"
            disabled={!canRegister}
            onClick={() => wybor("student")}
          >
            STUDENT
          </button>

          <button
            type="button"
            className="role-btn"
            disabled={!canRegister}
            onClick={() => wybor("instructor")}
          >
            INSTRUKTOR
          </button>

          <button
            type="button"
            className="role-btn"
            disabled={!canRegister}
            onClick={() => wybor("admin")}
          >
            ADMIN
          </button>
        </div>

        <p className="auth__hint" style={{ marginTop: 12 }}>
          Masz konto? <Link to="/login">Zaloguj się</Link>
        </p>
      </div>
    </main>
  );
}
