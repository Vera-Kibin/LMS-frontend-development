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
import { useState } from "react";

export default function CoursesPage() {
  const { courses, setCourses } = useCourses();
  const { uzytkownik } = useAuth();

  const canEdit =
    uzytkownik?.role === "instructor" || uzytkownik?.role === "admin";

  const [szkic, setSzkic] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [bylaZmiana, setBylaZmiana] = useState(false);

  const listaDoPokazywania = isEdit ? szkic : courses;

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

      <SortableList
        items={listaDoPokazywania}
        editable={canEdit && isEdit}
        onReorder={handleReorderCourses}
        className="courses-grid"
        itemClassName="course-card"
        renderItem={(c) => (
          <>
            <h3 className="course-card__title">{c.title}</h3>
            <p>{c.modules.length} modułów</p>
            <Link to={`/courses/${c.id}`} className="course-link">
              Otwórz
            </Link>
          </>
        )}
      />
    </DashboardLayout>
  );
}
