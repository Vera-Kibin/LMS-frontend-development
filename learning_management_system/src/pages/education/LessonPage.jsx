import DashboardLayout from "../../components/DashboardLayout.jsx";
import { useParams, Link } from "react-router-dom";
import { useMemo, useRef, useState, useEffect } from "react";
import { useCourses } from "../../context/CoursesContext.jsx";

export default function LessonPage() {
  const { courseId, lessonId } = useParams();
  const { courses } = useCourses();

  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);

  const activeLineRef = useRef(null);

  const { course, lesson, module } = useMemo(() => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return { course: null, module: null, lesson: null };

    for (const m of course.modules) {
      const l = m.lessons.find((x) => x.id === lessonId);
      if (l) return { course, module: m, lesson: l };
    }
    return { course, module: null, lesson: null };
  }, [courses, courseId, lessonId]);

  const videoSrc = "/videos/lesson.mp4";
  const transcript = [
    { t: 0, text: "react a javascript library for building" },
    { t: 2, text: "user interfaces developed at facebook" },
    { t: 4, text: "and released in 2013 it's safe to say" },
    { t: 6, text: "react has been the most influential ui" },
    { t: 8, text: "library of recent memory we use it to" },
    { t: 10, text: "build components that represent logical" },
    { t: 12, text: "reusable parts of the ui the beauty of" },
    { t: 15, text: "react is that the simplicity of building" },
    { t: 17, text: "a component has been brought down to its" },
    { t: 18, text: "theoretical minimum it's just a" },
    { t: 20, text: "javascript function it's so easy a" },
    { t: 22, text: "caveman could do it the return value" },
    { t: 24, text: "from this function is your html or ui" },
    { t: 27, text: "which is written in a special syntax" },
    { t: 29, text: "called jsx allowing you to easily" },
    { t: 31, text: "combine javascript with html markup if" },
    { t: 33, text: "you want to pass data into a component" },
    { t: 35, text: "you simply pass it a props argument" },
    { t: 37, text: "which you can then reference inside the" },
    { t: 38, text: "function body or in the ui using braces" },
    { t: 41, text: "if the value changes react will react to" },
    { t: 43, text: "update the ui if we want to give our" },
    { t: 45, text: "component its own internal state we can" },
    { t: 47, text: "use the state hook the hook is just a" },
    { t: 49, text: "function that returns a value as well as" },
    { t: 51, text: "a function to change the value in this" },
    { t: 53, text: "case count is our reactive state and" },
    { t: 56, text: "setcount will change the state when used" },
    { t: 58, text: "in the template the count will always" },
    { t: 59, text: "show the most recent value then we can" },
    { t: 61, text: "bind set count to a button click event" },
    { t: 63, text: "so the user can change the state react" },
    { t: 65, text: "provides a variety of other built-in" },
    { t: 66, text: "hooks to handle common use cases but the" },
    { t: 69, text: "main reason you might want to use react" },

    { t: 70, text: "is not the library itself but the" },
    { t: 72, text: "massive ecosystem that surrounds it" },
    { t: 74, text: "react itself doesn't care about routing" },
    { t: 76, text: "state management animation or anything" },
    { t: 77, text: "like that instead it lets those concerns" },
    { t: 79, text: "evolve naturally within the open source" },
    { t: 81, text: "community no matter what you're trying" },
    { t: 82, text: "to do there's very likely a good" },
    { t: 84, text: "supporting library to help you get it" },

    { t: 86, text: "done need a static site you have gatsby" },
    { t: 88, text: "need server side rendering you have next" },
    { t: 90, text: "for animation you have spring for forums" },
    { t: 92, text: "you have formic state management you've" },
    { t: 93, text: "got redux mobx flux recoil x state and" },
    { t: 96, text: "more you have an endless supply of" },
    { t: 97, text: "choices to get things done the way you" },
    { t: 99, text: "like it as an added bonus once you have" },
    { t: 101, text: "reactdown you can easily jump into react" },
    { t: 103, text: "native and start building mobile apps" },
    { t: 105, text: "and it's no surprise that knowing this" },
    { t: 106, text: "little ui library is one of the most" },
    { t: 108, text: "in-demand skills for front-end" },
    { t: 109, text: "developers today this has been react in" },
    { t: 111, text: "100 seconds if you want to see more" },
    { t: 113, text: "short videos like this make sure to like" },
    { t: 115, text: "and subscribe and check out more" },
    { t: 116, text: "advanced react content on fire ship i o" },
    { t: 118, text: "and if you're curious how i make these" },
    { t: 119, text: "videos make sure to check out my new" },
    { t: 121, text: "personal channel and video on that topic" },
    { t: 123, text: "thanks for watching and i will see you" },
    { t: 125, text: "in the next one" },
  ];
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
  }

  function seekTo(t) {
    if (!videoRef.current) return;
    videoRef.current.currentTime = t;
    videoRef.current.play();
  }

  return (
    <DashboardLayout title={lesson.title}>
      <div className="lesson-layout">
        <div className="lesson-video">
          <video
            ref={videoRef}
            controls
            src={videoSrc}
            onTimeUpdate={onTimeUpdate}
          />
          <p className="muted">
            Kurs: {course.title} • Moduł: {module?.title}
          </p>
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
                  "transcript-line" + (i === activeIndex ? " is-active" : "")
                }
                onClick={() => seekTo(line.t)}
              >
                <span className="text">{line.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <Link className="layout_back" to={`/courses/${course.id}`}>
        Wróć do kursu
      </Link>
    </DashboardLayout>
  );
}
