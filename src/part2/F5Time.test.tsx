import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { F5Time } from "./F5Time";

const t = (id: string) => screen.getByTestId(id).textContent;
const setYear = (y: number) => fireEvent.change(screen.getByRole("slider", { name: /year/i }), { target: { value: String(y) } });

describe("Part two, model 5: time", () => {
  it("shows LPs paying in for five years before anything comes back", () => {
    render(<F5Time />);
    setYear(5);
    expect(t("f5-paid")).toBe("$20M × 5 years = $100M");
    expect(t("f5-back")).toBe("$0");
    expect(t("f5-net")).toBe("−$100M");
  });

  it("breaks even in year 8 and ends at +$200M", () => {
    render(<F5Time />);
    setYear(8);
    expect(t("f5-back")).toBe("$15M + $30M + $60M = $105M");
    expect(t("f5-net")).toBe("+$5M");
    setYear(10);
    expect(t("f5-net")).toBe("+$200M");
  });

  it("describes every year of the running total for screen readers", () => {
    render(<F5Time />);
    expect(screen.getByRole("img", { name: /year 5 −\$100M.*year 8 \+\$5M/ })).toBeTruthy();
  });

  it("states the rule", () => {
    render(<F5Time />);
    expect(screen.getByText("A good fund looks like a bad one for its first five years.")).toBeTruthy();
  });
});
