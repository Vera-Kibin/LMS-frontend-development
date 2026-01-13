export function calcCourseProgress(course, completedLessons) {
  const allLessonIds = course.modules.flatMap((m) =>
    m.lessons.map((l) => l.id)
  );
  const total = allLessonIds.length;
  const done = allLessonIds.filter((id) => completedLessons?.[id]).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  return { total, done, percent };
}
