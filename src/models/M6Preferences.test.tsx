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
    expect(screen.getByRole("button", { name: /only blake/i }).getAttribute("aria-pressed")).toBe("true");
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
    expect(screen.getByText("Below the last round's price, preferences decide who gets paid. Above it, only squares count, and that is where a fund makes its money.")).toBeTruthy();
  });

  it("shows the working behind every payout", () => {
    render(<M6Preferences />);
    const work = (id: string) => screen.getByTestId(`work-${id}`).textContent;
    fireEvent.click(screen.getByRole("button", { name: /every investor/i }));
    setSale(60);
    expect(work("b")).toBe("the $20M put in");
    expect(work("you")).toBe("10 squares × $0.32M");
    expect(work("founders")).toBe("90 squares × $0.32M");
    setSale(30);
    expect(work("founders")).toBe("all of the $4M left");
    setSale(10);
    expect(work("you")).toBe("1/26 of the $10M sale");
    expect(work("founders")).toBe("nothing left");
    setSale(1200);
    expect(work("you")).toBe("10 squares × $8M");
  });

  it("says where the money left for the squares comes from", () => {
    render(<M6Preferences />);
    const pool = () => screen.getByTestId("m6-pool").textContent;
    fireEvent.click(screen.getByRole("button", { name: /every investor/i }));
    setSale(60);
    expect(pool()).toBe("$60M sale − $20M taken back first = $40M left ÷ 125 squares = $0.32M a square");
    setSale(10);
    expect(pool()).toBe("$10M sale is less than the $26M put in: the investors split it by what they put in");
    setSale(1200);
    expect(pool()).toBe("Nobody takes money back: $1.2B ÷ 150 squares = $8M a square");
  });

  it("puts E on the sale slider", () => {
    render(<M6Preferences />);
    expect(screen.getByRole("slider", { name: /E, the sale price/ })).toBeTruthy();
  });

  it("decides each investor by one comparison: a square's worth against the price they paid", () => {
    render(<M6Preferences />);
    const t = (id: string) => screen.getByTestId(id).textContent;
    fireEvent.click(screen.getByRole("button", { name: /every investor/i }));
    setSale(60);
    expect(t("m6-square")).toBe("$0.32M");
    expect(t("price-you")).toBe("$0.1M");
    expect(t("price-a")).toBe("$0.2M");
    expect(t("price-b")).toBe("$0.8M");
    expect(t("why-you")).toBe("a square's $0.32M beats the $0.1M paid");
    expect(t("why-b")).toBe("a square's $0.32M is less than the $0.8M paid");
    expect(t("why-founders")).toBe("no promise to choose");
    setSale(120);
    expect(t("m6-square")).toBe("$0.8M");
    expect(t("why-b")).toBe("a square's $0.8M equals the $0.8M paid");
    setSale(10);
    expect(t("why-you")).toBe("not enough to pay every investor back");
  });

  it("treats investors without the promise like the founders", () => {
    render(<M6Preferences />);
    setSale(60);
    expect(screen.getByTestId("why-you").textContent).toBe("no promise to choose");
    expect(screen.getByTestId("work-you").textContent).toBe("10 squares × $0.32M");
  });

  it("names the investors and shows what each one holds", () => {
    render(<M6Preferences />);
    const t = (id: string) => screen.getByTestId(id).textContent;
    expect(t("holds-you")).toBe("10 squares for $1M");
    expect(t("holds-a")).toBe("25 squares for $5M");
    expect(t("holds-b")).toBe("25 squares for $20M");
    expect(t("holds-founders")).toBe("90 squares");
    expect(screen.getByText("Alex (Series A)")).toBeTruthy();
    expect(screen.getByText("Blake (Series B)")).toBeTruthy();
  });
});
