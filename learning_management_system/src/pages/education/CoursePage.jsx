import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CourseStruktura from "../../components/CourseStruktura.jsx";
import DashboardLayout from "../../components/DashboardLayout.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCourses } from "../../context/CoursesContext.jsx";
import { reOrder } from "../../utils/reOrder.jsx";
import { useProgress } from "../../context/ProgressContext.jsx";
import { calcCourseProgress } from "../../utils/progress.jsx";
import { uid } from "../../lib/storage.js";

export default function CoursePage() {
  const { courseId } = useParams();
  const { uzytkownik } = useAuth();

  const canEdit =
    uzytkownik?.role === "instructor" || uzytkownik?.role === "admin";

  const { courses, setCourses } = useCourses();

  const currentCourse = useMemo(
    () => courses.find((c) => c.id === courseId),
    [courses, courseId]
  );

  const [szkic, setSzkic] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [bylaZmiana, setBylaZmiana] = useState(false);

  if (!currentCourse) return <p>Nie znaleziono kursu.</p>;

  const { progress } = useProgress();
  const stats = useMemo(
    () => calcCourseProgress(currentCourse, progress.completedLessons),
    [currentCourse, progress.completedLessons]
  );

  function handleEdit() {
    if (!canEdit) return;
    setSzkic(structuredClone(currentCourse));
    setIsEdit(true);
    setBylaZmiana(false);
  }

  function handleSave() {
    if (!canEdit || !szkic) return;
    setCourses((p) => p.map((c) => (c.id === szkic.id ? szkic : c)));
    setSzkic(null);
    setIsEdit(false);
    setBylaZmiana(false);
  }

  function handleAnuluj() {
    setSzkic(null);
    setIsEdit(false);
    setBylaZmiana(false);
  }

  function handleReorderModules(fromId, toId) {
    if (!canEdit || !isEdit) return;
    setSzkic((i) => ({ ...i, modules: reOrder(i.modules, fromId, toId) }));
    setBylaZmiana(true);
  }
  function handleReorderLessons(moduleId, fromId, toId) {
    if (!canEdit || !isEdit) return;

    setSzkic((draft) => ({
      ...draft,
      modules: draft.modules.map((m) =>
        m.id !== moduleId
          ? m
          : { ...m, lessons: reOrder(m.lessons, fromId, toId) }
      ),
    }));

    setBylaZmiana(true);
  }
  function addModule() {
    if (!canEdit || !isEdit) return;

    const newModule = {
      id: uid("module"),
      title: "Nowy moduł",
      lessons: [],
    };

    setSzkic((d) => ({ ...d, modules: [...d.modules, newModule] }));
    setBylaZmiana(true);
  }

  function deleteModule(moduleId) {
    if (!canEdit || !isEdit) return;
    const ok = confirm("Usunąć moduł? Lekcje w środku też znikną.");
    if (!ok) return;

    setSzkic((d) => ({
      ...d,
      modules: d.modules.filter((m) => m.id !== moduleId),
    }));
    setBylaZmiana(true);
  }

  function renameModule(moduleId, title) {
    if (!canEdit || !isEdit) return;

    setSzkic((d) => ({
      ...d,
      modules: d.modules.map((m) => (m.id === moduleId ? { ...m, title } : m)),
    }));
    setBylaZmiana(true);
  }
  function addLesson(moduleId) {
    if (!canEdit || !isEdit) return;

    const newLesson = {
      id: uid("lesson"),
      title: "Nowa lekcja",
      durationMinutes: 5,
      videoUrl: null,
      transcript: [],
      description: "",
      materials: [],
      bullets: [],
    };

    setSzkic((d) => ({
      ...d,
      modules: d.modules.map((m) =>
        m.id !== moduleId ? m : { ...m, lessons: [...m.lessons, newLesson] }
      ),
    }));
    setBylaZmiana(true);
  }

  function deleteLesson(moduleId, lessonId) {
    if (!canEdit || !isEdit) return;

    const ok = confirm("Usunąć lekcję?");
    if (!ok) return;

    setSzkic((d) => ({
      ...d,
      modules: d.modules.map((m) =>
        m.id !== moduleId
          ? m
          : { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
      ),
    }));
    setBylaZmiana(true);
  }

  function renameLesson(moduleId, lessonId, title) {
    if (!canEdit || !isEdit) return;

    setSzkic((d) => ({
      ...d,
      modules: d.modules.map((m) =>
        m.id !== moduleId
          ? m
          : {
              ...m,
              lessons: m.lessons.map((l) =>
                l.id === lessonId ? { ...l, title } : l
              ),
            }
      ),
    }));
    setBylaZmiana(true);
  }

  function updateLesson(moduleId, lessonId, patch) {
    if (!canEdit || !isEdit) return;

    setSzkic((d) => ({
      ...d,
      modules: d.modules.map((m) =>
        m.id !== moduleId
          ? m
          : {
              ...m,
              lessons: m.lessons.map((l) =>
                l.id === lessonId ? { ...l, ...patch } : l
              ),
            }
      ),
    }));
    setBylaZmiana(true);
  }

  const kursDoPokazywania = isEdit ? szkic : currentCourse;

  return (
    <DashboardLayout title={currentCourse.title}>
      <div className="lesson-breadcrumbs">
        <Link to="/courses">Kursy</Link>
        <span>›</span>
        <span className="muted">{currentCourse.title}</span>
      </div>
      {isEdit ? (
        <label className="auth__field" style={{ marginTop: 12 }}>
          <input
            type="text"
            value={szkic?.title ?? ""}
            onChange={(e) => {
              setSzkic((d) => ({ ...d, title: e.target.value }));
              setBylaZmiana(true);
            }}
            placeholder="Nazwa kursu"
          />
        </label>
      ) : (
        <h2 style={{ marginTop: 12 }}>{currentCourse.title}</h2>
      )}
      <p className="muted">
        Postęp: {stats.percent}% ({stats.done}/{stats.total} lekcji)
      </p>
      {canEdit && (
        <>
          {!isEdit ? (
            <button className="layout_back" onClick={handleEdit}>
              EDYTUJ
            </button>
          ) : (
            <>
              <button
                className="layout_back"
                onClick={handleSave}
                disabled={!bylaZmiana}
              >
                ZAPISZ
              </button>
              <button className="layout_back" onClick={handleAnuluj}>
                ANULUJ
              </button>
              {!bylaZmiana && (
                <p className="hint">* Wprowadź zmianę, aby móc zapisać</p>
              )}
              {canEdit && isEdit && (
                <button className="layout_back" onClick={addModule}>
                  + MODUŁ
                </button>
              )}
            </>
          )}
        </>
      )}

      <CourseStruktura
        course={kursDoPokazywania}
        editable={canEdit && isEdit}
        onReorderModules={handleReorderModules}
        onReorderLessons={handleReorderLessons}
        onAddModule={addModule}
        onDeleteModule={deleteModule}
        onRenameModule={renameModule}
        onAddLesson={addLesson}
        onDeleteLesson={deleteLesson}
        onRenameLesson={renameLesson}
        onUpdateLesson={updateLesson}
      />
      <Link className="btn-ghost" to="/courses">
        Wróć do kursów
      </Link>
    </DashboardLayout>
  );
}
