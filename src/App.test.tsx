import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
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

  afterEach(() => { window.location.hash = ""; });
  const h1 = () => screen.getByRole("heading", { level: 1 }).textContent;
  const go = (hash: string) => act(() => {
    window.location.hash = hash;
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  });

  it("opens part two at #part-two", () => {
    window.location.hash = "#part-two";
    render(<App />);
    expect(h1()).toBe("The Fund");
    expect(screen.getByText("Part two")).toBeTruthy();
  });

  it("follows the hash back and forth, starting each part at the top", () => {
    const scroll = vi.spyOn(window, "scrollTo");
    render(<App />);
    expect(scroll).not.toHaveBeenCalled();
    expect(h1()).toBe("Return the Fund");
    go("#part-two");
    expect(h1()).toBe("The Fund");
    expect(scroll).toHaveBeenLastCalledWith(0, 0);
    scroll.mockClear();
    go("");
    expect(h1()).toBe("Return the Fund");
    expect(scroll).toHaveBeenLastCalledWith(0, 0);
    scroll.mockRestore();
  });

  it("keeps part one for any other hash", () => {
    window.location.hash = "#model-3";
    render(<App />);
    expect(h1()).toBe("Return the Fund");
  });

  it("links part one to part two and back", () => {
    render(<App />);
    expect(screen.getByRole("link", { name: /part two/i }).getAttribute("href")).toBe("#part-two");
    go("#part-two");
    expect(screen.getAllByRole("link", { name: /part one/i })[0].getAttribute("href")).toBe("#");
  });
});
