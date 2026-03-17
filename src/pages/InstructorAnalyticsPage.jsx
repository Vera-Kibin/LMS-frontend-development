import DashboardLayout from "../components/DashboardLayout.jsx";
import { useMemo } from "react";
import { db } from "../lib/storage.js";
import { calcXP, calcLevelFromXP } from "../utils/gamification.jsx";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function calcCompletion(progress) {
  const completed = Object.keys(progress?.completedLessons || {}).length;
  const videos = Object.keys(progress?.videoWatched || {}).length;
  const quizzes = Object.keys(progress?.quizPassed || {}).length;

  return Math.min(100, completed * 20 + quizzes * 15 + videos * 5);
}

function buildDemoStudents() {
  const demoProgress = [
    {
      id: "demo-1",
      name: "Anna",
      progress: {
        completedLessons: { l1: true, l2: true, l3: true },
        videoWatched: { l1: true, l2: true, l3: true, l4: true },
        quizPassed: { l1: true, l2: true },
      },
    },
    {
      id: "demo-2",
      name: "Marek",
      progress: {
        completedLessons: { l1: true },
        videoWatched: { l1: true, l2: true },
        quizPassed: {},
      },
    },
    {
      id: "demo-3",
      name: "Ola",
      progress: {
        completedLessons: { l1: true, l2: true, l3: true, l4: true, l5: true },
        videoWatched: { l1: true, l2: true, l3: true, l4: true, l5: true },
        quizPassed: { l1: true, l2: true, l3: true },
      },
    },
    {
      id: "demo-4",
      name: "Jan",
      progress: {
        completedLessons: { l1: true, l2: true },
        videoWatched: { l1: true, l2: true, l3: true },
        quizPassed: { l1: true },
      },
    },
    {
      id: "demo-5",
      name: "Kasia",
      progress: {
        completedLessons: {},
        videoWatched: { l1: true },
        quizPassed: {},
      },
    },
    {
      id: "demo-6",
      name: "Piotr",
      progress: {
        completedLessons: { l1: true, l2: true, l3: true, l4: true },
        videoWatched: { l1: true, l2: true, l3: true, l4: true },
        quizPassed: { l1: true, l2: true },
      },
    },
    {
      id: "demo-7",
      name: "Natalia",
      progress: {
        completedLessons: { l1: true, l2: true, l3: true },
        videoWatched: { l1: true, l2: true, l3: true },
        quizPassed: { l1: true },
      },
    },
    {
      id: "demo-8",
      name: "Tomek",
      progress: {
        completedLessons: { l1: true, l2: true },
        videoWatched: { l1: true, l2: true, l3: true, l4: true },
        quizPassed: { l1: true, l2: true },
      },
    },
    {
      id: "demo-9",
      name: "Julia",
      progress: {
        completedLessons: { l1: true },
        videoWatched: { l1: true },
        quizPassed: {},
      },
    },
    {
      id: "demo-10",
      name: "Michał",
      progress: {
        completedLessons: { l1: true, l2: true, l3: true, l4: true },
        videoWatched: { l1: true, l2: true, l3: true, l4: true, l5: true },
        quizPassed: { l1: true, l2: true, l3: true },
      },
    },
    {
      id: "demo-11",
      name: "Paulina",
      progress: {
        completedLessons: { l1: true, l2: true },
        videoWatched: { l1: true, l2: true },
        quizPassed: { l1: true },
      },
    },
    {
      id: "demo-12",
      name: "Bartek",
      progress: {
        completedLessons: {},
        videoWatched: { l1: true, l2: true },
        quizPassed: {},
      },
    },
  ];

  return demoProgress.map((student) => {
    const xp = calcXP(student.progress);
    const lvl = calcLevelFromXP(xp);
    const completion = calcCompletion(student.progress);

    return {
      id: student.id,
      name: student.name,
      xp,
      level: lvl.level,
      percent: lvl.percent,
      completion,
    };
  });
}

