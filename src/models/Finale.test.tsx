import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Finale } from "./Finale";
import { FUND_STOPS } from "./M3Napkin";

describe("The napkin", () => {
  it("follows a $1M cheque at $10M through two rounds", () => {
    render(<Finale />);
    expect(screen.getByTestId("share-at-end").textContent).toBe("6.7%");
    expect(screen.getByTestId("napkin-exit").textContent).toBe("$150M");
  });

  it("scales with the fund", () => {
    render(<Finale />);
    fireEvent.change(screen.getByRole("slider", { name: /^the fund/i }), { target: { value: String(FUND_STOPS.indexOf(100)) } });
    expect(screen.getByTestId("napkin-exit").textContent).toBe("$1.5B");
  });

  it("drops a round", () => {
    render(<Finale />);
    fireEvent.click(screen.getByRole("button", { name: /remove a round/i }));
    expect(screen.getByTestId("share-at-end").textContent).toBe("8%");
  });
});
