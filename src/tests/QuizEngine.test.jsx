import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuizEngine from "../components/QuizEngine.jsx";

const quiz = {
  id: "q1",
  title: "Test Quiz",
  passScore: 2,
  questions: [
    {
      id: "a",
      type: "radio",
      question: "2+2?",
      options: [
        { id: "3", label: "3" },
        { id: "4", label: "4" },
      ],
      answer: "4",
      points: 1,
    },
    {
      id: "b",
      type: "text",
      question: "Stolica Polski?",
      answer: ["Warszawa", "warsaw"],
      points: 1,
    },
  ],
};

describe("QuizEngine", () => {
  it("shows intro and starts quiz", async () => {
    const user = userEvent.setup();
    render(<QuizEngine quiz={quiz} />);

    expect(screen.getByText("Test Quiz")).not.toBeNull();
    await user.click(screen.getByRole("button", { name: /Rozpocznij/i }));

    expect(screen.getByText(/Pytanie 1/i)).not.toBeNull();
    expect(screen.getByText("2+2?")).not.toBeNull();
  });

  it("blocks next when unanswered", async () => {
    const user = userEvent.setup();
    render(<QuizEngine quiz={quiz} />);

    await user.click(screen.getByRole("button", { name: /Rozpocznij/i }));
    await user.click(screen.getByRole("button", { name: /Dalej/i }));

    expect(screen.getByText(/Wybierz odpowiedź/i)).not.toBeNull();
  });

  it("computes score and calls onPassed only when passed", async () => {
    const user = userEvent.setup();
    const onPassed = vi.fn();

    render(<QuizEngine quiz={quiz} onPassed={onPassed} />);

    await user.click(screen.getByRole("button", { name: /Rozpocznij/i }));

    await user.click(screen.getByLabelText("4"));
    await user.click(screen.getByRole("button", { name: /Dalej/i }));

    await user.type(
      screen.getByPlaceholderText(/Twoja odpowiedź/i),
      "Warszawa"
    );
    await user.click(screen.getByRole("button", { name: /Zakończ/i }));

    expect(screen.getByText(/Wynik:/i)).not.toBeNull();
    expect(screen.getByText(/Zaliczone/i)).not.toBeNull();

    await user.click(screen.getByRole("button", { name: /Zapisz wynik/i }));

    expect(onPassed).toHaveBeenCalledTimes(1);
    expect(onPassed).toHaveBeenCalledWith({
      quizId: "q1",
      score: 2,
      maxScore: 2,
    });
  });
});
