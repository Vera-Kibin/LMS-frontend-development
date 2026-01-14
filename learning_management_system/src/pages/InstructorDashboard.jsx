import DashboardLayout from "../components/DashboardLayout.jsx";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useProgress } from "../context/ProgressContext.jsx";
import { calcXP, calcLevelFromXP, BADGES } from "../utils/gamification.jsx";
import { useQuoteOfTheDay } from "../hooks/useQuoteOfTheDay.jsx";

function QuoteWidget() {
  const { data, isLoading, isError, refetch, isFetching } = useQuoteOfTheDay();

  if (isLoading) return <p className="muted">Ładowanie cytatu…</p>;

  if (isError) {
    return (
      <div className="dash-quote">
        <p className="muted">Nie udało się pobrać cytatu.</p>
        <button className="btn-ghost" onClick={() => refetch()}>
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  return (
    <div className="dash-quote">
      <p className="dash-quote__text">“{data.text}”</p>
      <p className="muted">— {data.author}</p>

      <button className="btn-ghost" onClick={() => refetch()}>
        {isFetching ? "Odświeżanie…" : "Odśwież"}
      </button>
    </div>
  );
}

export default function InstructorDashboard() {
  const { uzytkownik } = useAuth();
  const { progress } = useProgress();

  const name = uzytkownik?.name || "Instruktor";

  const xp = calcXP(progress);
  const lvl = calcLevelFromXP(xp);
  const needed = Math.max(0, lvl.nextMin - xp);
  const earnedBadges = BADGES.filter((b) => b.check(progress));

  return (
    <DashboardLayout
      title="Panel instruktora"
      topContent={
        <div className="dash-grid">
          <section className="dash-card">
            <h2>Witaj, {name}!</h2>
            <p className="muted">Rola: {uzytkownik?.role}</p>
          </section>

          <section className="dash-card">
            <h3>Poziom {lvl.level}</h3>
            <p className="muted">
              XP: {xp} • Do następnego: {needed} XP
            </p>
            <div
              className="levelbar"
              role="progressbar"
              aria-valuenow={lvl.percent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="levelbar__fill"
                style={{ width: `${lvl.percent}%` }}
              />
            </div>
          </section>

          <section className="dash-card">
            <h3>Odznaki</h3>
            {earnedBadges.length === 0 ? (
              <p className="muted">Brak odznak jeszcze.</p>
            ) : (
              <ul className="dash-badges">
                {earnedBadges.map((b) => (
                  <li key={b.id}>{b.title}</li>
                ))}
              </ul>
            )}
          </section>

          <section className="dash-card">
            <h3>Cytat dnia</h3>
            <QuoteWidget />
          </section>

          <section className="dash-card">
            <h3>Szybkie akcje</h3>
            <div className="dash-actions">
              <Link className="dash-action" to="/courses">
                Kursy
              </Link>
              <Link className="dash-action" to="/forum">
                Forum
              </Link>
            </div>
          </section>
        </div>
      }
    />
  );
}