export default function InstructorAnalyticsPage() {
  const analytics = useMemo(() => {
    const users = db.getUsers();
    const allProgress = db.getAllProgress();

    const realStudents = users
      .filter((u) => u.role === "student")
      .map((u) => {
        const p = allProgress[u.id] ?? {
          completedLessons: {},
          videoWatched: {},
          quizPassed: {},
        };

        const xp = calcXP(p);
        const lvl = calcLevelFromXP(xp);
        const completion = calcCompletion(p);

        return {
          id: u.id,
          name: u.name,
          xp,
          level: lvl.level,
          percent: lvl.percent,
          completion,
        };
      });

    const source =
      realStudents.length >= 5 ? realStudents : buildDemoStudents();

    const topStudents = [...source].sort((a, b) => b.xp - a.xp).slice(0, 6);

    const byLevelMap = source.reduce((acc, s) => {
      const key = `Lvl ${s.level}`;
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

    const studentsByLevel = Object.entries(byLevelMap).map(
      ([level, count]) => ({
        level,
        count,
      }),
    );

    const totalStudents = source.length;
    const avgXP =
      totalStudents > 0
        ? Math.round(source.reduce((sum, s) => sum + s.xp, 0) / totalStudents)
        : 0;

    const avgCompletion =
      totalStudents > 0
        ? Math.round(
            source.reduce((sum, s) => sum + s.completion, 0) / totalStudents,
          )
        : 0;

    const maxLevel =
      totalStudents > 0 ? Math.max(...source.map((s) => s.level)) : 0;

    const activeLearners = source.filter((s) => s.xp > 0).length;

    const strongestStudent = [...source].sort((a, b) => b.xp - a.xp)[0] ?? null;

    return {
      source,
      topStudents,
      studentsByLevel,
      totalStudents,
      avgXP,
      avgCompletion,
      maxLevel,
      activeLearners,
      strongestStudent,
      isDemo: realStudents.length < 5,
    };
  }, []);

  return (
    <DashboardLayout title="Statystyki instruktora">
      <section className="analytics-page">
        <div className="analytics-page__head">
          <div>
            <h2>Przegląd aktywności studentów</h2>
            <p className="muted">
              {analytics.isDemo
                ? "Widok demonstracyjny oparty na seeded data."
                : "Dane obliczone na podstawie postępów użytkowników."}
            </p>
          </div>
        </div>

        <div className="analytics-summary">
          <div className="analytics-summary__card analytics-summary__card--blue">
            <h3>{analytics.totalStudents}</h3>
            <p>Studenci</p>
          </div>

          <div className="analytics-summary__card analytics-summary__card--violet">
            <h3>{analytics.avgXP}</h3>
            <p>Średnie XP</p>
          </div>

          <div className="analytics-summary__card analytics-summary__card--gold">
            <h3>{analytics.avgCompletion}%</h3>
            <p>Średni completion</p>
          </div>

          <div className="analytics-summary__card analytics-summary__card--blueSoft">
            <h3>{analytics.activeLearners}</h3>
            <p>Aktywni studenci</p>
          </div>
        </div>

        <div className="analytics-insights">
          <div className="analytics-note">
            <h4>Najaktywniejszy student</h4>
            {analytics.strongestStudent ? (
              <p className="muted">
                <strong>{analytics.strongestStudent.name}</strong> osiągnął
                najwyższy wynik:{" "}
                <strong>{analytics.strongestStudent.xp} XP</strong>, poziom{" "}
                <strong>{analytics.strongestStudent.level}</strong>, completion{" "}
                <strong>{analytics.strongestStudent.completion}%</strong>.
              </p>
            ) : (
              <p className="muted">Brak danych.</p>
            )}
          </div>

          <div className="analytics-note">
            <h4>Jak liczone są metryki?</h4>
            <p className="muted">
              XP bazuje na ukończonych lekcjach, obejrzanych materiałach video i
              zaliczonych quizach. Completion to uproszczony wskaźnik postępu
              używany do demonstracji panelu instruktora.
            </p>
          </div>
        </div>

        <div className="analytics-grid analytics-grid--page">
          <div className="analytics-panel">
            <div className="analytics-panel__head">
              <h4>Studenci wg poziomu</h4>
              <p className="muted">Rozkład użytkowników między poziomami.</p>
            </div>

            <div className="chart-box">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={analytics.studentsByLevel}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                  <XAxis dataKey="level" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4b4f9d" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="analytics-panel">
            <div className="analytics-panel__head">
              <h4>Top studenci wg XP</h4>
              <p className="muted">Najwyższe wyniki aktywności w platformie.</p>
            </div>

            <div className="chart-box">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={analytics.topStudents}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="xp" fill="#f2d06b" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="analytics-tableWrap">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Poziom</th>
                <th>XP</th>
                <th>Completion</th>
              </tr>
            </thead>
            <tbody>
              {analytics.topStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>Lvl {student.level}</td>
                  <td>{student.xp}</td>
                  <td>{student.completion}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
}
