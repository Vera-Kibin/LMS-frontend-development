import SortableList from "./SortableList.jsx";

export default function CourseStruktura({
  course,
  editable = false,
  onReorderModules,
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
            <ul className="module-card__lessons">
              {module.lessons.map((lesson) => (
                <li key={lesson.id}>{lesson.title}</li>
              ))}
            </ul>
          </>
        )}
      />
    </div>
  );
}
