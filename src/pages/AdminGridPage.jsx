// import DashboardLayout from "../components/DashboardLayout.jsx";
// import { useMemo, useState } from "react";

// function makeUsers(n = 150) {
//   const roles = ["student", "instructor", "admin"];
//   const first = [
//     "Vera",
//     "Jan",
//     "Ola",
//     "Kasia",
//     "Marek",
//     "Tomek",
//     "Ania",
//     "Piotr",
//   ];
//   const last = ["Nowak", "Kowalski", "Wiśniewski", "Wójcik", "Lewandowski"];

//   return Array.from({ length: n }).map((_, i) => {
//     const role = roles[i % roles.length];
//     const name = `${first[i % first.length]} ${last[i % last.length]} ${i + 1}`;
//     const email = `user${i + 1}@educate.me`;
//     const courses = (i * 7) % 9;
//     const progress = (i * 13) % 101;
//     return {
//       id: `${role}:${name}`,
//       name,
//       email,
//       role,
//       courses,
//       progress,
//     };
//   });
// }

// export default function AdminGridPage() {
//   const [rows] = useState(() => makeUsers(160));

//   const [q, setQ] = useState("");
//   const [roleFilter, setRoleFilter] = useState("all");
//   const [sortKey, setSortKey] = useState("name");
//   const [sortDir, setSortDir] = useState("asc");

//   const [page, setPage] = useState(1);
//   const pageSize = 10;

//   function toggleSort(key) {
//     if (sortKey === key) {
//       setSortDir((d) => (d === "asc" ? "desc" : "asc"));
//       return;
//     }
//     setSortKey(key);
//     setSortDir("asc");
//   }

//   const filteredSorted = useMemo(() => {
//     const query = q.trim().toLowerCase();

//     const filtered = rows.filter((r) => {
//       const matchQuery =
//         !query ||
//         r.name.toLowerCase().includes(query) ||
//         r.email.toLowerCase().includes(query) ||
//         r.role.toLowerCase().includes(query);

//       const matchRole = roleFilter === "all" ? true : r.role === roleFilter;

//       return matchQuery && matchRole;
//     });

//     const copy = [...filtered];
//     copy.sort((a, b) => {
//       const dir = sortDir === "asc" ? 1 : -1;

//       const av = a[sortKey];
//       const bv = b[sortKey];

//       if (typeof av === "number" && typeof bv === "number")
//         return (av - bv) * dir;

//       return String(av).localeCompare(String(bv), "pl") * dir;
//     });

//     return copy;
//   }, [rows, q, roleFilter, sortKey, sortDir]);

//   const total = filteredSorted.length;
//   const totalPages = Math.max(1, Math.ceil(total / pageSize));

//   const pageSafe = Math.min(page, totalPages);
//   const start = (pageSafe - 1) * pageSize;
//   const pageRows = filteredSorted.slice(start, start + pageSize);

//   useMemo(() => {
//     if (page !== pageSafe) setPage(pageSafe);
//   }, [page, pageSafe]);

//   return (
//     <DashboardLayout title="Admin Grid">
//       <div className="grid-tools">
//         <input
//           className="grid-search"
//           value={q}
//           onChange={(e) => {
//             setQ(e.target.value);
//             setPage(1);
//           }}
//           placeholder="Szukaj: imię / email / rola…"
//           aria-label="Szukaj użytkownika"
//         />

//         <select
//           className="grid-select"
//           value={roleFilter}
//           onChange={(e) => {
//             setRoleFilter(e.target.value);
//             setPage(1);
//           }}
//           aria-label="Filtr roli"
//         >
//           <option value="all">Wszystkie role</option>
//           <option value="student">student</option>
//           <option value="instructor">instructor</option>
//           <option value="admin">admin</option>
//         </select>

//         <div className="grid-meta muted">
//           {total} wyników • strona {pageSafe}/{totalPages}
//         </div>
//       </div>

