import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ValueRuler, rulerPosition } from "./M3Napkin";

describe("the value ruler", () => {
  it("fits the largest sale the sliders can ask for", () => {
    expect(rulerPosition(1000 / 0.02)).toBeLessThanOrEqual(100);
  });

  it("anchors labels near the right edge to their right", () => {
    const { container } = render(<ValueRuler marks={[{ value: 50_000, label: "needed" }, { value: 10, label: "today" }]} />);
    const [needed, today] = container.querySelectorAll("[data-anchor]");
    expect(needed.getAttribute("data-anchor")).toBe("end");
    expect(today.getAttribute("data-anchor")).toBe("start");
  });
});
