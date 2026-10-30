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
    expect(screen.getByText(/comes back 3×/)).toBeTruthy();
  });

  it("states the rule", () => {
    render(<M2TenCheques />);
    expect(screen.getByText("One company has to carry the fund. The rest barely matter.")).toBeTruthy();
  });

  it("labels the winner's column with what it returns, not a question mark", () => {
    render(<M2TenCheques />);
    fireEvent.change(screen.getByRole("slider", { name: /winner returns/i }), { target: { value: "22" } });
    expect(screen.getByTestId("winner-label").textContent).toBe("22");
    expect(screen.queryByText("?")).toBeNull();
  });

  it("writes the fund total out as a sum of the ten columns", () => {
    render(<M2TenCheques />);
    fireEvent.change(screen.getByRole("slider", { name: /winner returns/i }), { target: { value: "22" } });
    expect(screen.getByTestId("m2-sum").textContent).toBe("0 + 0 + 0 + 0 + 0 + 1 + 1 + 3 + 3 + 22 = 30");
  });

  it("names each group of columns", () => {
    render(<M2TenCheques />);
    for (const g of ["lost", "money back", "3×", "winner"]) expect(screen.getByText(g)).toBeTruthy();
  });

  it("talks about money in dollars", () => {
    render(<M2TenCheques />);
    expect(screen.getByText("$8M back for $10M put in. The fund loses.")).toBeTruthy();
    expect(screen.getByRole("slider", { name: /winner returns, \$M/i })).toBeTruthy();
  });
});
