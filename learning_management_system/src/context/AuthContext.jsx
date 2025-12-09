import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [uzytkownik, setUzytkownik] = useState(null);

  function zalogowanie(role) {
    setUzytkownik({ role });
  }
  function wylogowanie() {
    setUzytkownik(null);
  }
  const dane = { uzytkownik, zalogowanie, wylogowanie };

  return <AuthContext.Provider value={dane}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const wynik = useContext(AuthContext);
  if (!wynik) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return wynik;
}
