import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { F2Fee, FEE_STOPS } from "./F2Fee";

const t = (id: string) => screen.getByTestId(id).textContent;

describe("Part two, model 2: the fee", () => {
  it("takes 2% a year for ten years off the top", () => {
    render(<F2Fee />);
    expect(t("f2-fees")).toBe("$2M × 10 years = $20M");
    expect(t("f2-invested")).toBe("$100M − $20M = $80M");
    expect(t("f2-needed")).toBe("$100M ÷ $80M = 1.25×");
  });

  it("moves with the fee", () => {
    render(<F2Fee />);
    fireEvent.change(screen.getByRole("slider", { name: /fee/i }), { target: { value: String(FEE_STOPS.indexOf(0.025)) } });
    expect(t("f2-invested")).toBe("$100M − $25M = $75M");
    expect(t("f2-needed")).toBe("$100M ÷ $75M = 1.33×");
  });

  it("draws fees as notes that never get invested", () => {
    render(<F2Fee />);
    expect(screen.getByRole("img", { name: /80 notes invested and 20 notes of fees/ })).toBeTruthy();
  });

  it("states the rule", () => {
    render(<F2Fee />);
    expect(screen.getByText("Fees come off the top, so $80M has to earn back $100M.")).toBeTruthy();
  });

  it("shows the fee year by year", () => {
    render(<F2Fee />);
    const years = screen.getAllByTestId("fee-year").map((e) => e.textContent);
    expect(years).toEqual(Array(10).fill("$2M"));
  });

  it("can step the fee down to 1% a year after year 5", () => {
    render(<F2Fee />);
    fireEvent.click(screen.getByRole("button", { name: /steps down/i }));
    const years = screen.getAllByTestId("fee-year").map((e) => e.textContent);
    expect(years).toEqual([...Array(5).fill("$2M"), ...Array(5).fill("$1M")]);
    expect(t("f2-fees")).toBe("$2M × 5 years + $1M × 5 years = $15M");
    expect(t("f2-invested")).toBe("$100M − $15M = $85M");
    expect(t("f2-needed")).toBe("$100M ÷ $85M = 1.18×");
  });
});
