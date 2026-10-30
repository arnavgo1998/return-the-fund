import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { F7Paper } from "./F7Paper";

const t = (id: string) => screen.getByTestId(id).textContent;
const setYear = (y: number) => fireEvent.change(screen.getByRole("slider", { name: /year/i }), { target: { value: String(y) } });

describe("Part two, model 7: paper and cash", () => {
  it("opens in year 4, with paper gains and no cash", () => {
    render(<F7Paper />);
    expect(t("f6-dpi")).toBe("$0 ÷ $72M = 0×");
    expect(t("f6-tvpi")).toBe("($0 + $96M) ÷ $72M = 1.33×");
  });

  it("scores year 8 and year 1", () => {
    render(<F7Paper />);
    setYear(8);
    expect(t("f6-dpi")).toBe("$105M ÷ $96M = 1.09×");
    expect(t("f6-tvpi")).toBe("($105M + $190M) ÷ $96M = 3.07×");
    setYear(1);
    expect(t("f6-dpi")).toBe("$0 ÷ $18M = 0×");
    expect(t("f6-tvpi")).toBe("($0 + $16M) ÷ $18M = 0.89×");
  });

  it("names the two scores", () => {
    render(<F7Paper />);
    expect(screen.getByText("DPI")).toBeTruthy();
    expect(screen.getByText("TVPI")).toBeTruthy();
  });

  it("states the rule", () => {
    render(<F7Paper />);
    expect(screen.getByText("You raise the next fund on paper. LPs judge you on cash.")).toBeTruthy();
  });
});
