import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useAuth } from "./AuthContext.jsx";

const ProgressContext = createContext(null);

const EMPTY = {
  completedLessons: {},
  videoWatched: {},
  quizPassed: {},
};

function safeParse(json, fallback) {
  try {
    return JSON.parse(json) ?? fallback;
  } catch {
    return fallback;
  }
}

export function ProgressProvider({ children }) {
  const { uzytkownik } = useAuth();
  const userKey = uzytkownik?.id || "guest";
  const storageKey = `progress:${userKey}`;

  const [progress, setProgress] = useState(EMPTY);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      setProgress(EMPTY);
      return;
    }
    setProgress(safeParse(raw, EMPTY));
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(progress));
  }, [storageKey, progress]);

  function markVideoWatched(lessonId) {
    setProgress((p) => ({
      ...p,
      videoWatched: { ...p.videoWatched, [lessonId]: true },
    }));
  }

  function markQuizPassed(lessonId) {
    setProgress((p) => ({
      ...p,
      quizPassed: { ...p.quizPassed, [lessonId]: true },
    }));
  }

  function markLessonCompleted(lessonId) {
    setProgress((p) => ({
      ...p,
      completedLessons: { ...p.completedLessons, [lessonId]: true },
    }));
  }

  const value = useMemo(
    () => ({
      progress,
      markVideoWatched,
      markQuizPassed,
      markLessonCompleted,
      userKey,
    }),
    [progress, userKey]
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const wynik = useContext(ProgressContext);
  if (!wynik)
    throw new Error("useProgress must be used inside ProgressProvider");
  return wynik;
}
