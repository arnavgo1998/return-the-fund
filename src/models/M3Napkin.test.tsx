import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FUND_STOPS, M3Napkin } from "./M3Napkin";

describe("Model 3: the napkin sum", () => {
  it("divides the fund by your share", () => {
    render(<M3Napkin />);
    expect(screen.getByTestId("exit-needed").textContent).toBe("$100M");
    fireEvent.change(screen.getByRole("slider", { name: /fund/i }), { target: { value: String(FUND_STOPS.indexOf(100)) } });
    expect(screen.getByTestId("exit-needed").textContent).toBe("$1B");
  });

  it("states the rule", () => {
    render(<M3Napkin />);
    expect(screen.getByText("Before you write the cheque, divide the fund by your share. If the company can't plausibly be worth that, the cheque can't matter.")).toBeTruthy();
  });
});
