import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useProgress } from "./ProgressContext.jsx";
import { BADGES, calcLevelFromXP, calcXP } from "../utils/gamification.jsx";

const GamificationContext = createContext(null);

export function GamificationProvider({ children }) {
  const { progress } = useProgress();

  const [badges, setBadges] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("badges") || "{}");
    } catch {
      return {};
    }
  });

  const [toasts, setToasts] = useState([]);

  const xp = useMemo(() => calcXP(progress), [progress]);
  const levelInfo = useMemo(() => calcLevelFromXP(xp), [xp]);

  useEffect(() => {
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
      localStorage.setItem("badges", JSON.stringify(next));
      return next;
    });

    setToasts((prev) => [
      ...prev,
      ...newlyUnlocked.map((b) => ({
        id: `${b.id}-${Date.now()}`,
        text: `Odznaka zdobyta: ${b.title}`,
      })),
    ]);
  }, [progress, badges]);

  useEffect(() => {
    if (toasts.length === 0) return;
    const t = setTimeout(() => setToasts((p) => p.slice(1)), 2500);
    return () => clearTimeout(t);
  }, [toasts]);

  const value = useMemo(
    () => ({ xp, levelInfo, badges, toasts }),
    [xp, levelInfo, badges, toasts]
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
