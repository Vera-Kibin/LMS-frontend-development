import DashboardLayout from "../components/DashboardLayout.jsx";
import { initialCourses } from "../data/courses.jsx";
import { useState } from "react";
import CourseStruktura from "../components/CourseStruktura.jsx";
import { reOrder } from "../utils/reOrder.jsx";

export default function InstructorDashboard() {
  const [courses, setCourses] = useState(initialCourses);
  const currentCourse = courses[0];

  const [szkic, setSzkic] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [bylaZmiana, setBylaZmiana] = useState(false);

  function handleEdit() {
    setSzkic(structuredClone(currentCourse));
    setIsEdit(true);
    setBylaZmiana(false);
  }
  function handleSave() {
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
    if (!isEdit) return;
    setSzkic((i) => ({ ...i, modules: reOrder(i.modules, fromId, toId) }));
    setBylaZmiana(true);
  }

  return (
    <DashboardLayout title="Panel instruktora">
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
      <CourseStruktura
        course={isEdit ? szkic : currentCourse}
        editable={isEdit}
        onReorderModules={handleReorderModules}
      />
    </DashboardLayout>
  );
}
