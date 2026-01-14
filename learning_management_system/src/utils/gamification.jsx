export function calcXP(progress) {
  const completed = Object.keys(progress.completedLessons || {}).length;
  const quizzes = Object.keys(progress.quizPassed || {}).length;
  const videos = Object.keys(progress.videoWatched || {}).length;

  return completed * 10 + quizzes * 15 + videos * 5;
}

export function calcLevelFromXP(xp) {
  const thresholds = [0, 50, 100, 170, 260, 360];
  let level = 1;

  for (let i = 0; i < thresholds.length; i++) {
    if (xp >= thresholds[i]) level = i + 1;
  }

  const currentMin = thresholds[level - 1] ?? 0;
  const nextMin = thresholds[level] ?? currentMin + 100;
  const within = xp - currentMin;
  const range = nextMin - currentMin;

  const percent = range <= 0 ? 100 : Math.round((within / range) * 100);
  return { level, currentMin, nextMin, percent };
}

export const BADGES = [
  {
    id: "first_lesson",
    title: "Pierwsza lekcja",
    check: (p) => Object.keys(p.completedLessons || {}).length >= 1,
  },
  {
    id: "first_quiz",
    title: "Pierwszy quiz",
    check: (p) => Object.keys(p.quizPassed || {}).length >= 1,
  },
  {
    id: "five_lessons",
    title: "5 lekcji",
    check: (p) => Object.keys(p.completedLessons || {}).length >= 5,
  },
];
