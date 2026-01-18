import DashboardLayout from "../../components/DashboardLayout.jsx";
import SortableList from "../../components/SortableList.jsx";
import { Link } from "react-router-dom";
import { useCourses } from "../../context/CoursesContext.jsx";
import { reOrder } from "../../utils/reOrder.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useState, useMemo } from "react";
import { useProgress } from "../../context/ProgressContext.jsx";
import { calcCourseProgress } from "../../utils/progress.jsx";

export default function CoursesPage() {
  const { courses, setCourses } = useCourses();
  const { uzytkownik } = useAuth();
  const { progress } = useProgress();

  const canEdit =
    uzytkownik?.role === "instructor" || uzytkownik?.role === "admin";

  const [szkic, setSzkic] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [bylaZmiana, setBylaZmiana] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("manual");
  const effectiveSort = isEdit ? "none" : sort;
  function highlight(text, q) {
    const safeText = String(text ?? "");
    const query = (q || "").trim();
    if (!query) return safeText;

    const idx = safeText.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return safeText;

    const before = safeText.slice(0, idx);
    const match = safeText.slice(idx, idx + query.length);
    const after = safeText.slice(idx + query.length);

    return (
      <>
        {before}
        <mark className="hl">{match}</mark>
        {after}
      </>
    );
  }

  const listaDoPokazywania = isEdit ? szkic : courses;
  const statsByCourseId = useMemo(() => {
    const completed = progress.completedLessons ?? {};
    const map = {};
    for (const c of courses) {
      map[c.id] = calcCourseProgress(c, completed);
    }
    return map;
  }, [courses, progress.completedLessons]);

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase();

    const base = (listaDoPokazywania || []).filter((c) => {
      if (!q) return true;
      return (c.title || "").toLowerCase().includes(q);
    });

    const copy = [...base];

    if (effectiveSort === "az") {
      copy.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (effectiveSort === "za") {
      copy.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
    } else if (effectiveSort === "progress") {
      copy.sort((a, b) => {
        const pa = statsByCourseId[a.id]?.percent ?? 0;
        const pb = statsByCourseId[b.id]?.percent ?? 0;
        return pb - pa;
      });
    }

    return copy;
  }, [listaDoPokazywania, query, effectiveSort, statsByCourseId]);

  function handleEdit() {
    if (!canEdit) return;
    setSzkic(structuredClone(courses));
    setIsEdit(true);
    setBylaZmiana(false);
  }

  function handleSave() {
    if (!canEdit || !szkic) return;
    setCourses(szkic);
    setSort("manual");
    setSzkic(null);
    setIsEdit(false);
    setBylaZmiana(false);
  }

  function handleAnuluj() {
    setSzkic(null);
    setIsEdit(false);
    setBylaZmiana(false);
  }

  function handleReorderCourses(fromId, toId) {
    if (!canEdit || !isEdit) return;
    setSzkic((prev) => reOrder(prev, fromId, toId));
    setBylaZmiana(true);
  }

  return (
    <DashboardLayout title="Kursy">
      <div className="courses-tools">
        <div className="courses-tools__left">
          <input
            className="courses-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Szukaj kursu…"
            aria-label="Szukaj kursu"
          />
        </div>

        <div className="courses-tools__right">
          <select
            className="courses-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            disabled={isEdit}
            aria-label="Sortowanie"
          >
            <option value="manual">Ręcznie</option>
            <option value="az">A–Z</option>
            <option value="za">Z–A</option>
            <option value="progress">Postęp</option>
          </select>

          <div className="courses-count muted">
            Znaleziono: {filteredSorted.length}
          </div>

          {canEdit && !isEdit && (
            <button className="courses-btn" onClick={handleEdit}>
              EDYTUJ
            </button>
          )}

          {canEdit && isEdit && (
            <>
              <button
                className="courses-btn"
                onClick={handleSave}
                disabled={!bylaZmiana}
              >
                ZAPISZ
              </button>
              <button
                className="courses-btn courses-btn--ghost"
                onClick={handleAnuluj}
              >
                ANULUJ
              </button>
            </>
          )}
        </div>
      </div>

      {canEdit && isEdit && !bylaZmiana && (
        <p className="hint">* Wprowadź zmianę, aby móc zapisać</p>
      )}
      <SortableList
        items={filteredSorted}
        editable={canEdit && isEdit}
        onReorder={handleReorderCourses}
        className="courses-grid"
        itemClassName="course-card"
        renderItem={(c) => {
          const st = statsByCourseId[c.id] ?? { percent: 0, done: 0, total: 0 };

          return (
            <>
              <div className="course-card__top">
                <div>
                  <h3 className="course-card__title">
                    {highlight(c.title, query)}
                  </h3>{" "}
                  <p className="muted">{c.modules.length} modułów</p>
                </div>

                <Link to={`/courses/${c.id}`} className="course-card__action">
                  Przeglądaj
                </Link>
              </div>

              <div className="course-progress">
                <div className="course-progress__top">
                  <span className="muted">
                    Postęp: {st.percent}% ({st.done}/{st.total})
                  </span>
                </div>

                <div
                  className="course-progress__bar"
                  role="progressbar"
                  aria-valuenow={st.percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="course-progress__fill"
                    style={{ width: `${st.percent}%` }}
                  />
                </div>
              </div>
            </>
          );
        }}
      />
    </DashboardLayout>
  );
}
