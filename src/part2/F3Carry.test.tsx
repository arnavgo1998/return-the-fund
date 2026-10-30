import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { F3Carry, R3_STOPS } from "./F3Carry";

const t = (id: string) => screen.getByTestId(id).textContent;
const setR = (v: number) =>
  fireEvent.change(screen.getByRole("slider", { name: /R, what the fund's investments return/ }), { target: { value: String(R3_STOPS.indexOf(v)) } });

describe("Part two, model 3: carry", () => {
  it("pays LPs back first, then splits the profit 80/20", () => {
    render(<F3Carry />);
    expect(t("f3-profit")).toBe("$300M − $100M = $200M");
    expect(t("f3-carry")).toBe("20% × $200M = $40M");
    expect(t("f3-lp")).toBe("$100M + $160M = $260M");
    expect(t("f3-net")).toBe("$260M ÷ $100M = 2.6×");
    expect(t("f3-gross")).toBe("$300M ÷ $80M = 3.75×");
  });

  it("pays no carry without a profit", () => {
    render(<F3Carry />);
    setR(80);
    expect(t("f3-carry")).toBe("20% × $0 = $0");
    expect(t("f3-lp")).toBe("$80M");
    expect(t("f3-net")).toBe("$80M ÷ $100M = 0.8×");
  });

  it("sets the fee you always get beside the carry you might get", () => {
    render(<F3Carry />);
    expect(t("f3-fees")).toBe("$20M");
  });

  it("states the rule", () => {
    render(<F3Carry />);
    expect(screen.getByText("You get 20% of the profit, and only after the LPs are whole.")).toBeTruthy();
  });

  it("never prints a subtraction that doesn't add up when there is no profit", () => {
    render(<F3Carry />);
    setR(80);
    expect(t("f3-profit")).toBe("$80M is less than $100M, so $0");
    setR(0);
    expect(t("f3-profit")).toBe("$0 is less than $100M, so $0");
  });
});
