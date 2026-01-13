import { createContext, useContext, useMemo, useState } from "react";

// progress = {
//   completedLessons: { [lessonId]: true },
//   videoWatched: { [lessonId]: true },
//   quizPassed: { [lessonId]: true },
// }

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(() => ({
    completedLessons: {},
    videoWatched: {},
    quizPassed: {},
  }));

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
  const wynik = useContext(ProgressContext);
  if (!wynik)
    throw new Error("useProgress must be used inside ProgressProvider");
  return wynik;
}
