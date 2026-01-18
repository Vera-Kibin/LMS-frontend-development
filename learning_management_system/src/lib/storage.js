const KEYS = {
  USERS: "lms:users",
  SESSION: "lms:session",
  COURSES: "lms:courses",
  FORUM_THREADS: "lms:forum:threads",
  BADGES: "lms:badges",
  PROGRESS: "lms:progress",
};

function safeParse(raw, fallback) {
  try {
    const v = JSON.parse(raw);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

const EMPTY = {
  completedLessons: {},
  videoWatched: {},
  quizPassed: {},
};

export const db = {
  // USERS
  getUsers() {
    return safeParse(localStorage.getItem(KEYS.USERS), []);
  },
  setUsers(users) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  // SESSION
  getSession() {
    return safeParse(localStorage.getItem(KEYS.SESSION), null);
  },
  setSession(session) {
    localStorage.setItem(KEYS.SESSION, JSON.stringify(session));
  },
  clearSession() {
    localStorage.removeItem(KEYS.SESSION);
  },

  // COURSES
  getCourses(fallback = []) {
    const raw = localStorage.getItem(KEYS.COURSES);
    if (!raw) {
      localStorage.setItem(KEYS.COURSES, JSON.stringify(fallback));
      return fallback;
    }
    try {
      const parsed = JSON.parse(raw);
      if (!parsed) {
        localStorage.setItem(KEYS.COURSES, JSON.stringify(fallback));
        return fallback;
      }

      return parsed;
    } catch {
      localStorage.setItem(KEYS.COURSES, JSON.stringify(fallback));
      return fallback;
    }
  },
  setCourses(courses) {
    localStorage.setItem(KEYS.COURSES, JSON.stringify(courses));
  },

  // BADGES
  getBadges(fallback = {}) {
    return safeParse(localStorage.getItem(KEYS.BADGES), fallback);
  },
  setBadges(badges) {
    localStorage.setItem(KEYS.BADGES, JSON.stringify(badges));
  },

  // FORUM
  getThreads(fallback = []) {
    return safeParse(localStorage.getItem(KEYS.FORUM_THREADS), fallback);
  },
  setThreads(threads) {
    localStorage.setItem(KEYS.FORUM_THREADS, JSON.stringify(threads));
  },

  // PROGRESS
  getAllProgress() {
    return safeParse(localStorage.getItem(KEYS.PROGRESS), {});
  },
  setAllProgress(map) {
    localStorage.setItem(KEYS.PROGRESS, JSON.stringify(map));
  },

  getProgress(userId) {
    const all = db.getAllProgress();
    return all[userId] ?? EMPTY;
  },

  setProgress(userId, progress) {
    const all = db.getAllProgress();
    all[userId] = progress;
    db.setAllProgress(all);
  },
};
