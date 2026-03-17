import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

let mockedUser = null;

vi.mock("../context/AuthContext.jsx", () => ({
  useAuth: () => ({ uzytkownik: mockedUser }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Navigate: ({ to }) => <div data-testid="nav">NAVIGATE:{to}</div>,
  };
});

import ProtectedRoute from "../components/ProtectedRoute.jsx";

describe("ProtectedRoute", () => {
  it("redirects to /login when no user", () => {
    mockedUser = null;
    render(
      <ProtectedRoute allowedRoles={["student"]}>
        <div>SECRET</div>
      </ProtectedRoute>
    );
    expect(screen.getByTestId("nav").textContent).toBe("NAVIGATE:/login");
  });

  it("redirects when role not allowed", () => {
    mockedUser = { role: "student" };
    render(
      <ProtectedRoute allowedRoles={["admin"]}>
        <div>SECRET</div>
      </ProtectedRoute>
    );
    expect(screen.getByTestId("nav").textContent).toBe("NAVIGATE:/login");
  });

  it("renders children when allowed", () => {
    mockedUser = { role: "admin" };
    render(
      <ProtectedRoute allowedRoles={["admin"]}>
        <div>SECRET</div>
      </ProtectedRoute>
    );
    expect(screen.getByText("SECRET")).not.toBeNull();
  });
});
