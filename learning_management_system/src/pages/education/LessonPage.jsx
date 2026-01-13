import DashboardLayout from "../../components/DashboardLayout.jsx";
import { useParams, Link } from "react-router-dom";
import { useMemo, useRef, useState, useEffect } from "react";
import { useCourses } from "../../context/CoursesContext.jsx";
import QuizEngine from "../../components/QuizEngine.jsx";
import { quizzesByLessonId } from "../../data/quizzes.jsx";
import { lessonContentById } from "../../data/lessonContent.jsx";
import { useProgress } from "../../context/ProgressContext.jsx";

export default function LessonPage() {
  const { courseId, lessonId } = useParams();

  const quiz = quizzesByLessonId[lessonId];

  const { courses } = useCourses();

  const { progress, markVideoWatched, markQuizPassed, markLessonCompleted } =
    useProgress();

  const content = lessonContentById[lessonId] ?? {
    videoSrc: null,
    transcript: [],
    description: "",
  };

  const videoSrc = content.videoSrc;
  const transcript = content.transcript;

  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const hasVideo = Boolean(videoSrc);
  const hasTranscript = Array.isArray(transcript) && transcript.length > 0;
  const quizDone = Boolean(progress.quizPassed?.[lessonId]);
  const videoDone = Boolean(progress.videoWatched?.[lessonId]);

  useEffect(() => {
    const needVideo = Boolean(videoSrc);
    const done = quizDone && (!needVideo || videoDone);

    if (done && !progress.completedLessons?.[lessonId]) {
      markLessonCompleted(lessonId);
    }
  }, [
    quizDone,
    videoDone,
    videoSrc,
    lessonId,
    progress.completedLessons,
    markLessonCompleted,
  ]);
  const hasMedia = hasVideo && hasTranscript;
  const activeLineRef = useRef(null);

  const [duration, setDuration] = useState(0);
  const [videoMarked, setVideoMarked] = useState(false);

  function onLoadedMetadata() {
    const d = videoRef.current?.duration ?? 0;
    setDuration(d);
  }

  const { course, lesson, module } = useMemo(() => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return { course: null, module: null, lesson: null };

    for (const m of course.modules) {
      const l = m.lessons.find((x) => x.id === lessonId);
      if (l) return { course, module: m, lesson: l };
    }
    return { course, module: null, lesson: null };
  }, [courses, courseId, lessonId]);

  const activeIndex = useMemo(() => {
    let idx = 0;
    for (let i = 0; i < transcript.length; i++) {
      if (transcript[i].t <= currentTime) idx = i;
      else break;
    }
    return idx;
  }, [currentTime, transcript]);
  useEffect(() => {
    activeLineRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [activeIndex]);

  if (!course || !lesson) {
    return (
      <DashboardLayout title="Lekcja">
        <p>Nie znaleziono lekcji.</p>
        <Link className="layout_back" to="/courses">
          KURSY
        </Link>
      </DashboardLayout>
    );
  }

  function onTimeUpdate() {
    const t = videoRef.current?.currentTime ?? 0;
    setCurrentTime(t);

    if (!videoMarked && duration > 0 && t / duration >= 0.9) {
      setVideoMarked(true);
      markVideoWatched(lessonId);
    }
  }

  function seekTo(t) {
    if (!videoRef.current) return;
    videoRef.current.currentTime = t;
    videoRef.current.play();
  }

  return (
    <DashboardLayout title={lesson.title}>
      <div className="lesson-page">
        <div className="lesson-breadcrumbs">
          <Link to="/courses">Kursy</Link>
          <span>›</span>
          <Link to={`/courses/${course.id}`}>{course.title}</Link>
          <span>›</span>
          <span className="muted">{module?.title}</span>
        </div>
        {content.description && (
          <section className="lesson-card lesson-desc">
            <h3 className="lesson-card__title">O lekcji</h3>
            <p className="lesson-desc__text">{content.description}</p>
          </section>
        )}
        {(Array.isArray(content.materials) && content.materials.length > 0) ||
        (Array.isArray(content.bullets) && content.bullets.length > 0) ? (
          <section className="lesson-card lesson-text">
            <h3 className="lesson-card__title">Materiały</h3>

            {Array.isArray(content.materials) &&
              content.materials.map((p, idx) => (
                <p key={idx} className="lesson-text__p">
                  {p}
                </p>
              ))}

            {Array.isArray(content.bullets) && content.bullets.length > 0 && (
              <ul className="lesson-text__ul">
                {content.bullets.map((it, i) => (
                  <li key={i}>{it}</li>
                ))}
              </ul>
            )}
          </section>
        ) : null}
        {hasMedia && (
          <section className="lesson-card lesson-media">
            <div className="lesson-layout">
              <div className="lesson-video">
                <video
                  ref={videoRef}
                  controls
                  src={videoSrc}
                  onTimeUpdate={onTimeUpdate}
                  onLoadedMetadata={onLoadedMetadata}
                />
              </div>

              <div className="lesson-transcript">
                <h3>Transkrypcja</h3>
                <div className="transcript-list">
                  {transcript.map((line, i) => (
                    <button
                      key={line.t}
                      ref={i === activeIndex ? activeLineRef : null}
                      type="button"
                      className={
                        "transcript-line" +
                        (i === activeIndex ? " is-active" : "")
                      }
                      onClick={() => seekTo(line.t)}
                    >
                      <span className="text">{line.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
        {quiz && (
          <section className="lesson-card lesson-cta">
            <h3 className="lesson-card__title">Sprawdź wiedzę</h3>
            <p className="muted">Odpowiedz na pytania, aby zaliczyć lekcję.</p>
          </section>
        )}

        {quiz && (
          <QuizEngine
            quiz={quiz}
            onPassed={() => {
              markQuizPassed(lessonId);
            }}
          />
        )}

        <Link className="layout_back" to={`/courses/${course.id}`}>
          Wróć do kursu
        </Link>
      </div>
    </DashboardLayout>
  );
}
