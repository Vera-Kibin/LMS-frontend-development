import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useMemo, useState } from "react";

function validateEmail(raw) {
  const v = (raw ?? "").trim().toLowerCase();
  if (!v) return "Email jest wymagany.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Niepoprawny email.";
  return "";
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { zalogowanie } = useAuth();

  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [apiError, setApiError] = useState("");

  const error = useMemo(() => validateEmail(email), [email]);
  const canLogin = !error;

  function onSubmit(e) {
    e.preventDefault();
    setTouched(true);
    setApiError("");
    if (!canLogin) return;

    const res = zalogowanie({ email });
    if (!res.ok) {
      setApiError(res.error);
      return;
    }

    const role = res.user.role;
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
        <h1 className="auth__logo">LOGOWANIE</h1>

        <form onSubmit={onSubmit}>
          <label className="auth__field">
            <input
              type="email"
              placeholder="TWÓJ EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(true)}
              autoComplete="email"
              aria-invalid={(touched || email.length > 0) && !!error}
            />
          </label>

          {(touched || email.length > 0) && error ? (
            <p className="auth__warn">{error}</p>
          ) : apiError ? (
            <p className="auth__warn">{apiError}</p>
          ) : (
            <p className="auth__hint">Wpisz email i zaloguj się.</p>
          )}

          <button className="role-btn" type="submit" disabled={!canLogin}>
            ZALOGUJ
          </button>
        </form>

        <p className="auth__hint" style={{ marginTop: 12 }}>
          Nie masz konta? <Link to="/register">Zarejestruj się</Link>
        </p>
      </div>
    </main>
  );
}
