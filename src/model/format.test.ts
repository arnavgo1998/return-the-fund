import { describe, expect, it } from "vitest";
import { formatMoney, formatShare } from "./format";

describe("money and shares read naturally", () => {
  it.each([
    [0, "$0"], [10 / 26, "$0.38M"], [28.8, "$28.8M"], [1, "$1M"], [3.2, "$3.2M"], [35, "$35M"], [120, "$120M"],
    [1000, "$1B"], [1200, "$1.2B"], [1250, "$1.25B"], [1500, "$1.5B"], [Infinity, "—"], [NaN, "—"],
  ])("%s → %s", (m, s) => expect(formatMoney(m)).toBe(s));

  it.each([[1 / 15, "6.7%"], [0.1, "10%"], [0.08, "8%"], [1 / 30, "3.3%"], [0, "0%"]])("%s → %s", (x, s) =>
    expect(formatShare(x)).toBe(s));
});
