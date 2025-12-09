import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const { zalogowanie } = useAuth();

  function wybor(role) {
    zalogowanie(role);
    if (role === "student") navigate("/student");
    if (role === "instructor") navigate("/instructor");
    if (role === "admin") navigate("/admin");
  }
  return (
    <main className="auth">
      <div className="auth__box">
        <h1>LOGOWANIE</h1>
        <p>Wybierz rolę</p>
        <div className="auth__buttons">
          <button onClick={() => wybor("student")}>STUDENT</button>
          <button onClick={() => wybor("instructor")}>INSTRUKTOR</button>
          <button onClick={() => wybor("admin")}>ADMINISTRATOR</button>
        </div>
      </div>
    </main>
  );
}
