export const forumSeed = [
  {
    id: "t1",
    title: "Witaj na forum!",
    createdAt: Date.now(),
    author: { id: "system", name: "System" },
    comments: [
      {
        id: "c1",
        parentId: null,
        author: { id: "system", name: "System" },
        createdAt: Date.now(),
        content: { html: "<p>Napisz swój pierwszy komentarz =^•^= </p>" },
      },
    ],
  },
];
