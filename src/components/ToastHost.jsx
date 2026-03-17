import { useGamification } from "../context/GamificationContext.jsx";

export default function ToastHost() {
  const { toasts } = useGamification();
  if (!toasts.length) return null;

  return (
    <div className="toast-host">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          {t.text}
        </div>
      ))}
    </div>
  );
}
