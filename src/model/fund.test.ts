import { describe, expect, it } from "vitest";
import { carrySplit, feeBudget, fundYear, returnNeeded, splitByCommitment } from "./fund";

describe("whose money", () => {
  it("splits what comes back by what went in: 99% LPs, 1% you", () => {
    expect(splitByCommitment(300)).toEqual({ lp: 297, gp: 3 });
    expect(splitByCommitment(0)).toEqual({ lp: 0, gp: 0 });
  });
});

describe("the fee", () => {
  it("takes 2% a year for 10 years off the top", () => {
    expect(feeBudget(0.02)).toEqual({ fees: 20, invested: 80 });
    expect(feeBudget(0.025).invested).toBe(75);
    expect(feeBudget(0.015).fees).toBe(15);
  });
});

describe("carry", () => {
  it("pays 20% of the profit after LPs get $100M back", () => {
    expect(carrySplit(300)).toEqual({ profit: 200, carry: 40, lp: 260 });
    expect(carrySplit(350)).toEqual({ profit: 250, carry: 50, lp: 300 });
  });
  it("pays no carry when there is no profit", () => {
    expect(carrySplit(80)).toEqual({ profit: 0, carry: 0, lp: 80 });
    expect(carrySplit(0)).toEqual({ profit: 0, carry: 0, lp: 0 });
  });
});

describe("what LPs need", () => {
  it.each([[1, 100], [2, 225], [3, 350]])("%s× net needs R = %s", (m, R) => expect(returnNeeded(m)).toBe(R));
});

describe("one illustrative fund over ten years", () => {
  it("starts with money called and nothing back", () => {
    expect(fundYear(1)).toEqual({ paidIn: 20, back: 0, net: -20, dpi: 0, tvpi: 0.9 });
  });
  it("shows paper gains long before cash", () => {
    expect(fundYear(4).tvpi).toBe(1.375);
    expect(fundYear(4).dpi).toBe(0);
  });
  it("breaks even in year 8 and ends at 3×", () => {
    expect(fundYear(8)).toEqual({ paidIn: 100, back: 105, net: 5, dpi: 1.05, tvpi: 2.95 });
    expect(fundYear(10)).toEqual({ paidIn: 100, back: 300, net: 200, dpi: 3, tvpi: 3 });
  });
});
