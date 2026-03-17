import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { initialCourses } from "../data/courses.jsx";
import { db } from "../lib/storage.js";
import { hydrateCoursesFromLessonContent } from "../lib/seedLessons.js";

const CoursesContext = createContext(null);

export function CoursesProvider({ children }) {
  const [courses, setCourses] = useState(() => db.getCourses(initialCourses));

  useEffect(() => {
    const { next, changed } = hydrateCoursesFromLessonContent(courses);
    if (changed) setCourses(next);
  }, []);

  useEffect(() => {
    db.setCourses(courses);
  }, [courses]);

  const value = useMemo(() => ({ courses, setCourses }), [courses]);

  return (
    <CoursesContext.Provider value={value}>{children}</CoursesContext.Provider>
  );
}

export function useCourses() {
  const v = useContext(CoursesContext);
  if (!v) throw new Error("useCourses must be used within CoursesProvider");
  return v;
}
