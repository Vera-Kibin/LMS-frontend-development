import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { forumSeed } from "../data/forumSeed.jsx";

const ForumContext = createContext(null);

function safeParse(raw, fallback) {
  try {
    const v = JSON.parse(raw);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export function ForumProvider({ children }) {
  const storageKey = "forum:threads";
  const [threads, setThreads] = useState(() => {
    const raw = localStorage.getItem(storageKey);
    return raw ? safeParse(raw, forumSeed) : forumSeed;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(threads));
  }, [threads]);

  function createThread({ title, author, content }) {
    const safeHtml = content?.html?.trim() ? content.html : "<p></p>";

    const thread = {
      id: uid("t"),
      title: title.trim() || "Bez tytułu",
      createdAt: Date.now(),
      author,
      comments: [
        {
          id: uid("c"),
          parentId: null,
          author,
          createdAt: Date.now(),
          content: { html: safeHtml },
        },
      ],
    };

    setThreads((prev) => [thread, ...prev]);
  }

  function addComment({ threadId, parentId = null, author, content }) {
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== threadId) return t;
        const next = {
          id: uid("c"),
          parentId,
          author,
          createdAt: Date.now(),
          content,
        };
        return { ...t, comments: [...t.comments, next] };
      })
    );
  }

  const value = useMemo(
    () => ({ threads, createThread, addComment }),
    [threads]
  );

  return (
    <ForumContext.Provider value={value}>{children}</ForumContext.Provider>
  );
}

export function useForum() {
  const v = useContext(ForumContext);
  if (!v) throw new Error("useForum must be used inside ForumProvider");
  return v;
}
