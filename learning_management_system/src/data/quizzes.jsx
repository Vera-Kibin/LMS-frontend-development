export const quizzesByLessonId = {
  "c1-m1-l1": {
    passScore: 3,
    questions: [
      {
        id: "q1",
        type: "radio",
        points: 1,
        question: "React to...",
        options: [
          { id: "a", label: "biblioteka do budowania UI" },
          { id: "b", label: "framework backendowy" },
          { id: "c", label: "baza danych" },
        ],
        answer: "a",
      },
      {
        id: "q2",
        type: "checkbox",
        points: 2,
        question: "Co jest prawdą o komponentach?",
        options: [
          { id: "a", label: "Komponent może być funkcją" },
          { id: "b", label: "Komponent nie może mieć propsów" },
          { id: "c", label: "Komponent zwraca UI (JSX)" },
        ],
        answer: ["a", "c"],
      },
      {
        id: "q3",
        type: "text",
        points: 1,
        question: "Jak nazywa się składnia łącząca JS i HTML w React?",
        answer: ["jsx"],
      },
    ],
  },
};
