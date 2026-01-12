import SortableList from "./SortableList.jsx";

export default function CourseStruktura({
  course,
  editable = false,
  onReorderModules,
  onReorderLessons,
}) {
  return (
    <div className="course-outline">
      <h2>{course.title}</h2>

      <SortableList
        items={course.modules}
        editable={editable}
        onReorder={onReorderModules}
        className="course-modules"
        itemClassName="module-card"
        renderItem={(module) => (
          <>
            <h3 className="module-card__title">{module.title}</h3>
            <SortableList
              items={module.lessons}
              editable={editable}
              onReorder={(fromId, toId) =>
                onReorderLessons(module.id, fromId, toId)
              }
              className="lesson-list"
              itemClassName="lesson-item"
              renderItem={(lesson) => (
                <div className="lesson-row">
                  {lesson.title}{" "}
                  <span className="muted">({lesson.durationMinutes} min)</span>
                </div>
              )}
            />
          </>
        )}
      />
    </div>
  );
}
