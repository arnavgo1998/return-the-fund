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
    expect(screen.getByText("Fund ÷ your share = the sale you need.")).toBeTruthy();
  });

  it("writes the sum the same way round in words and in numbers", () => {
    render(<M3Napkin />);
    expect(screen.getByTestId("napkin-words-1").textContent).toBe("your share × E = F");
    expect(screen.getByTestId("napkin-numbers-1").textContent).toBe("10% × E = $10M");
    expect(screen.getByTestId("napkin-words-2").textContent).toBe("E = F ÷ your share");
    expect(screen.getByTestId("napkin-numbers-2").textContent).toBe("E = $10M ÷ 10% = $100M");
  });

  it("shows today's price and the growth needed as divisions", () => {
    render(<M3Napkin />);
    expect(screen.getByTestId("napkin-today").textContent).toBe("$1M ÷ 10% = $10M");
    expect(screen.getByTestId("napkin-growth").textContent).toBe("$100M ÷ $10M = 10×");
  });

  it("puts F on the fund slider and shows E is what the sliders set", () => {
    render(<M3Napkin />);
    expect(screen.getByRole("slider", { name: /F, the fund/ })).toBeTruthy();
    expect(screen.getByTestId("napkin-sets").textContent).toBe("These two set E");
  });

  it("splits the fund into ten cheques, so the cheque grows with the fund", () => {
    render(<M3Napkin />);
    const t = (id: string) => screen.getByTestId(id).textContent;
    expect(t("napkin-cheque")).toBe("$10M ÷ 10 cheques = $1M");
    fireEvent.change(screen.getByRole("slider", { name: /fund/i }), { target: { value: String(FUND_STOPS.indexOf(100)) } });
    expect(t("napkin-cheque")).toBe("$100M ÷ 10 cheques = $10M");
    expect(t("napkin-today")).toBe("$10M ÷ 10% = $100M");
    expect(t("napkin-growth")).toBe("$1B ÷ $100M = 10×");
  });

  it("names the company's value today V, on the ruler and where it is worked out", () => {
    render(<M3Napkin />);
    expect(screen.getAllByRole("img", { name: /V, the company's value today/, hidden: true }).length).toBeGreaterThanOrEqual(3);
  });
});
