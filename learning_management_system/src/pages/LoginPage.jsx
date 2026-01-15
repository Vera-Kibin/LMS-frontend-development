import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useMemo, useState } from "react";

function validateName(raw) {
  const v = (raw ?? "").trim();

  if (!v) return "Imię jest wymagane.";
  if (v.length < 2) return "Imię jest za krótkie (min. 2 znaki).";
  if (v.length > 20) return "Imię jest za długie (max. 20 znaków).";
  if (!/^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż\- ]+$/.test(v)) {
    return "Użyj tylko liter, spacji lub myślnika ( A-z , - , ? ).";
  }
  return "";
}
export default function LoginPage() {
  const navigate = useNavigate();
  const { zalogowanie } = useAuth();
  const [name, setName] = useState("");
  const [touched, setTouched] = useState(false);

  const cleanName = useMemo(() => name.trim(), [name]);
  const error = useMemo(() => validateName(name), [name]);
  const showError = (touched || name.length > 0) && !!error;
  const canLogin = !error;

  function wybor(role) {
    if (!canLogin) {
      setTouched(true);
      return;
    }

    zalogowanie(role, cleanName);

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

        <label className="auth__field">
          <input
            type="text"
            placeholder="TWOJE IMIĘ"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched(true)}
            autoComplete="name"
            aria-invalid={showError}
            aria-describedby="name-error"
          />
        </label>

        {showError ? (
          <p className="auth__warn" id="name-error">
            {error}
          </p>
        ) : (
          <p className="auth__hint">
            {canLogin ? "Wybierz rolę" : "Wpisz imię, aby kontynuować."}
          </p>
        )}

        <div className="auth__buttons">
          <button
            type="button"
            className="role-btn"
            data-role="student"
            disabled={!canLogin}
            onClick={() => wybor("student")}
          >
            STUDENT
          </button>

          <button
            type="button"
            className="role-btn"
            data-role="instructor"
            disabled={!canLogin}
            onClick={() => wybor("instructor")}
          >
            INSTRUKTOR
          </button>

          <button
            type="button"
            className="role-btn"
            data-role="admin"
            disabled={!canLogin}
            onClick={() => wybor("admin")}
          >
            ADMIN
          </button>
        </div>
      </div>
    </main>
  );
}
