import { useQuery } from "@tanstack/react-query";

async function fetchQuoteOfTheDay() {
  const res = await fetch("/quotes/api/today");
  if (!res.ok) throw new Error("Quote fetch failed");

  const data = await res.json();
  const item = Array.isArray(data) ? data[0] : null;

  return { text: item?.q || "No quote", author: item?.a || "" };
}

export function useQuoteOfTheDay() {
  return useQuery({
    queryKey: ["quote", "today"],
    queryFn: fetchQuoteOfTheDay,
    staleTime: 1000 * 60 * 60 * 12,
    cacheTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

// import { useEffect, useState } from "react";

// export function useDailyQuote() {
//   const [quote, setQuote] = useState(null); // { text, author }
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     let cancelled = false;

//     async function load() {
//       setLoading(true);
//       setError("");

//       try {
//         const res = await fetch("/quotes/api/today");
//         if (!res.ok) throw new Error("HTTP " + res.status);

//         const data = await res.json();
//         const first = Array.isArray(data) ? data[0] : null;

//         const nextQuote = first?.q
//           ? { text: first.q, author: first.a || "Unknown" }
//           : null;

//         if (!cancelled) setQuote(nextQuote);
//       } catch (e) {
//         if (!cancelled) {
//           setError("Nie udało się pobrać cytatu.");
//           setQuote({
//             text: "Małe kroki codziennie robią wielką różnicę.",
//             author: "—",
//           });
//         }
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }

//     load();

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   return { quote, loading, error };
// }
