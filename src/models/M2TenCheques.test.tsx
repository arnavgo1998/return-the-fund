import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { M2TenCheques } from "./M2TenCheques";

describe("Model 2: ten cheques", () => {
  it("loses without a winner", () => {
    render(<M2TenCheques />);
    expect(screen.getByTestId("fund-total").textContent).toBe("8");
    expect(screen.getByText(/loses/)).toBeTruthy();
  });

  it("triples when the winner returns 22", () => {
    render(<M2TenCheques />);
    fireEvent.change(screen.getByRole("slider", { name: /winner returns/i }), { target: { value: "22" } });
    expect(screen.getByTestId("fund-total").textContent).toBe("30");
    expect(screen.getByText(/3×/)).toBeTruthy();
  });

  it("states the rule", () => {
    render(<M2TenCheques />);
    expect(screen.getByText("One company has to carry the fund. The rest barely matter.")).toBeTruthy();
  });
});
