import { describe, expect, it } from "vitest";
import { exitNeeded, shareAtEnd } from "./napkin";

describe("the napkin sum", () => {
  it("divides the fund by your share", () => {
    expect(exitNeeded(10, 0.1)).toBeCloseTo(100, 10);
    expect(exitNeeded(100, 0.1)).toBeCloseTo(1000, 10);
    expect(exitNeeded(100, 0.08)).toBeCloseTo(1250, 10);
    expect(exitNeeded(100, 1 / 15)).toBeCloseTo(1500, 10);
    expect(exitNeeded(10, 1 / 15)).toBeCloseTo(150, 10);
    expect(exitNeeded(10, 1 / 30)).toBeCloseTo(300, 10);
  });

  it("has no answer when you own nothing", () => {
    expect(exitNeeded(10, 0)).toBe(Infinity);
  });

  it("follows your share through later rounds", () => {
    expect(shareAtEnd(1, 10, [0.2, 1 / 6])).toBeCloseTo(1 / 15, 10);
    expect(shareAtEnd(1, 10, [])).toBeCloseTo(0.1, 10);
  });
});
