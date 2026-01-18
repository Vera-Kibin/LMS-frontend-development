import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { db } from "../lib/storage.js";

const ProgressContext = createContext(null);

const EMPTY = {
  completedLessons: {},
  videoWatched: {},
  quizPassed: {},
};

export function ProgressProvider({ children }) {
  const { uzytkownik, loading } = useAuth();
  const userId = uzytkownik?.id;

  const [progress, setProgress] = useState(EMPTY);

  useEffect(() => {
    if (loading) return;
    if (!userId) {
      setProgress(EMPTY);
      return;
    }
    setProgress(db.getProgress(userId));
  }, [loading, userId]);

  useEffect(() => {
    if (loading) return;
    if (!userId) return;
    db.setProgress(userId, progress);
  }, [loading, userId, progress]);

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

  function resetProgress() {
    setProgress(EMPTY);
  }

  const value = useMemo(
    () => ({
      progress,
      markVideoWatched,
      markQuizPassed,
      markLessonCompleted,
      resetProgress,
    }),
    [progress]
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const v = useContext(ProgressContext);
  if (!v) throw new Error("useProgress must be used inside ProgressProvider");
  return v;
}
