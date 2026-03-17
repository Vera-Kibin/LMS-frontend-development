import { useMemo, useState } from "react";

function normalizeText(s) {
  return String(s ?? "")
    .trim()
    .toLowerCase();
}

function scoreQuestion(q, userAnswer) {
  if (q.type === "radio") {
    return userAnswer === q.answer ? q.points ?? 1 : 0;
  }

  if (q.type === "checkbox") {
    const a = Array.isArray(userAnswer) ? [...userAnswer].sort() : [];
    const c = Array.isArray(q.answer) ? [...q.answer].sort() : [];
    const ok = a.length === c.length && a.every((v, i) => v === c[i]);
    return ok ? q.points ?? 1 : 0;
  }

  if (q.type === "text") {
    const a = normalizeText(userAnswer);
    const accepted = (Array.isArray(q.answer) ? q.answer : [q.answer]).map(
      normalizeText
    );
    return accepted.includes(a) ? q.points ?? 1 : 0;
  }

  return 0;
}

export default function QuizEngine({ quiz, onPassed }) {
  const [stage, setStage] = useState("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");

  const question = quiz.questions[index];

  const isLast = index === quiz.questions.length - 1;

  function start() {
    setStage("question");
    setIndex(0);
    setAnswers({});
    setError("");
  }

  function setAnswerForCurrent(value) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    setError("");
  }

  function validateAnswered() {
    const a = answers[question.id];
    if (question.type === "radio") return Boolean(a);
    if (question.type === "checkbox") return Array.isArray(a) && a.length > 0;
    if (question.type === "text") return normalizeText(a).length > 0;
    return false;
  }

  function next(e) {
    e.preventDefault();
    if (!validateAnswered()) {
      setError("Wybierz odpowiedź, aby przejść dalej.");
      return;
    }
    if (isLast) {
      setStage("result");
      return;
    }
    setIndex((i) => i + 1);
    setError("");
  }

  const { score, passed, maxScore } = useMemo(() => {
    const max = quiz.questions.reduce((s, q) => s + (q.points ?? 1), 0);
    const sc = quiz.questions.reduce(
      (s, q) => s + scoreQuestion(q, answers[q.id]),
      0
    );
    const passScore = quiz.passScore ?? max;
    return { score: sc, maxScore: max, passed: sc >= passScore };
  }, [answers, quiz]);

  function finish() {
    if (passed && onPassed) onPassed({ quizId: quiz.id, score, maxScore });
  }

  return (
    <section className="quiz">
      <h3 className="quiz__title">{quiz.title ?? "Quiz"}</h3>

      {stage === "intro" && (
        <div className="quiz__card">
          <p className="muted">
            Pytania: {quiz.questions.length} • Próg zaliczenia:{" "}
            {quiz.passScore ?? maxScore}/{maxScore}
          </p>
          <button className="btn" type="button" onClick={start}>
            Rozpocznij quiz
          </button>
        </div>
      )}

      {stage === "question" && (
        <form className="quiz__card" onSubmit={next}>
          <div className="quiz__meta muted">
            Pytanie {index + 1} / {quiz.questions.length}
          </div>

          <p className="quiz__q">{question.question}</p>

          {question.type === "radio" && (
            <div className="quiz__answers">
              {question.options.map((opt) => (
                <label key={opt.id} className="quiz__opt">
                  <input
                    type="radio"
                    name={question.id}
                    value={opt.id}
                    checked={answers[question.id] === opt.id}
                    onChange={() => setAnswerForCurrent(opt.id)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          )}

          {question.type === "checkbox" && (
            <div className="quiz__answers">
              {question.options.map((opt) => {
                const arr = Array.isArray(answers[question.id])
                  ? answers[question.id]
                  : [];
                const checked = arr.includes(opt.id);

                return (
                  <label key={opt.id} className="quiz__opt">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const nextArr = e.target.checked
                          ? [...arr, opt.id]
                          : arr.filter((x) => x !== opt.id);
                        setAnswerForCurrent(nextArr);
                      }}
                    />
                    <span>{opt.label}</span>
                  </label>
                );
              })}
            </div>
          )}

          {question.type === "text" && (
            <div className="quiz__answers">
              <input
                className="quiz__input"
                type="text"
                value={answers[question.id] ?? ""}
                onChange={(e) => setAnswerForCurrent(e.target.value)}
                placeholder="Twoja odpowiedź..."
              />
            </div>
          )}

          {error && <p className="quiz__error">{error}</p>}

          <div className="quiz__actions">
            <button className="btn" type="submit">
              {isLast ? "Zakończ" : "Dalej"}
            </button>
          </div>
        </form>
      )}

      {stage === "result" && (
        <div className="quiz__card">
          <p>
            Wynik: <strong>{score}</strong> / {maxScore}
          </p>
          <p className={passed ? "quiz__ok" : "quiz__bad"}>
            {passed ? "Zaliczone 👍" : "Nie zaliczone 😔"}
          </p>

          <div className="quiz__actions">
            <button className="btn" type="button" onClick={start}>
              Spróbuj ponownie
            </button>

            <button className="btn btn--ghost" type="button" onClick={finish}>
              Zapisz wynik
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
