import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { forumSeed } from "../data/forumSeed.jsx";
import { db, uid } from "../lib/storage.js";

const ForumContext = createContext(null);

export function ForumProvider({ children }) {
  const [threads, setThreads] = useState(() => db.getThreads(forumSeed));

  const ensuredLessonRef = useRef({ lessonId: null, threadId: null });

  useEffect(() => {
    db.setThreads(threads);
  }, [threads]);

  function createThread({
    title,
    author,
    content,
    meta = null,
    withFirstPost = true,
  }) {
    const safeHtml = content?.html?.trim() ? content.html : "<p></p>";
    const threadId = uid("t");

    const thread = {
      id: threadId,
      title: title.trim() || "Bez tytułu",
      createdAt: Date.now(),
      author,
      meta,
      comments: withFirstPost
        ? [
            {
              id: uid("c"),
              parentId: null,
              author,
              createdAt: Date.now(),
              content: { html: safeHtml },
            },
          ]
        : [],
    };

    setThreads((prev) => [thread, ...prev]);
    return threadId;
  }

  function addComment({ threadId, parentId = null, author, content }) {
    const safeHtml = content?.html?.trim() ? content.html : "<p></p>";

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== threadId) return t;

        return {
          ...t,
          comments: [
            ...t.comments,
            {
              id: uid("c"),
              parentId,
              author,
              createdAt: Date.now(),
              content: { html: safeHtml },
            },
          ],
        };
      }),
    );
  }

  function ensureLessonThread({ lessonId, lessonTitle, author }) {
    if (ensuredLessonRef.current.lessonId === lessonId) {
      return ensuredLessonRef.current.threadId;
    }

    const newId = uid("t");
    ensuredLessonRef.current = { lessonId, threadId: newId };

    setThreads((prev) => {
      const existing = prev.find(
        (t) => t?.meta?.kind === "lesson" && t?.meta?.lessonId === lessonId,
      );
      if (existing) {
        ensuredLessonRef.current = { lessonId, threadId: existing.id };
        return prev;
      }

      const thread = {
        id: newId,
        title: `[Lekcja] ${lessonTitle}`,
        createdAt: Date.now(),
        author,
        meta: { kind: "lesson", lessonId },
        comments: [],
      };

      return [thread, ...prev];
    });

    return ensuredLessonRef.current.threadId;
  }

  const value = useMemo(
    () => ({
      threads,
      createThread,
      addComment,
      ensureLessonThread,
    }),
    [threads],
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
