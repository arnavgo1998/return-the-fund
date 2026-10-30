import { describe, expect, it } from "vitest";
import { capTable } from "./company";
import { switchPoint, waterfall } from "./waterfall";

const table = capTable("b");

describe("who gets paid first", () => {
  it("pays money back first in a small sale", () => {
    const { paid, switched } = waterfall(30, table);
    expect(paid.you).toBeCloseTo(1, 10);
    expect(paid.a).toBeCloseTo(5, 10);
    expect(paid.b).toBeCloseTo(20, 10);
    expect(paid.founders).toBeCloseTo(4, 10);
    expect(switched).toEqual([]);
  });

  it("lets cheaper squares switch to their share first", () => {
    const { paid, switched } = waterfall(60, table);
    expect(paid.you).toBeCloseTo(3.2, 10);
    expect(paid.a).toBeCloseTo(8, 10);
    expect(paid.b).toBeCloseTo(20, 10);
    expect(paid.founders).toBeCloseTo(28.8, 10);
    expect([...switched].sort()).toEqual(["a", "you"]);
  });

  it("pays by share alone in a big sale", () => {
    const { paid } = waterfall(1200, table);
    expect(paid.you).toBeCloseTo(80, 10);
    expect(paid.a).toBeCloseTo(200, 10);
    expect(paid.b).toBeCloseTo(200, 10);
    expect(paid.founders).toBeCloseTo(720, 10);
  });

  it("shares a sale too small to pay everyone back in proportion to what they put in", () => {
    const { paid } = waterfall(10, table);
    expect(paid.you).toBeCloseTo(10 / 26, 10);
    expect(paid.a).toBeCloseTo(50 / 26, 10);
    expect(paid.b).toBeCloseTo(200 / 26, 10);
    expect(paid.founders).toBe(0);
  });

  it("never pays out more or less than the sale", () => {
    for (const exit of [0, 10, 26, 30, 35, 45, 60, 120, 1200]) {
      const { paid } = waterfall(exit, table);
      expect(Object.values(paid).reduce((s, v) => s + v, 0)).toBeCloseTo(exit, 8);
    }
    expect(Object.values(waterfall(0, table).paid).every((v) => v === 0)).toBe(true);
  });

  it("finds where each investor switches", () => {
    expect(switchPoint(table, "you")).toBeCloseTo(35, 4);
    expect(switchPoint(table, "a")).toBeCloseTo(45, 4);
    expect(switchPoint(table, "b")).toBeCloseTo(120, 4);
  });

  it("can give the preference to Series B alone", () => {
    expect(switchPoint(table, "b", ["b"])).toBeCloseTo(120, 4);
    const { paid } = waterfall(60, table, ["b"]);
    expect(paid.b).toBeCloseTo(20, 10);
    expect(paid.you).toBeCloseTo(3.2, 10);
    expect(paid.founders).toBeCloseTo(28.8, 10);
  });
});
