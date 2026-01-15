import SortableList from "./SortableList.jsx";
import { Link } from "react-router-dom";

export default function CourseStruktura({
  course,
  editable = false,
  onReorderModules,
  onReorderLessons,
}) {
  return (
    <div className="course-outline">
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
              renderItem={(lesson) =>
                editable ? (
                  <div className="lesson-row">
                    {lesson.title}{" "}
                    <span className="muted">
                      ({lesson.durationMinutes} min)
                    </span>
                  </div>
                ) : (
                  <Link
                    className="lesson-row"
                    to={`/courses/${course.id}/lessons/${lesson.id}`}
                  >
                    {lesson.title}{" "}
                    <span className="muted">
                      ({lesson.durationMinutes} min)
                    </span>
                  </Link>
                )
              }
            />
          </>
        )}
      />
    </div>
  );
}
