import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { F4Need, TARGET_STOPS } from "./F4Need";

const t = (id: string) => screen.getByTestId(id).textContent;

describe("Part two, model 4: what LPs need", () => {
  it("works back from 3× net to what the investments must return", () => {
    render(<F4Need />);
    expect(t("f4-R")).toBe("$100M + $200M ÷ 0.8 = $350M");
    expect(t("f4-gross")).toBe("$350M ÷ $80M = 4.38×");
    expect(t("f4-sale")).toBe("$350M ÷ 10% = $3.5B");
  });

  it("moves with the target", () => {
    render(<F4Need />);
    fireEvent.change(screen.getByRole("slider", { name: /LPs want/i }), { target: { value: String(TARGET_STOPS.indexOf(2)) } });
    expect(t("f4-R")).toBe("$100M + $100M ÷ 0.8 = $225M");
    expect(t("f4-gross")).toBe("$225M ÷ $80M = 2.81×");
    expect(t("f4-sale")).toBe("$225M ÷ 10% = $2.25B");
  });

  it("states the rule", () => {
    render(<F4Need />);
    expect(screen.getByText("3× for LPs means turning $80M into $350M.")).toBeTruthy();
  });
});
