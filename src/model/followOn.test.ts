import { describe, expect, it } from "vitest";
import { followOnCrossover, sharesFor } from "./followOn";

describe("more money into the winner, or a new bet", () => {
  it("counts the squares a million buys", () => {
    expect(sharesFor(1, 0.8)).toBe(1.25);
    expect(sharesFor(1, 0.1)).toBe(10);
    expect(sharesFor(1, 0.3)).toBeCloseTo(10 / 3, 10);
  });
  it("crosses over at the old price over the new", () => {
    expect(followOnCrossover(0.1, 0.8)).toBe(0.125);
    expect(followOnCrossover(0.1, 0.8, 0.5)).toBe(0.0625);
    expect(followOnCrossover(0.1, 0.3)).toBeCloseTo(1 / 3, 10);
  });
});
