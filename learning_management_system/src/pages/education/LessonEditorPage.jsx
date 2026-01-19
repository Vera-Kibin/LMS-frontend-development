import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout.jsx";
import { useCourses } from "../../context/CoursesContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

function safeJsonParse(str, fallback) {
  try {
    const v = JSON.parse(str);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

function normalizeNumber(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}
function makeId(prefix = "id") {
  if (crypto?.randomUUID) return `${prefix}_${crypto.randomUUID()}`;
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}
export default function LessonEditorPage() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { courses, setCourses } = useCourses();
  const { uzytkownik } = useAuth();

  const canEdit =
    uzytkownik?.role === "instructor" || uzytkownik?.role === "admin";

  const found = useMemo(() => {
    const course = courses.find((c) => c.id === courseId) ?? null;
    if (!course) return { course: null, module: null, lesson: null };

    for (const m of course.modules) {
      const l = m.lessons.find((x) => x.id === lessonId);
      if (l) return { course, module: m, lesson: l };
    }
    return { course, module: null, lesson: null };
  }, [courses, courseId, lessonId]);

  const { course, lesson } = found;

  const [title, setTitle] = useState(() => lesson?.title ?? "");
  const [durationMinutes, setDurationMinutes] = useState(
    () => lesson?.durationMinutes ?? 5,
  );
  const [videoUrl, setVideoUrl] = useState(() => lesson?.videoUrl ?? "");
  const [description, setDescription] = useState(
    () => lesson?.description ?? "",
  );

  const [materialsText, setMaterialsText] = useState(() =>
    Array.isArray(lesson?.materials) ? lesson.materials.join("\n") : "",
  );

  const [bulletsText, setBulletsText] = useState(() =>
    Array.isArray(lesson?.bullets) ? lesson.bullets.join("\n") : "",
  );

  const [transcriptText, setTranscriptText] = useState(() =>
    JSON.stringify(
      Array.isArray(lesson?.transcript) ? lesson.transcript : [],
      null,
      2,
    ),
  );
  const [quizEnabled, setQuizEnabled] = useState(() => Boolean(lesson?.quiz));

  const [quiz, setQuiz] = useState(() => {
    if (lesson?.quiz) return lesson.quiz;
    return {
      id: `quiz_${lessonId}`,
      title: `Quiz: ${lesson?.title ?? ""}`,
      passScore: 1,
      questions: [],
    };
  });

  const [error, setError] = useState("");

  if (!course || !lesson) {
    return (
      <DashboardLayout title="Edytor lekcji">
        <p>Nie znaleziono lekcji.</p>
        <Link className="btn-ghost" to="/courses">
          Wróć
        </Link>
      </DashboardLayout>
    );
  }

  if (!canEdit) {
    return (
      <DashboardLayout title="Edytor lekcji">
        <p>Brak uprawnień do edycji.</p>
        <Link className="btn-ghost" to={`/courses/${course.id}`}>
          Wróć do kursu
        </Link>
      </DashboardLayout>
    );
  }

  function handleSave() {
    setError("");

    const nextTitle = title.trim();
    if (nextTitle.length < 2) {
      setError("Tytuł lekcji jest wymagany (min. 2 znaki).");
      return;
    }

    const nextDuration = normalizeNumber(durationMinutes, 5);
    if (nextDuration <= 0) {
      setError("durationMinutes musi być > 0.");
      return;
    }

    const normalizedVideoUrl = String(videoUrl ?? "").trim();
    const normalizedDescription = String(description ?? "").trim();

    const materials = materialsText
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);

    const bullets = bulletsText
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);

    const transcript = safeJsonParse(transcriptText, null);
    if (!Array.isArray(transcript)) {
      setError("Transcript musi być tablicą JSON (Array).");
      return;
    }

    for (const seg of transcript) {
      const ok =
        seg &&
        typeof seg.start === "number" &&
        typeof seg.end === "number" &&
        typeof seg.text === "string";
      if (!ok) {
        setError(
          "Transcript: każdy element musi mieć { start:number, end:number, text:string }.",
        );
        return;
      }
    }
    let nextQuiz = null;

    if (quizEnabled) {
      const qs = Array.isArray(quiz.questions) ? quiz.questions : [];

      if (!String(quiz.title ?? "").trim()) {
        setError("Tytuł quizu jest wymagany.");
        return;
      }

      if (qs.length === 0) {
        setError("Quiz musi mieć przynajmniej 1 pytanie.");
        return;
      }

      const maxScore = qs.reduce((s, q) => s + (q.points ?? 1), 0);
      const passScore = Number(quiz.passScore ?? 0);

      if (
        !Number.isFinite(passScore) ||
        passScore < 1 ||
        passScore > maxScore
      ) {
        setError(`passScore musi być w zakresie 1..${maxScore}.`);
        return;
      }

      for (const q of qs) {
        if (!String(q.question ?? "").trim()) {
          setError("Każde pytanie musi mieć treść.");
          return;
        }
        const pts = Number(q.points ?? 0);
        if (!Number.isFinite(pts) || pts < 1) {
          setError("Każde pytanie musi mieć points >= 1.");
          return;
        }

        if (q.type === "radio" || q.type === "checkbox") {
          if (!Array.isArray(q.options) || q.options.length < 2) {
            setError("Radio/Checkbox muszą mieć min. 2 opcje.");
            return;
          }
          const ids = new Set(q.options.map((o) => o.id));

          if (q.type === "radio") {
            if (!ids.has(q.answer)) {
              setError("Radio: wybierz poprawną odpowiedź.");
              return;
            }
          } else {
            const arr = Array.isArray(q.answer) ? q.answer : [];
            if (!arr.length || arr.some((id) => !ids.has(id))) {
              setError("Checkbox: wybierz poprawne odpowiedzi.");
              return;
            }
          }
        }

        if (q.type === "text") {
          const arr = Array.isArray(q.answer) ? q.answer : [q.answer];
          const clean = arr.map((x) => String(x).trim()).filter(Boolean);
          if (!clean.length) {
            setError("Text: podaj min. 1 akceptowaną odpowiedź.");
            return;
          }
        }
      }

      nextQuiz = {
        ...quiz,
        title: String(quiz.title).trim(),
        passScore,
        questions: qs,
      };
    }

    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== courseId) return c;
        return {
          ...c,
          modules: c.modules.map((m) => ({
            ...m,
            lessons: m.lessons.map((l) => {
              if (l.id !== lessonId) return l;
              return {
                ...l,
                title: nextTitle,
                durationMinutes: nextDuration,
                videoUrl: normalizedVideoUrl || null,
                description: normalizedDescription,
                materials,
                bullets,
                transcript,
                quiz: nextQuiz,
                updatedAt: Date.now(),
              };
            }),
          })),
          updatedAt: Date.now(),
        };
      }),
    );

    navigate(`/courses/${courseId}`);
  }

  return (
    <DashboardLayout title="Edytor lekcji">
      <div className="lesson-breadcrumbs">
        <Link to="/courses">Kursy</Link>
        <span>›</span>
        <Link to={`/courses/${course.id}`}>{course.title}</Link>
        <span>›</span>
        <span className="muted">Edytuj: {lesson.title}</span>
      </div>

      {error && <p className="auth__warn">{error}</p>}

      <div className="lesson-editor">
        <label className="auth__field">
          <input
            type="text"
            placeholder="Tytuł lekcji"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label className="auth__field">
          <input
            type="number"
            min={1}
            step={1}
            placeholder="durationMinutes"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
          />
        </label>

        <label className="auth__field">
          <input
            type="text"
            placeholder="Video URL (mp4) lub zostaw puste"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </label>

        <div className="lesson-card lesson-desc" style={{ marginTop: 12 }}>
          <h3 className="lesson-card__title">Opis</h3>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{ width: "100%" }}
          />
        </div>

        <div className="lesson-card lesson-text" style={{ marginTop: 12 }}>
          <h3 className="lesson-card__title">Materiały (1 linia = 1 akapit)</h3>
          <textarea
            value={materialsText}
            onChange={(e) => setMaterialsText(e.target.value)}
            rows={6}
            style={{ width: "100%" }}
          />
        </div>

        <div className="lesson-card lesson-text" style={{ marginTop: 12 }}>
          <h3 className="lesson-card__title">Bullets (1 linia = 1 punkt)</h3>
          <textarea
            value={bulletsText}
            onChange={(e) => setBulletsText(e.target.value)}
            rows={6}
            style={{ width: "100%" }}
          />
        </div>

        <div className="lesson-card lesson-text" style={{ marginTop: 12 }}>
          <h3 className="lesson-card__title">
            Transcript (JSON) — format: [{"{"}start,end,text{"}"}]
          </h3>
          <textarea
            value={transcriptText}
            onChange={(e) => setTranscriptText(e.target.value)}
            rows={12}
            style={{ width: "100%", fontFamily: "monospace" }}
          />
          <p className="muted" style={{ marginTop: 8 }}>
            Jeśli nie chcesz napisów: wpisz <code>[]</code>.
          </p>
        </div>

        <div className="lesson-card lesson-text" style={{ marginTop: 12 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <h3 className="lesson-card__title" style={{ margin: 0 }}>
              Quiz
            </h3>

            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={quizEnabled}
                onChange={(e) => setQuizEnabled(e.target.checked)}
              />
              <span className="muted">Quiz w tej lekcji</span>
            </label>
          </div>

          {quizEnabled && (
            <div
              className="quiz-editor"
              style={{ marginTop: 12, display: "grid", gap: 12 }}
            >
              <label className="auth__field">
                <input
                  type="text"
                  placeholder="Tytuł quizu"
                  value={quiz.title ?? ""}
                  onChange={(e) =>
                    setQuiz((q) => ({ ...q, title: e.target.value }))
                  }
                />
              </label>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <label className="auth__field" style={{ flex: "1 1 160px" }}>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    placeholder="Pass score"
                    value={quiz.passScore ?? 0}
                    onChange={(e) =>
                      setQuiz((q) => ({
                        ...q,
                        passScore: Math.max(0, Number(e.target.value || 0)),
                      }))
                    }
                  />
                </label>

                <div className="muted" style={{ alignSelf: "center" }}>
                  Max punktów:{" "}
                  {Array.isArray(quiz.questions)
                    ? quiz.questions.reduce((s, qq) => s + (qq.points ?? 1), 0)
                    : 0}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="courses-btn"
                  onClick={() => {
                    const qId = makeId("q");
                    setQuiz((prev) => ({
                      ...prev,
                      questions: [
                        ...(prev.questions || []),
                        {
                          id: qId,
                          type: "radio",
                          points: 1,
                          question: "Nowe pytanie",
                          options: [
                            { id: "a", label: "Opcja A" },
                            { id: "b", label: "Opcja B" },
                          ],
                          answer: "a",
                        },
                      ],
                    }));
                  }}
                >
                  + Pytanie RADIO
                </button>

                <button
                  type="button"
                  className="courses-btn"
                  onClick={() => {
                    const qId = makeId("q");
                    setQuiz((prev) => ({
                      ...prev,
                      questions: [
                        ...(prev.questions || []),
                        {
                          id: qId,
                          type: "checkbox",
                          points: 2,
                          question: "Nowe pytanie (checkbox)",
                          options: [
                            { id: "a", label: "Opcja A" },
                            { id: "b", label: "Opcja B" },
                            { id: "c", label: "Opcja C" },
                          ],
                          answer: ["a"],
                        },
                      ],
                    }));
                  }}
                >
                  + Pytanie CHECKBOX
                </button>

                <button
                  type="button"
                  className="courses-btn"
                  onClick={() => {
                    const qId = makeId("q");
                    setQuiz((prev) => ({
                      ...prev,
                      questions: [
                        ...(prev.questions || []),
                        {
                          id: qId,
                          type: "text",
                          points: 1,
                          question: "Nowe pytanie (text)",
                          answer: ["odp"],
                        },
                      ],
                    }));
                  }}
                >
                  + Pytanie TEXT
                </button>
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                {(quiz.questions || []).map((qq, idx) => (
                  <div
                    key={qq.id}
                    className="lesson-row"
                    style={{ display: "grid", gap: 10, padding: 12 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className="muted">
                        #{idx + 1} • {qq.type.toUpperCase()}
                      </div>

                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          type="button"
                          className="courses-btn courses-btn--ghost"
                          onClick={() => {
                            const ok = confirm("Usunąć pytanie?");
                            if (!ok) return;
                            setQuiz((prev) => ({
                              ...prev,
                              questions: (prev.questions || []).filter(
                                (x) => x.id !== qq.id,
                              ),
                            }));
                          }}
                        >
                          USUŃ
                        </button>
                      </div>
                    </div>

                    <label className="auth__field">
                      <input
                        type="text"
                        value={qq.question ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          setQuiz((prev) => ({
                            ...prev,
                            questions: prev.questions.map((x) =>
                              x.id === qq.id ? { ...x, question: v } : x,
                            ),
                          }));
                        }}
                        placeholder="Treść pytania"
                      />
                    </label>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <label
                        className="auth__field"
                        style={{ flex: "0 0 140px" }}
                      >
                        <input
                          type="number"
                          min={1}
                          step={1}
                          value={qq.points ?? 1}
                          onChange={(e) => {
                            const pts = Math.max(
                              1,
                              Number(e.target.value || 1),
                            );
                            setQuiz((prev) => ({
                              ...prev,
                              questions: prev.questions.map((x) =>
                                x.id === qq.id ? { ...x, points: pts } : x,
                              ),
                            }));
                          }}
                          placeholder="Punkty"
                          title="Ile punktów za to pytanie"
                        />
                      </label>

                      <div className="muted" style={{ alignSelf: "center" }}>
                        Poprawna odpowiedź ustawiasz poniżej.
                      </div>
                    </div>

                    {(qq.type === "radio" || qq.type === "checkbox") && (
                      <div style={{ display: "grid", gap: 8 }}>
                        {(qq.options || []).map((opt, oi) => {
                          const isRadio = qq.type === "radio";
                          const checked = isRadio
                            ? qq.answer === opt.id
                            : Array.isArray(qq.answer) &&
                              qq.answer.includes(opt.id);

                          return (
                            <div
                              key={opt.id}
                              style={{
                                display: "flex",
                                gap: 8,
                                alignItems: "center",
                              }}
                            >
                              <input
                                type={isRadio ? "radio" : "checkbox"}
                                checked={checked}
                                onChange={(e) => {
                                  setQuiz((prev) => ({
                                    ...prev,
                                    questions: prev.questions.map((x) => {
                                      if (x.id !== qq.id) return x;

                                      if (x.type === "radio") {
                                        return { ...x, answer: opt.id };
                                      }

                                      const arr = Array.isArray(x.answer)
                                        ? x.answer
                                        : [];
                                      const next = e.target.checked
                                        ? Array.from(new Set([...arr, opt.id]))
                                        : arr.filter((id) => id !== opt.id);

                                      return {
                                        ...x,
                                        answer: next.length ? next : [opt.id],
                                      };
                                    }),
                                  }));
                                }}
                              />

                              <input
                                style={{ width: "100%" }}
                                value={opt.label ?? ""}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  setQuiz((prev) => ({
                                    ...prev,
                                    questions: prev.questions.map((x) => {
                                      if (x.id !== qq.id) return x;
                                      const nextOpts = (x.options || []).map(
                                        (oo) =>
                                          oo.id === opt.id
                                            ? { ...oo, label: v }
                                            : oo,
                                      );
                                      return { ...x, options: nextOpts };
                                    }),
                                  }));
                                }}
                                placeholder={`Opcja ${oi + 1}`}
                              />

                              <button
                                type="button"
                                className="courses-btn courses-btn--ghost"
                                onClick={() => {
                                  setQuiz((prev) => ({
                                    ...prev,
                                    questions: prev.questions.map((x) => {
                                      if (x.id !== qq.id) return x;
                                      const nextOpts = (x.options || []).filter(
                                        (oo) => oo.id !== opt.id,
                                      );

                                      // poprawka answer po usunięciu opcji
                                      if (x.type === "radio") {
                                        const nextAnswer =
                                          x.answer === opt.id
                                            ? (nextOpts[0]?.id ?? "")
                                            : x.answer;
                                        return {
                                          ...x,
                                          options: nextOpts,
                                          answer: nextAnswer,
                                        };
                                      } else {
                                        const arr = Array.isArray(x.answer)
                                          ? x.answer
                                          : [];
                                        const nextAns = arr.filter(
                                          (id) => id !== opt.id,
                                        );
                                        return {
                                          ...x,
                                          options: nextOpts,
                                          answer: nextAns.length
                                            ? nextAns
                                            : [nextOpts[0]?.id].filter(Boolean),
                                        };
                                      }
                                    }),
                                  }));
                                }}
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}

                        <button
                          type="button"
                          className="courses-btn"
                          onClick={() => {
                            setQuiz((prev) => ({
                              ...prev,
                              questions: prev.questions.map((x) => {
                                if (x.id !== qq.id) return x;
                                const nextId = makeId("opt");
                                const nextOpt = {
                                  id: nextId,
                                  label: `Opcja ${nextId.toUpperCase()}`,
                                };
                                const nextOpts = [
                                  ...(x.options || []),
                                  nextOpt,
                                ];

                                const nextAnswer =
                                  x.type === "radio"
                                    ? x.answer || nextId
                                    : Array.isArray(x.answer) && x.answer.length
                                      ? x.answer
                                      : [nextId];

                                return {
                                  ...x,
                                  options: nextOpts,
                                  answer: nextAnswer,
                                };
                              }),
                            }));
                          }}
                        >
                          + Dodaj opcję
                        </button>
                      </div>
                    )}

                    {qq.type === "text" && (
                      <div style={{ display: "grid", gap: 8 }}>
                        <div className="muted">
                          Akceptowane odpowiedzi (1 linia = 1 odpowiedź)
                        </div>
                        <textarea
                          rows={4}
                          style={{ width: "100%" }}
                          value={(Array.isArray(qq.answer)
                            ? qq.answer
                            : [qq.answer]
                          )
                            .filter(Boolean)
                            .join("\n")}
                          onChange={(e) => {
                            const lines = e.target.value
                              .split("\n")
                              .map((x) => x.trim())
                              .filter(Boolean);

                            setQuiz((prev) => ({
                              ...prev,
                              questions: prev.questions.map((x) =>
                                x.id === qq.id ? { ...x, answer: lines } : x,
                              ),
                            }));
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button className="courses-btn" type="button" onClick={handleSave}>
            ZAPISZ
          </button>
          <button
            className="courses-btn courses-btn--ghost"
            type="button"
            onClick={() => navigate(`/courses/${courseId}`)}
          >
            ANULUJ
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
