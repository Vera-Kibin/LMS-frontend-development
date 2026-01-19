import DashboardLayout from "../../components/DashboardLayout.jsx";
import { useParams, Link } from "react-router-dom";
import { useMemo, useRef, useState, useEffect } from "react";
import { useCourses } from "../../context/CoursesContext.jsx";
import QuizEngine from "../../components/QuizEngine.jsx";
import { useForum } from "../../context/ForumContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import RichTextEditor from "../../components/RichTextEditor.jsx";
import CommentsTree from "../../components/CommentsTree.jsx";
import { useProgress } from "../../context/ProgressContext.jsx";

function LessonRootReply({ onSend }) {
  const [html, setHtml] = useState("");

  return (
    <div style={{ marginTop: 12 }}>
      <h4 className="muted" style={{ marginBottom: 8 }}>
        Dodaj komentarz
      </h4>
      <RichTextEditor
        value={html}
        onChange={setHtml}
        placeholder="Napisz komentarz…"
      />
      <div style={{ marginTop: 8 }}>
        <button
          className="btn"
          type="button"
          onClick={() => {
            const v = String(html || "").trim();
            if (!v) return;
            onSend(v);
            setHtml("");
          }}
        >
          Wyślij
        </button>
      </div>
    </div>
  );
}

export default function LessonPage() {
  const { courseId, lessonId } = useParams();
  const { courses } = useCourses();
  const { uzytkownik } = useAuth();
  const { threads, addComment, ensureLessonThread } = useForum();

  const author = useMemo(
    () => ({
      id: uzytkownik?.id || "guest",
      name: uzytkownik?.name || (uzytkownik?.role ?? "Gość"),
    }),
    [uzytkownik?.id, uzytkownik?.name, uzytkownik?.role],
  );

  const { progress, markVideoWatched, markQuizPassed, markLessonCompleted } =
    useProgress();

  const { course, lesson, module } = useMemo(() => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return { course: null, module: null, lesson: null };

    for (const m of course.modules) {
      const l = m.lessons.find((x) => x.id === lessonId);
      if (l) return { course, module: m, lesson: l };
    }
    return { course, module: null, lesson: null };
  }, [courses, courseId, lessonId]);

  const quiz = lesson?.quiz ?? null;
  const videoSrc = lesson?.videoUrl ?? null;
  const transcript = Array.isArray(lesson?.transcript) ? lesson.transcript : [];
  const description = lesson?.description ?? "";
  const materials = Array.isArray(lesson?.materials) ? lesson.materials : [];
  const bullets = Array.isArray(lesson?.bullets) ? lesson.bullets : [];

  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoMarked, setVideoMarked] = useState(false);

  const hasVideo = Boolean(videoSrc);
  const hasTranscript = transcript.length > 0;
  const quizDone = Boolean(progress.quizPassed?.[lessonId]);
  const videoDone = Boolean(progress.videoWatched?.[lessonId]);

  // completion
  useEffect(() => {
    const needVideo = Boolean(videoSrc);
    const needQuiz = Boolean(quiz);
    const done = (!needQuiz || quizDone) && (!needVideo || videoDone);

    if (done && !progress.completedLessons?.[lessonId]) {
      markLessonCompleted(lessonId);
    }
  }, [
    quiz,
    quizDone,
    videoDone,
    videoSrc,
    lessonId,
    progress.completedLessons,
    markLessonCompleted,
  ]);

  // transcript highlight
  const activeLineRef = useRef(null);
  const activeIndex = useMemo(() => {
    let idx = 0;
    for (let i = 0; i < transcript.length; i++) {
      if ((transcript[i].start ?? 0) <= currentTime) idx = i;
      else break;
    }
    return idx;
  }, [currentTime, transcript]);

  useEffect(() => {
    activeLineRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [activeIndex]);

  function onLoadedMetadata() {
    setDuration(videoRef.current?.duration ?? 0);
  }

  function onTimeUpdate() {
    const t = videoRef.current?.currentTime ?? 0;
    setCurrentTime(t);

    if (!videoMarked && duration > 0 && t / duration >= 0.9) {
      setVideoMarked(true);
      markVideoWatched(lessonId);
    }
  }

  function seekTo(t) {
    if (!videoRef.current) return;
    videoRef.current.currentTime = t;

    const p = videoRef.current.play?.();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }

  // DISCUSSION
  const [threadId, setThreadId] = useState(null);

  useEffect(() => {
    if (!lesson) return;
    const id = ensureLessonThread({
      lessonId,
      lessonTitle: lesson.title,
      author,
    });
    setThreadId(id);
    // celowo TYLKO lessonId i title — unikamy re-trigger przez author / funkcję
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, lesson?.title]);

  const thread = useMemo(
    () => threads.find((t) => t.id === threadId) ?? null,
    [threads, threadId],
  );

  const comments = thread?.comments ?? [];
  const hasMedia = hasVideo || hasTranscript;

  if (!course || !lesson) {
    return (
      <DashboardLayout title="Lekcja">
        <p>Nie znaleziono lekcji.</p>
        <Link className="layout_back" to="/courses">
          KURSY
        </Link>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={lesson.title}>
      <div className="lesson-page">
        <div className="lesson-breadcrumbs">
          <Link to="/courses">Kursy</Link>
          <span>›</span>
          <Link to={`/courses/${course.id}`}>{course.title}</Link>
          <span>›</span>
          <span className="muted">{module?.title}</span>
        </div>

        {description && (
          <section className="lesson-card lesson-desc">
            <h3 className="lesson-card__title">O lekcji</h3>
            <p className="lesson-desc__text">{description}</p>
          </section>
        )}

        {(materials.length > 0 || bullets.length > 0) && (
          <section className="lesson-card lesson-text">
            <h3 className="lesson-card__title">Materiały</h3>

            {materials.map((p, idx) => (
              <p key={idx} className="lesson-text__p">
                {p}
              </p>
            ))}

            {bullets.length > 0 && (
              <ul className="lesson-text__ul">
                {bullets.map((it, i) => (
                  <li key={i}>{it}</li>
                ))}
              </ul>
            )}
          </section>
        )}

        {hasMedia && (
          <section className="lesson-card lesson-media">
            <div
              className="lesson-layout"
              style={{
                gridTemplateColumns:
                  hasVideo && hasTranscript ? "1.4fr 1fr" : "1fr",
              }}
            >
              {hasVideo && (
                <div className="lesson-video">
                  <video
                    ref={videoRef}
                    controls
                    src={videoSrc}
                    onTimeUpdate={onTimeUpdate}
                    onLoadedMetadata={onLoadedMetadata}
                  />
                </div>
              )}

              {hasTranscript && (
                <div className="lesson-transcript">
                  <h3>Transkrypcja</h3>
                  <div className="transcript-list">
                    {transcript.map((line, i) => (
                      <button
                        key={`${line.start}-${i}`}
                        ref={i === activeIndex ? activeLineRef : null}
                        type="button"
                        className={
                          "transcript-line" +
                          (i === activeIndex ? " is-active" : "")
                        }
                        onClick={() => seekTo(line.start ?? 0)}
                      >
                        <span className="text">{line.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {quiz && (
          <>
            <section className="lesson-card lesson-cta">
              <h3 className="lesson-card__title">Sprawdź wiedzę</h3>
              <p className="muted">
                Odpowiedz na pytania, aby zaliczyć lekcję.
              </p>
            </section>

            <QuizEngine
              quiz={quiz}
              onPassed={() => {
                markQuizPassed(lessonId);
              }}
            />
          </>
        )}

        <section className="lesson-card" style={{ marginTop: 16 }}>
          <h3 className="lesson-card__title">Dyskusja</h3>

          {!thread ? (
            <p className="muted">Ładowanie wątku…</p>
          ) : (
            <>
              <CommentsTree
                comments={comments}
                onAddReply={(parentId, replyHtml) => {
                  addComment({
                    threadId: thread.id,
                    parentId,
                    author,
                    content: { html: replyHtml },
                  });
                }}
              />

              <LessonRootReply
                onSend={(rootHtml) => {
                  addComment({
                    threadId: thread.id,
                    parentId: null,
                    author,
                    content: { html: rootHtml },
                  });
                }}
              />
            </>
          )}
        </section>

        <Link className="layout_back" to={`/courses/${course.id}`}>
          Wróć do kursu
        </Link>
      </div>
    </DashboardLayout>
  );
}
