import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { F5Time } from "./F5Time";

const t = (id: string) => screen.getByTestId(id).textContent;
const setYear = (y: number) => fireEvent.change(screen.getByRole("slider", { name: /year/i }), { target: { value: String(y) } });

describe("Part two, model 5: time", () => {
  it("shows LPs paying in, fees included, for years before anything comes back", () => {
    render(<F5Time />);
    setYear(5);
    expect(t("f5-invested")).toBe("$16M × 5 years = $80M");
    expect(t("f5-fees")).toBe("$2M × 5 years = $10M");
    expect(t("f5-paid")).toBe("$80M + $10M = $90M");
    expect(t("f5-back")).toBe("$0");
    expect(t("f5-net")).toBe("−$90M");
  });

  it("breaks even in year 8 and ends at +$200M", () => {
    render(<F5Time />);
    setYear(8);
    expect(t("f5-invested")).toBe("$16M × 5 years = $80M");
    expect(t("f5-fees")).toBe("$2M × 8 years = $16M");
    expect(t("f5-paid")).toBe("$80M + $16M = $96M");
    expect(t("f5-back")).toBe("$15M + $30M + $60M = $105M");
    expect(t("f5-net")).toBe("+$9M");
    setYear(10);
    expect(t("f5-net")).toBe("+$200M");
  });

  it("describes every year of the running total for screen readers", () => {
    render(<F5Time />);
    expect(screen.getByRole("img", { name: /year 5 −\$90M.*year 8 \+\$9M/ })).toBeTruthy();
  });

  it("states the rule", () => {
    render(<F5Time />);
    expect(screen.getByText("A good fund looks like a bad one for its first five years.")).toBeTruthy();
  });

  it("takes the fee every year, even after investing stops", () => {
    render(<F5Time />);
    setYear(8);
    const years = screen.getAllByTestId("f5-fee-year");
    expect(years.map((y) => y.textContent)).toEqual(Array(10).fill("$2M"));
    expect(years.map((y) => y.getAttribute("data-taken"))).toEqual([...Array(8).fill("true"), ...Array(2).fill("false")]);
  });
});