//       <div className="grid-wrap" role="region" aria-label="Tabela użytkowników">
//         <table className="grid-table">
//           <thead>
//             <tr>
//               <th>
//                 <button
//                   className="th-btn"
//                   onClick={() => toggleSort("name")}
//                   type="button"
//                 >
//                   Imię{" "}
//                   {sortKey === "name" ? (sortDir === "asc" ? "▲" : "▼") : ""}
//                 </button>
//               </th>
//               <th>
//                 <button
//                   className="th-btn"
//                   onClick={() => toggleSort("email")}
//                   type="button"
//                 >
//                   Email{" "}
//                   {sortKey === "email" ? (sortDir === "asc" ? "▲" : "▼") : ""}
//                 </button>
//               </th>
//               <th>
//                 <button
//                   className="th-btn"
//                   onClick={() => toggleSort("role")}
//                   type="button"
//                 >
//                   Rola{" "}
//                   {sortKey === "role" ? (sortDir === "asc" ? "▲" : "▼") : ""}
//                 </button>
//               </th>
//               <th className="num">
//                 <button
//                   className="th-btn"
//                   onClick={() => toggleSort("courses")}
//                   type="button"
//                 >
//                   Kursy{" "}
//                   {sortKey === "courses" ? (sortDir === "asc" ? "▲" : "▼") : ""}
//                 </button>
//               </th>
//               <th className="num">
//                 <button
//                   className="th-btn"
//                   onClick={() => toggleSort("progress")}
//                   type="button"
//                 >
//                   Postęp %{" "}
//                   {sortKey === "progress"
//                     ? sortDir === "asc"
//                       ? "▲"
//                       : "▼"
//                     : ""}
//                 </button>
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {pageRows.map((r) => (
//               <tr key={r.id}>
//                 <td className="strong">{r.name}</td>
//                 <td className="muted">{r.email}</td>
//                 <td>
//                   <span className={`pill pill--${r.role}`}>{r.role}</span>
//                 </td>
//                 <td className="num">{r.courses}</td>
//                 <td className="num">{r.progress}</td>
//               </tr>
//             ))}

//             {pageRows.length === 0 ? (
//               <tr>
//                 <td colSpan={5} className="muted" style={{ padding: 14 }}>
//                   Brak wyników.
//                 </td>
//               </tr>
//             ) : null}
//           </tbody>
//         </table>
//       </div>

//       <div className="grid-pager">
//         <button
//           className="btn-ghost"
//           type="button"
//           onClick={() => setPage(1)}
//           disabled={pageSafe === 1}
//         >
//           « Pierwsza
//         </button>
//         <button
//           className="btn-ghost"
//           type="button"
//           onClick={() => setPage((p) => Math.max(1, p - 1))}
//           disabled={pageSafe === 1}
//         >
//           ‹ Prev
//         </button>

//         <span className="muted">
//           Strona <b>{pageSafe}</b> z <b>{totalPages}</b>
//         </span>

//         <button
//           className="btn-ghost"
//           type="button"
//           onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//           disabled={pageSafe === totalPages}
//         >
//           Next ›
//         </button>
//         <button
//           className="btn-ghost"
//           type="button"
//           onClick={() => setPage(totalPages)}
//           disabled={pageSafe === totalPages}
//         >
//           Ostatnia »
//         </button>
//       </div>
//     </DashboardLayout>
//   );
// }
import DashboardLayout from "../components/DashboardLayout.jsx";
import { useEffect, useMemo, useState } from "react";
import { db } from "../lib/storage.js";
import { useNavigate } from "react-router-dom";

function calcProgressPercent(progress) {
  const completedLessons = Object.keys(progress?.completedLessons ?? {}).length;
  const watchedVideos = Object.keys(progress?.videoWatched ?? {}).length;
  const passedQuizzes = Object.keys(progress?.quizPassed ?? {}).length;

  const totalSignals = completedLessons + watchedVideos + passedQuizzes;
  return Math.min(100, totalSignals * 10);
}

export default function AdminGridPage() {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const users = db.getUsers();
    const courses = db.getCourses([]);
    const allProgress = db.getAllProgress();

    const mapped = users.map((u) => {
      const userProgress = allProgress[u.id] ?? {
        completedLessons: {},
        videoWatched: {},
        quizPassed: {},
      };

      const coursesCount = courses.filter(
        (course) => course?.authorId === u.id || course?.instructorId === u.id,
      ).length;

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        courses: coursesCount,
        progress: calcProgressPercent(userProgress),
      };
    });

    setRows(mapped);
  }, []);

  function handleDelete(userId, userName) {
    const ok = window.confirm(
      `Czy na pewno chcesz usunąć użytkownika "${userName}"?`,
    );
    if (!ok) return;

    const result = db.deleteUser(userId);

    setRows((prev) => prev.filter((u) => u.id !== userId));

    if (result.deletedCurrentUser) {
      navigate("/login", { replace: true });
      window.location.reload();
    }
  }

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDir("asc");
  }

  const filteredSorted = useMemo(() => {
    const query = q.trim().toLowerCase();

    const filtered = rows.filter((r) => {
      const matchQuery =
        !query ||
        r.name.toLowerCase().includes(query) ||
        r.email.toLowerCase().includes(query) ||
        r.role.toLowerCase().includes(query);

      const matchRole = roleFilter === "all" ? true : r.role === roleFilter;

      return matchQuery && matchRole;
    });

    const copy = [...filtered];
    copy.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      const av = a[sortKey];
      const bv = b[sortKey];

      if (typeof av === "number" && typeof bv === "number") {
        return (av - bv) * dir;
      }

      return String(av).localeCompare(String(bv), "pl") * dir;
    });

    return copy;
  }, [rows, q, roleFilter, sortKey, sortDir]);

  const total = filteredSorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const pageSafe = Math.min(page, totalPages);
  const start = (pageSafe - 1) * pageSize;
  const pageRows = filteredSorted.slice(start, start + pageSize);

  useEffect(() => {
    if (page !== pageSafe) setPage(pageSafe);
  }, [page, pageSafe]);

  return (
    <DashboardLayout title="Admin Grid">
      <div className="grid-tools">
        <input
          className="grid-search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder="Szukaj: imię / email / rola…"
          aria-label="Szukaj użytkownika"
        />

        <select
          className="grid-select"
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          aria-label="Filtr roli"
        >
          <option value="all">Wszystkie role</option>
          <option value="student">student</option>
          <option value="instructor">instructor</option>
          <option value="admin">admin</option>
        </select>

        <div className="grid-meta muted">
          {total} wyników • strona {pageSafe}/{totalPages}
        </div>
      </div>

      <div className="grid-wrap" role="region" aria-label="Tabela użytkowników">
        <table className="grid-table">
          <thead>
            <tr>
              <th>
                <button
                  className="th-btn"
                  onClick={() => toggleSort("name")}
                  type="button"
                >
                  Imię{" "}
                  {sortKey === "name" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                </button>
              </th>
              <th>
                <button
                  className="th-btn"
                  onClick={() => toggleSort("email")}
                  type="button"
                >
                  Email{" "}
                  {sortKey === "email" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                </button>
              </th>
              <th>
                <button
                  className="th-btn"
                  onClick={() => toggleSort("role")}
                  type="button"
                >
                  Rola{" "}
                  {sortKey === "role" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                </button>
              </th>
              <th className="num">
                <button
                  className="th-btn"
                  onClick={() => toggleSort("courses")}
                  type="button"
                >
                  Kursy{" "}
                  {sortKey === "courses" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                </button>
              </th>
              <th className="num">
                <button
                  className="th-btn"
                  onClick={() => toggleSort("progress")}
                  type="button"
                >
                  Postęp %{" "}
                  {sortKey === "progress"
                    ? sortDir === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </button>
              </th>
              <th>Akcje</th>
            </tr>
          </thead>

          <tbody>
            {pageRows.map((r) => (
              <tr key={r.id}>
                <td className="strong">{r.name}</td>
                <td className="muted">{r.email}</td>
                <td>
                  <span className={`pill pill--${r.role}`}>{r.role}</span>
                </td>
                <td className="num">{r.courses}</td>
                <td className="num">{r.progress}</td>
                <td>
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => handleDelete(r.id, r.name)}
                  >
                    Usuń
                  </button>
                </td>
              </tr>
            ))}

            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={6} className="muted" style={{ padding: 14 }}>
                  Brak wyników.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="grid-pager">
        <button
          className="btn-ghost"
          type="button"
          onClick={() => setPage(1)}
          disabled={pageSafe === 1}
        >
          « Pierwsza
        </button>
        <button
          className="btn-ghost"
          type="button"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={pageSafe === 1}
        >
          ‹ Prev
        </button>

        <span className="muted">
          Strona <b>{pageSafe}</b> z <b>{totalPages}</b>
        </span>

        <button
          className="btn-ghost"
          type="button"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={pageSafe === totalPages}
        >
          Next ›
        </button>
        <button
          className="btn-ghost"
          type="button"
          onClick={() => setPage(totalPages)}
          disabled={pageSafe === totalPages}
        >
          Ostatnia »
        </button>
      </div>
    </DashboardLayout>
  );
}
