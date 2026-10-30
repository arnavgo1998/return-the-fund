import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { F1Money, R_STOPS } from "./F1Money";

const t = (id: string) => screen.getByTestId(id).textContent;

describe("Part two, model 1: other people's money", () => {
  it("draws the fund as 99 LP notes and 1 of yours", () => {
    render(<F1Money />);
    expect(screen.getByRole("img", { name: /99 notes from LPs and 1 note of yours/ })).toBeTruthy();
  });

  it("splits what comes back by what went in", () => {
    render(<F1Money />);
    expect(t("f1-lp")).toBe("99% × $300M = $297M");
    expect(t("f1-gp")).toBe("1% × $300M = $3M");
    fireEvent.change(screen.getByRole("slider", { name: /R, what the fund's investments return/ }), { target: { value: String(R_STOPS.indexOf(100)) } });
    expect(t("f1-gp")).toBe("1% × $100M = $1M");
  });

  it("states the rule", () => {
    render(<F1Money />);
    expect(screen.getByText("It's mostly other people's money. On your own $1M, you earn like any LP.")).toBeTruthy();
  });
});
