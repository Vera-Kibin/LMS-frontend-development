import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

function makeUser(role, name) {
  const safeRole = (role || "").toString();
  const safeName = (name || "").trim();
  const id = safeName ? `${safeRole}:${safeName}` : safeRole;
  return { id, role: safeRole, name: safeName || null };
}

export function AuthProvider({ children }) {
  const [uzytkownik, setUzytkownik] = useState(null);

  function zalogowanie(payloadOrRole, maybeName) {
    if (typeof payloadOrRole === "string") {
      setUzytkownik(makeUser(payloadOrRole, maybeName));
      return;
    }

    const role = payloadOrRole?.role;
    const name = payloadOrRole?.name;
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
