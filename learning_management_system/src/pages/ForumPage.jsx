import { useMemo, useState } from "react";
import DashboardLayout from "../components/DashboardLayout.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useForum } from "../context/ForumContext.jsx";
import CommentsTree from "../components/CommentsTree.jsx";
import RichTextEditor from "../components/RichTextEditor.jsx";

export default function ForumPage() {
  const { uzytkownik } = useAuth();
  const { threads, createThread, addComment } = useForum();

  const author = useMemo(
    () => ({
      id: uzytkownik?.id || "guest",
      name: uzytkownik?.name || (uzytkownik?.role ?? "Gość"),
    }),
    [uzytkownik],
  );

  const [activeId, setActiveId] = useState(threads[0]?.id || null);
  const active = threads.find((t) => t.id === activeId) || null;

  const [title, setTitle] = useState("");
  const [html, setHtml] = useState("");

  return (
    <DashboardLayout title="Forum">
      <section className="forum__rules">
        <h2>Forum</h2>
        <p className="muted">
          Tutaj możesz zadawać pytania i dyskutować. Prosimy: szanuj innych, nie
          publikuj treści zabronionych i nie udostępniaj danych wrażliwych.
        </p>
      </section>
      <div className="forum">
        <aside className="forum__left">
          <h3>Wątki</h3>

          <div className="forum__list">
            {threads.map((t) => (
              <button
                key={t.id}
                type="button"
                className={
                  "forum__thread" + (t.id === activeId ? " is-active" : "")
                }
                onClick={() => setActiveId(t.id)}
              >
                <div className="forum__threadTitle">{t.title}</div>
                <div className="muted">{t.comments.length} wypowiedzi</div>
              </button>
            ))}
          </div>
        </aside>

        <main className="forum__center">
          {!active ? (
            <p className="muted">Brak wątków.</p>
          ) : (
            <>
              <h2 className="forum__title">{active.title}</h2>

              <CommentsTree
                comments={active.comments}
                onAddReply={(parentId, replyHtml) => {
                  addComment({
                    threadId: active.id,
                    parentId,
                    author,
                    content: { html: replyHtml },
                  });
                }}
              />

              <ForumRootReply
                onSend={(rootHtml) =>
                  addComment({
                    threadId: active.id,
                    parentId: null,
                    author,
                    content: { html: rootHtml },
                  })
                }
              />
            </>
          )}
        </main>

        <aside className="forum__right">
          <h3>Nowy wątek</h3>

          <div className="forum__new">
            <input
              className="input"
              value={title}
              placeholder="Tytuł wątku…"
              onChange={(e) => setTitle(e.target.value)}
            />
            <RichTextEditor
              value={html}
              onChange={setHtml}
              placeholder="Treść pierwszego posta…"
            />
            <button
              className="btn"
              type="button"
              onClick={() => {
                if (!title.trim()) return;
                if (!html.trim()) return;

                const id = createThread({ title, author, content: { html } });

                // ważne UX: po dodaniu od razu otwórz wątek
                if (id) setActiveId(id);

                setTitle("");
                setHtml("");
              }}
            >
              Dodaj wątek
            </button>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}

function ForumRootReply({ onSend }) {
  const [html, setHtml] = useState("");

  return (
    <div className="forum__rootReply">
      <h3>Dodaj komentarz</h3>
      <RichTextEditor
        value={html}
        onChange={setHtml}
        placeholder="Napisz komentarz…"
      />
      <button
        className="btn"
        type="button"
        onClick={() => {
          if (!html || html.trim() === "") return;
          onSend(html);
          setHtml("");
        }}
      >
        Wyślij
      </button>
    </div>
  );
}
