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
  "c1-m1-l2": {
    passScore: 4,
    questions: [
      {
        id: "l2-q1",
        type: "radio",
        points: 1,
        question: "Do startu projektu React najczęściej używa się dziś...",
        options: [
          { id: "a", label: "Vite" },
          { id: "b", label: "jQuery" },
          { id: "c", label: "MySQL" },
        ],
        answer: "a",
      },
      {
        id: "l2-q2",
        type: "checkbox",
        points: 2,
        question: "Które elementy są typowe w projekcie Vite + React?",
        options: [
          { id: "a", label: "folder src/" },
          { id: "b", label: "skrypty dev/build/preview" },
          { id: "c", label: "plik docker-compose jako wymagany" },
        ],
        answer: ["a", "b"],
      },
      {
        id: "l2-q3",
        type: "text",
        points: 1,
        question: "Jaką komendą uruchamiasz dev server w Vite?",
        answer: ["npm run dev", "pnpm dev", "yarn dev"],
      },
      {
        id: "l2-q4",
        type: "radio",
        points: 1,
        question: "Hot reload oznacza, że...",
        options: [
          { id: "a", label: "zmiany w kodzie widać od razu w przeglądarce" },
          { id: "b", label: "aplikacja działa tylko offline" },
          { id: "c", label: "musisz restartować serwer po każdej zmianie" },
        ],
        answer: "a",
      },
      {
        id: "l2-q5",
        type: "checkbox",
        points: 1,
        question: "Co zwykle trzymasz w folderze src/?",
        options: [
          { id: "a", label: "komponenty UI" },
          { id: "b", label: "style (scss/css)" },
          { id: "c", label: "dane (np. kursy/lekcje/quizy)" },
        ],
        answer: ["a", "b", "c"],
      },
    ],
  },
};
