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
export function uid(prefix = "id") {
  if (crypto?.randomUUID) return `${prefix}_${crypto.randomUUID()}`;
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}
export const db = {
  // USERS
  getUsers() {
    return safeParse(localStorage.getItem(KEYS.USERS), []);
  },
  setUsers(users) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },
  deleteUser(userId) {
    const session = db.getSession();
    const deletedCurrentUser = session?.userId === userId;

    const users = db.getUsers().filter((u) => u.id !== userId);
    db.setUsers(users);

    const allProgress = db.getAllProgress();
    if (userId in allProgress) {
      delete allProgress[userId];
      db.setAllProgress(allProgress);
    }

    const allBadges = db.getAllBadges();
    if (userId in allBadges) {
      delete allBadges[userId];
      db.setAllBadges(allBadges);
    }

    if (deletedCurrentUser) {
      db.clearSession();
    }

    return { deletedCurrentUser };
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
  getAllBadges() {
    return safeParse(localStorage.getItem(KEYS.BADGES), {});
  },
  setAllBadges(map) {
    localStorage.setItem(KEYS.BADGES, JSON.stringify(map));
  },
  getBadges(userId, fallback = {}) {
    const all = db.getAllBadges();
    return all[userId] ?? fallback;
  },
  setBadges(userId, badges) {
    const all = db.getAllBadges();
    all[userId] = badges;
    db.setAllBadges(all);
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
