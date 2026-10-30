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

  it("says when a sale is too small to give investors their money back", () => {
    render(<M6Preferences />);
    fireEvent.click(screen.getByRole("button", { name: /every investor/i }));
    setSale(10);
    expect(screen.getByTestId("how-you").textContent).toBe("part of the money back");
    setSale(30);
    expect(screen.getByTestId("how-you").textContent).toBe("money back");
  });

  it("states the rule", () => {
    render(<M6Preferences />);
    expect(screen.getByText("Below the last round's price, preferences decide who gets paid. Above it, only shares matter — and above it is where a fund is made.")).toBeTruthy();
  });

  it("shows the working behind every payout", () => {
    render(<M6Preferences />);
    const work = (id: string) => screen.getByTestId(`work-${id}`).textContent;
    fireEvent.click(screen.getByRole("button", { name: /every investor/i }));
    setSale(60);
    expect(work("b")).toBe("the $20M put in");
    expect(work("you")).toBe("10/125 of the $40M left");
    expect(work("founders")).toBe("90/125 of the $40M left");
    setSale(30);
    expect(work("founders")).toBe("all of the $4M left");
    setSale(10);
    expect(work("you")).toBe("1/26 of the $10M sale");
    expect(work("founders")).toBe("nothing left");
    setSale(1200);
    expect(work("you")).toBe("10/150 of the $1.2B sale");
  });

  it("says where the money left for the squares comes from", () => {
    render(<M6Preferences />);
    const pool = () => screen.getByTestId("m6-pool").textContent;
    fireEvent.click(screen.getByRole("button", { name: /every investor/i }));
    setSale(60);
    expect(pool()).toBe("$60M sale − $20M taken back first = $40M left, split over 125 squares");
    setSale(10);
    expect(pool()).toBe("$10M sale is less than the $26M put in: the investors split it by what they put in");
    setSale(1200);
    expect(pool()).toBe("Nobody takes money back: the $1.2B sale is split over all 150 squares");
  });
});
