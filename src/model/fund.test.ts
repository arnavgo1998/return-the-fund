import { describe, expect, it } from "vitest";
import { carrySplit, clawback, feeBudget, feeSchedule, fundYear, returnNeeded, splitByCommitment } from "./fund";

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
  it("calls that year's fee with every call, for all ten years", () => {
    expect(fundYear(1)).toMatchObject({ paidIn: 18, back: 0, net: -18, dpi: 0 });
    expect(fundYear(5).paidIn).toBe(90);
    expect(fundYear(6).paidIn).toBe(92);
  });
  it("sits below 1× in year 1, because of the fee", () => {
    expect(fundYear(1).tvpi).toBeCloseTo(16 / 18, 9);
  });
  it("shows paper gains long before cash", () => {
    expect(fundYear(4).tvpi).toBeCloseTo(96 / 72, 9);
    expect(fundYear(4).dpi).toBe(0);
  });
  it("breaks even in year 8 and ends at 3×", () => {
    expect(fundYear(8)).toMatchObject({ paidIn: 96, back: 105, net: 9 });
    expect(fundYear(10)).toEqual({ paidIn: 100, back: 300, net: 200, dpi: 3, tvpi: 3 });
  });

describe("the fee, year by year", () => {
  it("charges the same fee every year when it's flat", () => {
    expect(feeSchedule(0.02)).toEqual([2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
  });
  it("drops to 1% a year after year 5 when it steps down", () => {
    expect(feeSchedule(0.02, true)).toEqual([2, 2, 2, 2, 2, 1, 1, 1, 1, 1]);
    expect(feeSchedule(0.025, true).reduce((a, b) => a + b, 0)).toBe(17.5);
  });
});

describe("carry taken too early", () => {
  it("claws back what was taken above the whole-fund carry", () => {
    expect(clawback(30)).toEqual({ R: 180, taken: 28, owed: 16, giveBack: 12, stillDue: 0 });
    expect(clawback(0)).toEqual({ R: 150, taken: 28, owed: 10, giveBack: 18, stillDue: 0 });
  });
  it("pays the rest at the end when the fund does well", () => {
    expect(clawback(100)).toEqual({ R: 250, taken: 28, owed: 30, giveBack: 0, stillDue: 2 });
  });
});
});
