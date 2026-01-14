import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

function makeUser(role, name) {
  const safeName = (name || "").trim();
  const id = safeName ? `${role}:${safeName}` : role;
  return { id, role, name: safeName || null };
}

export function AuthProvider({ children }) {
  const [uzytkownik, setUzytkownik] = useState(null);

  function zalogowanie(role, name) {
    setUzytkownik(makeUser(role, name));
  }
  function wylogowanie() {
    setUzytkownik(null);
  }
  const dane = useMemo(
    () => ({ uzytkownik, zalogowanie, wylogowanie }),
    [uzytkownik]
  );
  return <AuthContext.Provider value={dane}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const wynik = useContext(AuthContext);
  if (!wynik) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return wynik;
}
