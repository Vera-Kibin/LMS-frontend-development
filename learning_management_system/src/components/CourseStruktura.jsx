import SortableList from "./SortableList.jsx";
import { Link } from "react-router-dom";

export default function CourseStruktura({
  course,
  editable = false,
  onReorderModules,
  onReorderLessons,
  onAddModule,
  onDeleteModule,
  onRenameModule,
  onAddLesson,
  onDeleteLesson,
  onRenameLesson,
  onUpdateLesson,
}) {
  return (
    <div className="course-outline">
      <SortableList
        items={course.modules || []}
        editable={editable}
        onReorder={onReorderModules}
        className="course-modules"
        itemClassName="module-card"
        renderItem={(module) => (
          <>
            {editable ? (
              <div
                className="module-card__header"
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <input
                  className="module-title-input"
                  value={module.title ?? ""}
                  onChange={(e) => onRenameModule?.(module.id, e.target.value)}
                  placeholder="Nazwa modułu"
                />

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    className="courses-btn"
                    onClick={() => onAddLesson?.(module.id)}
                  >
                    + LEKCJA
                  </button>

                  <button
                    type="button"
                    className="courses-btn courses-btn--ghost"
                    onClick={() => onDeleteModule?.(module.id)}
                  >
                    USUŃ
                  </button>
                </div>
              </div>
            ) : (
              <h3 className="module-card__title">{module.title}</h3>
            )}

            <SortableList
              items={module.lessons || []}
              editable={editable}
              onReorder={(fromId, toId) =>
                onReorderLessons?.(module.id, fromId, toId)
              }
              className="lesson-list"
              itemClassName="lesson-item"
              renderItem={(lesson) =>
                editable ? (
                  <div className="lesson-row lesson-row--edit">
                    <div className="lesson-row__main">
                      <input
                        className="lesson-row__title"
                        value={lesson.title ?? ""}
                        onChange={(e) =>
                          onRenameLesson?.(module.id, lesson.id, e.target.value)
                        }
                        placeholder="Nazwa lekcji"
                      />

                      <input
                        className="lesson-row__duration"
                        type="number"
                        min={1}
                        value={lesson.durationMinutes ?? 5}
                        onChange={(e) => {
                          const next = Math.max(1, Number(e.target.value || 1));
                          onUpdateLesson?.(module.id, lesson.id, {
                            durationMinutes: next,
                          });
                        }}
                        title="Czas trwania (min)"
                      />
                    </div>

                    <div className="lesson-row__actions">
                      <Link
                        className="courses-btn courses-btn--ghost"
                        to={`/courses/${course.id}/lessons/${lesson.id}/edit`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        EDYTUJ
                      </Link>

                      <button
                        type="button"
                        className="courses-btn courses-btn--ghost"
                        onClick={() => onDeleteLesson?.(module.id, lesson.id)}
                      >
                        USUŃ
                      </button>
                    </div>
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
