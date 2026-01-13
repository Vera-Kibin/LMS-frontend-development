import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CourseStruktura from "../../components/CourseStruktura.jsx";
import DashboardLayout from "../../components/DashboardLayout.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCourses } from "../../context/CoursesContext.jsx";
import { reOrder } from "../../utils/reOrder.jsx";

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

  const kursDoPokazywania = isEdit ? szkic : currentCourse;

  return (
    <DashboardLayout title={currentCourse.title}>
      <div className="lesson-breadcrumbs">
        <Link to="/courses">Kursy</Link>
        <span>›</span>
        <span className="muted">{currentCourse.title}</span>
      </div>
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
            </>
          )}
        </>
      )}

      <CourseStruktura
        course={kursDoPokazywania}
        editable={canEdit && isEdit}
        onReorderModules={handleReorderModules}
        onReorderLessons={handleReorderLessons}
      />
      <Link className="layout_back" to="/courses">
        WROC
      </Link>
    </DashboardLayout>
  );
}
