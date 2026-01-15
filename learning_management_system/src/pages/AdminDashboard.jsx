// src/pages/AdminDashboard.jsx
import DashboardLayout from "../components/DashboardLayout.jsx";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
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

export default function AdminDashboard() {
  const { uzytkownik } = useAuth();

  const displayName =
    (uzytkownik?.name && uzytkownik.name.trim()) ||
    (uzytkownik?.id && String(uzytkownik.id).split(":")[1]) ||
    "Administrator";

  return (
    <DashboardLayout
      title="Panel administratora"
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
                      <h3>Status</h3>
                      <p className="muted">Panel administracyjny</p>
                      <div className="hint">
                        Możesz zarządzać danymi systemu.
                      </div>
                    </div>

                    <div className="home__miniCard">
                      <Link to="/admin/grid" className="mini-tile">
                        <div className="mini-tile__title">Admin Grid</div>
                        <div className="mini-tile__desc">
                          Użytkownicy • sortowanie • filtrowanie
                        </div>
                      </Link>
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
              <div className="muted">Przeglądaj kursy</div>
            </Link>

            <Link className="home__actionCard" to="/forum" data-icon="chat">
              <div className="home__actionTitle">Forum</div>
              <div className="muted">Dyskusje i pytania</div>
            </Link>

            <div
              className="home__actionCard is-soon"
              aria-disabled="true"
              data-icon="soon"
            >
              <div className="home__actionTitle">Soon</div>
              <div className="muted">W przygotowaniu</div>
            </div>
          </div>
        </div>
      }
    />
  );
}
