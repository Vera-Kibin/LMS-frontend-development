export const initialCourses = [
  {
    id: "c1",
    title: "Podstawy React",
    level: "beginner",
    category: "Frontend",
    modules: [
      {
        id: "c1-m1",
        title: "Wprowadzenie do React",
        lessons: [
          {
            id: "c1-m1-l1",
            title: "Co to jest React?",
            durationMinutes: 8,
          },
          {
            id: "c1-m1-l2",
            title: "Create React App / Vite – start projektu",
            durationMinutes: 12,
          },
        ],
      },
      {
        id: "c1-m2",
        title: "Komponenty i props",
        lessons: [
          {
            id: "c1-m2-l1",
            title: "Komponenty funkcyjne",
            durationMinutes: 10,
          },
          {
            id: "c1-m2-l2",
            title: "Props i children",
            durationMinutes: 14,
          },
        ],
      },
      {
        id: "c1-m3",
        title: "Hooki podstawowe",
        lessons: [
          {
            id: "c1-m3-l1",
            title: "useState – stan lokalny",
            durationMinutes: 15,
          },
          {
            id: "c1-m3-l2",
            title: "useEffect – efekty uboczne",
            durationMinutes: 18,
          },
        ],
      },
    ],
  },

  {
    id: "c2",
    title: "Zaawansowany React",
    level: "advanced",
    category: "Frontend",
    modules: [
      {
        id: "c2-m1",
        title: "Optymalizacja",
        lessons: [
          {
            id: "c2-m1-l1",
            title: "React.memo i useMemo",
            durationMinutes: 16,
          },
          {
            id: "c2-m1-l2",
            title: "useCallback i kosztowne komponenty",
            durationMinutes: 20,
          },
        ],
      },
      {
        id: "c2-m2",
        title: "Zarządzanie stanem",
        lessons: [
          {
            id: "c2-m2-l1",
            title: "Context API w praktyce",
            durationMinutes: 18,
          },
          {
            id: "c2-m2-l2",
            title: "Wprowadzenie do Redux Toolkit",
            durationMinutes: 22,
          },
        ],
      },
    ],
  },

  {
    id: "c3",
    title: "TypeScript dla frontendowców",
    level: "intermediate",
    category: "TypeScript",
    modules: [
      {
        id: "c3-m1",
        title: "Podstawy TypeScript",
        lessons: [
          {
            id: "c3-m1-l1",
            title: "Typy podstawowe",
            durationMinutes: 10,
          },
          {
            id: "c3-m1-l2",
            title: "Typy złożone (tablice, obiekty)",
            durationMinutes: 14,
          },
        ],
      },
      {
        id: "c3-m2",
        title: "TS + React",
        lessons: [
          {
            id: "c3-m2-l1",
            title: "Typowanie propsów i stanu",
            durationMinutes: 17,
          },
          {
            id: "c3-m2-l2",
            title: "Custom hooki z TypeScript",
            durationMinutes: 19,
          },
        ],
      },
    ],
  },
];
