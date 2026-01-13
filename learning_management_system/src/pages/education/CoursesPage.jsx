// import DashboardLayout from "../../components/DashboardLayout.jsx";
// import { initialCourses } from "../../data/courses.jsx";
// import { Link } from "react-router-dom";

// export default function CoursesPage() {
//   return (
//     <DashboardLayout title="Kursy">
//       <div className="courses-grid">
//         {initialCourses.map((c) => (
//           <Link key={c.id} to={`/courses/${c.id}`} className="course-card">
//             <h3 className="course-card__title">{c.title}</h3>
//             <p>{c.modules.length} modułów</p>
//           </Link>
//         ))}
//       </div>
//     </DashboardLayout>
//   );
// }
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

  const listaDoPokazywania = isEdit ? szkic : courses;

  const statsByCourseId = useMemo(() => {
    const completed = progress.completedLessons ?? {};
    const map = {};
    for (const c of courses) {
      map[c.id] = calcCourseProgress(c, completed);
    }
    return map;
  }, [courses, progress.completedLessons]);

  function handleEdit() {
    if (!canEdit) return;
    setSzkic(structuredClone(courses));
    setIsEdit(true);
    setBylaZmiana(false);
  }

  function handleSave() {
    if (!canEdit || !szkic) return;
    setCourses(szkic);
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
      {/* твои кнопки edit/save/анулуй остаются */}

      <SortableList
        items={listaDoPokazywania}
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
                  <h3 className="course-card__title">{c.title}</h3>
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
