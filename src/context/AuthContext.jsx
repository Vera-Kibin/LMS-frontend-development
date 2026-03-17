import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { db, uid } from "../lib/storage.js";

const AuthContext = createContext(null);

function normalizeRole(role) {
  const r = String(role ?? "")
    .trim()
    .toLowerCase();
  if (r === "student" || r === "instructor" || r === "admin") return r;
  return "student";
}

function makeUser({ name, email, role }) {
  const safeName = String(name ?? "").trim();
  const safeEmail = String(email ?? "")
    .trim()
    .toLowerCase();

  return {
    id: uid("user"),
    name: safeName,
    email: safeEmail,
    role: normalizeRole(role),
    createdAt: Date.now(),
  };
}

export function AuthProvider({ children }) {
  const [uzytkownik, setUzytkownik] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = db.getSession();
    if (!session?.userId) {
      setUzytkownik(null);
      setLoading(false);
      return;
    }

    const user = db.getUsers().find((u) => u.id === session.userId) || null;
    setUzytkownik(user);
    setLoading(false);
  }, []);

  function rejestracja({ name, email, role }) {
    const users = db.getUsers();
    const user = makeUser({ name, email, role });

    if (!user.email) {
      return { ok: false, error: "Email jest wymagany." };
    }
    if (!user.name) {
      return { ok: false, error: "Imię jest wymagane." };
    }

    if (users.some((u) => u.email === user.email)) {
      return { ok: false, error: "Użytkownik o takim email już istnieje." };
    }

    db.setUsers([user, ...users]);
    db.setSession({ userId: user.id });
    setUzytkownik(user);
    return { ok: true, user };
  }

  function zalogowanie({ email }) {
    const safeEmail = String(email ?? "")
      .trim()
      .toLowerCase();
    const user = db.getUsers().find((u) => u.email === safeEmail);

    if (!user) {
      return {
        ok: false,
        error: "Nie znaleziono użytkownika. Zarejestruj się.",
      };
    }

    db.setSession({ userId: user.id });
    setUzytkownik(user);
    return { ok: true, user };
  }

  function wylogowanie() {
    db.clearSession();
    setUzytkownik(null);
  }

  const value = useMemo(
    () => ({ uzytkownik, loading, rejestracja, zalogowanie, wylogowanie }),
    [uzytkownik, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const v = useContext(AuthContext);
  if (!v) throw new Error("useAuth must be used inside AuthProvider");
  return v;
}
