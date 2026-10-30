import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CARRY_STOPS, FEE_STOPS_2, FUND_STOPS_2, P2Finale, TARGET_STOPS_2 } from "./P2Finale";

const t = (id: string) => screen.getByTestId(id).textContent;
const set = (name: RegExp, stops: number[], v: number) =>
  fireEvent.change(screen.getByRole("slider", { name }), { target: { value: String(stops.indexOf(v)) } });

describe("Part two, your fund", () => {
  it("works out the default fund", () => {
    render(<P2Finale />);
    expect(t("p2-fees")).toBe("$100M × 2% × 10 years = $20M");
    expect(t("p2-invested")).toBe("$100M − $20M = $80M");
    expect(t("p2-R")).toBe("$100M + $200M ÷ 0.8 = $350M");
    expect(t("p2-gross")).toBe("$350M ÷ $80M = 4.38×");
    expect(t("p2-carry")).toBe("20% × $250M = $50M");
  });

  it("pays no carry when LPs only get their money back", () => {
    render(<P2Finale />);
    set(/LPs want/i, TARGET_STOPS_2, 1);
    expect(t("p2-carry")).toBe("20% × $0 = $0");
  });

  it("never shows NaN or Infinity, whatever the settings", () => {
    render(<P2Finale />);
    const fig = screen.getByRole("figure");
    for (const f of FUND_STOPS_2) for (const fee of FEE_STOPS_2) for (const c of CARRY_STOPS) for (const m of TARGET_STOPS_2) {
      set(/^F, the fund/, FUND_STOPS_2, f);
      set(/fee/i, FEE_STOPS_2, fee);
      set(/carry/i, CARRY_STOPS, c);
      set(/LPs want/i, TARGET_STOPS_2, m);
      expect(fig.textContent).not.toMatch(/NaN|Infinity|—/);
    }
  });

  it("links back to part one", () => {
    render(<P2Finale />);
    expect(screen.getByRole("link", { name: /part one/i }).getAttribute("href")).toBe("#");
  });
});
