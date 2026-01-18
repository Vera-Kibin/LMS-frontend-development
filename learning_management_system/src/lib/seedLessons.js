import { lessonContentById } from "../data/lessonContent.jsx";

function toSegments(oldTranscript = []) {
  return oldTranscript
    .filter((x) => typeof x?.t === "number" && x?.text)
    .map((seg, i, arr) => {
      const nextT = arr[i + 1]?.t;
      return {
        start: seg.t,
        end: typeof nextT === "number" ? nextT : seg.t + 2,
        text: String(seg.text),
      };
    });
}

export function hydrateCoursesFromLessonContent(courses) {
  let changed = false;

  const next = courses.map((course) => ({
    ...course,
    modules: course.modules.map((m) => ({
      ...m,
      lessons: m.lessons.map((l) => {
        const extra = lessonContentById[l.id];
        if (!extra) return l;

        const alreadyHydrated =
          "videoUrl" in l ||
          "transcript" in l ||
          "materials" in l ||
          "bullets" in l ||
          "description" in l;

        if (alreadyHydrated) return l;

        changed = true;
        return {
          ...l,
          videoUrl: extra.videoSrc ?? null,
          transcript: toSegments(extra.transcript ?? []),
          description: extra.description ?? "",
          materials: extra.materials ?? [],
          bullets: extra.bullets ?? [],
        };
      }),
    })),
  }));

  return { next, changed };
}
