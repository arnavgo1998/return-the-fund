import { describe, expect, it } from "vitest";
import { formatMoney, formatMultiple, formatShare, roundMoney } from "./format";

describe("money and shares read naturally", () => {
  it.each([
    [0, "$0"], [10 / 26, "$0.38M"], [28.8, "$28.8M"], [1, "$1M"], [3.2, "$3.2M"], [35, "$35M"], [120, "$120M"],
    [1000, "$1B"], [1200, "$1.2B"], [1250, "$1.25B"], [1500, "$1.5B"], [Infinity, "—"], [NaN, "—"],
  ])("%s → %s", (m, s) => expect(formatMoney(m)).toBe(s));

  it.each([[1 / 15, "6.67%"], [0.1, "10%"], [0.08, "8%"], [1 / 30, "3.33%"], [0, "0%"], [1 / 600, "0.17%"], [0.125, "12.5%"], [0.25, "25%"]])("%s → %s", (x, s) =>
    expect(formatShare(x)).toBe(s));

  it.each([[1.375, "1.38×"], [4.375, "4.38×"], [3, "3×"], [0, "0×"], [2.8125, "2.81×"], [0.9, "0.9×"], [1.25, "1.25×"]])("%s → %s", (x, s) =>
    expect(formatMultiple(x)).toBe(s));

  it.each([[112.5, 113], [67.142857, 67.1], [1271.43, 1270], [10 / 26, 0.38], [350, 350], [0, 0]])("roundMoney(%s) = %s, the number formatMoney prints", (m, r) =>
    expect(roundMoney(m)).toBe(r));
});
