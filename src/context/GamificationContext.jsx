import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useProgress } from "./ProgressContext.jsx";
import { useAuth } from "./AuthContext.jsx";
import { BADGES, calcLevelFromXP, calcXP } from "../utils/gamification.jsx";
import { db } from "../lib/storage.js";

const GamificationContext = createContext(null);

function seedBadgesMap(saved = {}) {
  const next = { ...saved };
  for (const b of BADGES) {
    if (typeof next[b.id] !== "boolean") next[b.id] = false;
  }
  return next;
}

export function GamificationProvider({ children }) {
  const { progress } = useProgress();
  const { uzytkownik } = useAuth();
  const userId = uzytkownik?.id ?? null;

  const [badges, setBadges] = useState({});
  const [toasts, setToasts] = useState([]);

  const xp = useMemo(() => calcXP(progress), [progress]);
  const levelInfo = useMemo(() => calcLevelFromXP(xp), [xp]);

  useEffect(() => {
    if (!userId) {
      setBadges({});
      setToasts([]);
      return;
    }

    const saved = db.getBadges(userId, {});
    const seeded = seedBadgesMap(saved);

    db.setBadges(userId, seeded);
    setBadges(seeded);
    setToasts([]);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const newlyUnlocked = [];

    for (const b of BADGES) {
      const has = Boolean(badges[b.id]);
      const ok = b.check(progress);
      if (!has && ok) newlyUnlocked.push(b);
    }

    if (newlyUnlocked.length === 0) return;

    setBadges((prev) => {
      const next = { ...prev };
      for (const b of newlyUnlocked) next[b.id] = true;
      db.setBadges(userId, next);
      return next;
    });

    setToasts((prev) => [
      ...prev,
      ...newlyUnlocked.map((b) => ({
        id: `${b.id}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        text: `Odznaka zdobyta: ${b.title}`,
      })),
    ]);
  }, [progress, badges, userId]);

  useEffect(() => {
    if (toasts.length === 0) return;
    const t = setTimeout(() => setToasts((p) => p.slice(1)), 2500);
    return () => clearTimeout(t);
  }, [toasts]);

  const value = useMemo(
    () => ({ xp, levelInfo, badges, toasts }),
    [xp, levelInfo, badges, toasts],
  );

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const v = useContext(GamificationContext);
  if (!v)
    throw new Error("useGamification must be used inside GamificationProvider");
  return v;
}
