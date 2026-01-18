import DashboardLayout from "../components/DashboardLayout.jsx";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useProgress } from "../context/ProgressContext.jsx";
import { calcXP, calcLevelFromXP } from "../utils/gamification.jsx";
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

  const displayName =
    (uzytkownik?.name && uzytkownik.name.trim()) ||
    (uzytkownik?.id && String(uzytkownik.id).split(":")[1]) ||
    "Instruktor";

  const xp = calcXP(progress);
  const lvl = calcLevelFromXP(xp);
  const needed = Math.max(0, lvl.nextMin - xp);

  return (
    <DashboardLayout
      title="Panel instruktora"
      topContent={
        <div className="home">
          <div className="home__top">
            <div className="home__left">
              <section className="home__hero">
                <div className="home__heroMedia" aria-hidden="true">
                  <img src="/videos/stars.gif" alt="" className="hero-gif" />
                </div>

                <div className="home__heroBody">
                  <div className="home__heroText">
                    <h2 className="home__title">Witaj, {displayName}!</h2>
                    <p className="muted">Rola: {uzytkownik?.role}</p>
                  </div>

                  <div className="home__mini">
                    <div className="home__miniCard">
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
                    </div>

                    <div className="home__miniCard">
                      <h3>Narzędzia instruktora</h3>

                      <div className="badges">
                        <Link className="badge" to="/courses">
                          Zarządzaj kursami
                        </Link>

                        <Link className="badge" to="/forum">
                          Moderuj forum
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <section className="home__quote">
              <h3>Cytat dnia</h3>
              <QuoteWidget />
            </section>
          </div>

          <div className="home__bottom">
            <Link className="home__actionCard" to="/courses" data-icon="course">
              <div className="home__actionTitle">Kursy</div>
              <div className="muted">Zarządzaj kursami</div>
            </Link>

            <Link className="home__actionCard" to="/forum" data-icon="chat">
              <div className="home__actionTitle">Forum</div>
              <div className="muted">Moderacja dyskusji</div>
            </Link>

            <div
              className="home__actionCard is-soon"
              aria-disabled="true"
              data-icon="soon"
            >
              <div className="home__actionTitle">Statystyki</div>
              <div className="muted">W przygotowaniu</div>
            </div>
          </div>
        </div>
      }
    />
  );
}
