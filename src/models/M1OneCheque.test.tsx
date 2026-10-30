import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { M1OneCheque } from "./M1OneCheque";
import { EXIT_STOPS } from "./stops";

const setSale = (v: number) =>
  fireEvent.change(screen.getByRole("slider", { name: /sells for/i }), { target: { value: String(EXIT_STOPS.indexOf(v)) } });

describe("Model 1: one cheque", () => {
  it("returns ten per cent of the sale, in blocks", () => {
    render(<M1OneCheque />);
    expect(screen.getByTestId("m1-back").textContent).toBe("$10M");
    setSale(1000);
    expect(screen.getByTestId("m1-back").textContent).toBe("$100M");
    setSale(0);
    expect(screen.getByTestId("m1-back").textContent).toBe("$0");
  });

  it("states the rule", () => {
    render(<M1OneCheque />);
    expect(screen.getByText("You can lose the cheque. What you can win has no ceiling.")).toBeTruthy();
  });

  it("shows where the 10 squares, the 10% and the $10M come from", () => {
    render(<M1OneCheque />);
    expect(screen.getByTestId("m1-squares").textContent).toBe("$1M ÷ $0.1M = 10");
    expect(screen.getByTestId("m1-share").textContent).toBe("10 ÷ 100 = 10%");
    expect(screen.getByTestId("m1-worth").textContent).toBe("100 × $0.1M = $10M");
  });

  it("puts E on the slider that sets it", () => {
    render(<M1OneCheque />);
    expect(screen.getByRole("slider", { name: /E, the sale price/ })).toBeTruthy();
  });
});
