import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { F6Paper } from "./F6Paper";

const t = (id: string) => screen.getByTestId(id).textContent;
const setYear = (y: number) => fireEvent.change(screen.getByRole("slider", { name: /year/i }), { target: { value: String(y) } });

describe("Part two, model 6: paper and cash", () => {
  it("opens in year 4, with paper gains and no cash", () => {
    render(<F6Paper />);
    expect(t("f6-dpi")).toBe("$0 ÷ $80M = 0×");
    expect(t("f6-tvpi")).toBe("($0 + $110M) ÷ $80M = 1.38×");
  });

  it("scores year 8 and year 1", () => {
    render(<F6Paper />);
    setYear(8);
    expect(t("f6-dpi")).toBe("$105M ÷ $100M = 1.05×");
    expect(t("f6-tvpi")).toBe("($105M + $190M) ÷ $100M = 2.95×");
    setYear(1);
    expect(t("f6-dpi")).toBe("$0 ÷ $20M = 0×");
    expect(t("f6-tvpi")).toBe("($0 + $18M) ÷ $20M = 0.9×");
  });

  it("names the two scores", () => {
    render(<F6Paper />);
    expect(screen.getByText("DPI")).toBeTruthy();
    expect(screen.getByText("TVPI")).toBeTruthy();
  });

  it("states the rule", () => {
    render(<F6Paper />);
    expect(screen.getByText("You raise the next fund on paper. LPs judge you on cash.")).toBeTruthy();
  });
});
