import { describe, expect, it } from "vitest";
import { ROUND_A, ROUND_B, capTable, postMoney, preMoney, seed, shareOf, totalShares } from "./company";

describe("the company in squares", () => {
  it("starts as 100 squares, 10 of them yours", () => {
    expect(totalShares(seed())).toBe(100);
    expect(shareOf(capTable("seed"), "you")).toBe(0.1);
  });

  it("adds squares each round and never removes yours", () => {
    expect(shareOf(capTable("a"), "you")).toBeCloseTo(0.08, 10);
    expect(shareOf(capTable("b"), "you")).toBeCloseTo(1 / 15, 10);
    expect(totalShares(capTable("b"))).toBe(150);
    for (const stage of ["seed", "a", "b"] as const) {
      expect(capTable(stage).find((h) => h.id === "founders")!.shares).toBe(90);
      expect(capTable(stage).find((h) => h.id === "you")!.shares).toBe(10);
    }
  });

  it("prices each round before and after the money", () => {
    expect(preMoney(capTable("seed"), ROUND_A)).toBeCloseTo(20, 10);
    expect(postMoney(capTable("seed"), ROUND_A)).toBeCloseTo(25, 10);
    expect(preMoney(capTable("a"), ROUND_B)).toBeCloseTo(100, 10);
    expect(postMoney(capTable("a"), ROUND_B)).toBeCloseTo(120, 10);
  });

  it("records what each investor paid and that their squares are preferred", () => {
    const b = capTable("b");
    expect(b.find((h) => h.id === "a")).toEqual({ id: "a", shares: 25, invested: 5, preferred: true });
    expect(b.find((h) => h.id === "b")!.invested).toBeCloseTo(20, 10);
    expect(b.find((h) => h.id === "you")).toEqual({ id: "you", shares: 10, invested: 1, preferred: true });
    expect(b.find((h) => h.id === "founders")!.preferred).toBe(false);
  });

  it("gives you half the squares in a hot deal", () => {
    expect(seed(0.2).find((h) => h.id === "founders")!.shares).toBe(95);
    expect(shareOf(capTable("b", 0.2), "you")).toBeCloseTo(1 / 30, 10);
  });
});
