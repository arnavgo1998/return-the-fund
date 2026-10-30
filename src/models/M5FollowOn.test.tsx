import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HIT_STOPS, M5FollowOn, SURVIVAL_STOPS } from "./M5FollowOn";

const setH = (h: number) =>
  fireEvent.change(screen.getByRole("slider", { name: /fresh bet/i }), { target: { value: String(HIT_STOPS.indexOf(h)) } });

describe("Model 5: follow on, or a new bet", () => {
  it("counts the squares a million buys on each side", () => {
    render(<M5FollowOn />);
    expect(screen.getByTestId("follow-squares").textContent).toBe("1.25 squares");
    expect(screen.getByTestId("seed-squares").textContent).toBe("10 squares");
  });

  it("calls it even at one in eight", () => {
    render(<M5FollowOn />);
    setH(0.125);
    expect(screen.getByTestId("m5-verdict").textContent).toMatch(/exactly break-even/i);
  });

  it("follows on when fresh bets are long shots", () => {
    render(<M5FollowOn />);
    setH(0.05);
    expect(screen.getByTestId("m5-verdict").textContent).toMatch(/follow on/i);
    setH(0.25);
    expect(screen.getByTestId("m5-verdict").textContent).toMatch(/new cheque/i);
  });

  it("moves the crossover when the company might still fail", () => {
    render(<M5FollowOn />);
    expect(screen.getByTestId("crossover").textContent).toBe("1 in 8");
    fireEvent.click(screen.getByRole("button", { name: /one more unknown/i }));
    fireEvent.change(screen.getByRole("slider", { name: /survives/i }), { target: { value: String(SURVIVAL_STOPS.indexOf(0.5)) } });
    expect(screen.getByTestId("crossover").textContent).toBe("1 in 16");
  });

  it("states the rule", () => {
    render(<M5FollowOn />);
    expect(screen.getByText("Follow on when your odds on a fresh bet are worse than the old price ÷ the new price. Prepare widely, then concentrate on what's working.")).toBeTruthy();
  });

  it("shows the division behind each pile of squares and the crossover", () => {
    render(<M5FollowOn />);
    expect(screen.getByText(/\$1M ÷ \$0\.8M a square/)).toBeTruthy();
    expect(screen.getByText(/\$1M ÷ \$0\.1M a square/)).toBeTruthy();
    expect(screen.getByTestId("m5-equation").textContent).toBe("1.25 = h × 10 → h = 1.25 ÷ 10 = 1 in 8");
    fireEvent.click(screen.getByRole("button", { name: /one more unknown/i }));
    fireEvent.change(screen.getByRole("slider", { name: /survives/i }), { target: { value: String(SURVIVAL_STOPS.indexOf(0.5)) } });
    expect(screen.getByTestId("m5-equation").textContent).toBe("s × 1.25 = h × 10 → h = 50% × 1.25 ÷ 10 = 1 in 16");
  });

  it("separates my guess from the break-even, which only the prices move", () => {
    render(<M5FollowOn />);
    expect(screen.getByText(/break-even odds/i)).toBeTruthy();
    setH(0.02);
    expect(screen.getByTestId("crossover").textContent).toBe("1 in 8");
    expect(screen.getByTestId("m5-verdict").textContent).toMatch(/My guess, 1 in 50, is a longer shot than break-even, 1 in 8/);
    expect(screen.getByRole("slider", { name: /h, the chance/ })).toBeTruthy();
  });
});
