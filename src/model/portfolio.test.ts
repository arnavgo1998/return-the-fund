import { describe, expect, it } from "vitest";
import { OTHERS, fundReturn, winnerNeeded } from "./portfolio";

describe("ten cheques", () => {
  it("has nine companies that return 8 blocks between them", () => {
    expect(OTHERS).toHaveLength(9);
    expect(fundReturn(0)).toBe(8);
  });
  it("needs the winner to carry the fund", () => {
    expect(fundReturn(22)).toBe(30);
    expect(winnerNeeded(1)).toBe(2);
    expect(winnerNeeded(3)).toBe(22);
  });
});
