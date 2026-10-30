import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CHEQUE_STOPS, Finale } from "./Finale";
import { FUND_STOPS } from "./M3Napkin";

describe("The napkin", () => {
  it("follows a $1M cheque at $10M through two rounds", () => {
    render(<Finale />);
    expect(screen.getByTestId("share-at-end").textContent).toBe("6.67%");
    expect(screen.getByTestId("napkin-exit").textContent).toBe("$150M");
  });

  it("scales with the fund", () => {
    render(<Finale />);
    fireEvent.change(screen.getByRole("slider", { name: /F, the fund.*The fund$/ }), { target: { value: String(FUND_STOPS.indexOf(100)) } });
    expect(screen.getByTestId("napkin-exit").textContent).toBe("$1.5B");
  });

  it("never lets the cheque be bigger than the company", () => {
    render(<Finale />);
    fireEvent.change(screen.getByRole("slider", { name: /your cheque/i }), { target: { value: String(CHEQUE_STOPS.indexOf(10)) } });
    const post = screen.getByRole("slider", { name: /company after your money/i }).getAttribute("aria-valuetext");
    expect(post).toBe("$15M");
    expect(screen.queryByText(/= 100%/)).toBeNull();
  });

  it("names who comes out first the way Model 6 taught it", () => {
    render(<Finale />);
    expect(screen.getByText(/every investor takes their money back before the founders' squares are paid/)).toBeTruthy();
  });

  it("drops a round", () => {
    render(<Finale />);
    fireEvent.click(screen.getByRole("button", { name: /remove a round/i }));
    expect(screen.getByTestId("share-at-end").textContent).toBe("8%");
  });
});
