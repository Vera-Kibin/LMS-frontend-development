import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SortableList from "../components/SortableList.jsx";

function dt() {
  return {
    effectAllowed: "",
    setData: vi.fn(),
    getData: vi.fn(),
  };
}

describe("SortableList", () => {
  const items = [
    { id: "a", title: "A" },
    { id: "b", title: "B" },
  ];

  it("does not call onReorder when editable=false", () => {
    const onReorder = vi.fn();

    render(
      <SortableList
        items={items}
        editable={false}
        onReorder={onReorder}
        renderItem={(it) => <div>{it.title}</div>}
      />
    );

    const A = screen.getByText("A").closest("div");
    const B = screen.getByText("B").closest("div");

    fireEvent.dragStart(A, { dataTransfer: dt() });
    fireEvent.dragOver(B, { dataTransfer: dt() });
    fireEvent.drop(B, { dataTransfer: dt() });

    expect(onReorder).not.toHaveBeenCalled();
  });

  it("calls onReorder(fromId, toId) on drop when editable=true", () => {
    const onReorder = vi.fn();

    render(
      <SortableList
        items={items}
        editable={true}
        onReorder={onReorder}
        renderItem={(it) => <div>{it.title}</div>}
      />
    );

    const A = screen.getByText("A").closest("div");
    const B = screen.getByText("B").closest("div");

    fireEvent.dragStart(A, { dataTransfer: dt() });
    fireEvent.dragOver(B, { dataTransfer: dt() });
    fireEvent.drop(B, { dataTransfer: dt() });

    expect(onReorder).toHaveBeenCalledTimes(1);
    expect(onReorder).toHaveBeenCalledWith("a", "b");
  });
});
