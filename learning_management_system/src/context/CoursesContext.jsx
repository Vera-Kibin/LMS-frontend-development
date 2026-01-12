import { createContext, useState, useContext } from "react";
import { initialCourses } from "../data/courses";

const CoursesContext = createContext(null);

export function CoursesProvider({ children }) {
  const [courses, setCourses] = useState(initialCourses);

  const dane = { courses, setCourses };

  return (
    <CoursesContext.Provider value={dane}>{children}</CoursesContext.Provider>
  );
}

export function useCourses() {
  const wynik = useContext(CoursesContext);
  if (!wynik) {
    throw new Error("useCourses must be used within CoursesProvider");
  }
  return wynik;
}
