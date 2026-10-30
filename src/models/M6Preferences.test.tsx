import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { M6Preferences } from "./M6Preferences";
import { EXIT_STOPS } from "./stops";

const setSale = (v: number) =>
  fireEvent.change(screen.getByRole("slider", { name: /sells for/i }), { target: { value: String(EXIT_STOPS.indexOf(v)) } });
const paid = (id: string) => screen.getByTestId(`paid-${id}`).textContent;

describe("Model 6: who gets paid first", () => {
  it("starts with Series B alone, switching at the price it paid", () => {
    render(<M6Preferences />);
    expect(screen.getByRole("button", { name: /only series b/i }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByTestId("switch-b").textContent).toBe("$120M");
  });

  it("pays money back first in a small sale once everyone has the promise", () => {
    render(<M6Preferences />);
    fireEvent.click(screen.getByRole("button", { name: /every investor/i }));
    setSale(30);
    expect(paid("you")).toBe("$1M");
    expect(paid("a")).toBe("$5M");
    expect(paid("b")).toBe("$20M");
    expect(paid("founders")).toBe("$4M");
  });

  it("pays by share in a big sale", () => {
    render(<M6Preferences />);
    fireEvent.click(screen.getByRole("button", { name: /every investor/i }));
    setSale(1200);
    expect(paid("you")).toBe("$80M");
  });

  it("states the rule", () => {
    render(<M6Preferences />);
    expect(screen.getByText("Below the last round's price, preferences decide who gets paid. Above it, only shares matter — and above it is where a fund is made.")).toBeTruthy();
  });
});
