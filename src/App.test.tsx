import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("opens with the title", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Return the Fund");
  });

  it("never calls money a block: notes are money, squares are shares", () => {
    render(<App />);
    expect(document.body.textContent).not.toMatch(/\bblocks?\b/i);
  });

  it("says what the sum is instead of calling it a napkin", () => {
    render(<App />);
    expect(document.body.textContent).not.toMatch(/napkin/i);
  });
});
