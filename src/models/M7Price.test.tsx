import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { M7Price } from "./M7Price";

const t = (id: string) => screen.getByTestId(id).textContent;

describe("Model 7: other investors set the price", () => {
  it("starts from the prices in the models so far", () => {
    render(<M7Price />);
    expect(t("first-squares")).toBe("10 squares");
    expect(t("exit-needed-7")).toBe("$150M");
    expect(t("follow-squares-7")).toBe("1.25 squares");
    expect(t("crossover-7")).toBe("1 in 8");
  });

  it("halves your squares and doubles the exit in a hot deal", () => {
    render(<M7Price />);
    fireEvent.click(screen.getByRole("button", { name: "Hot deal" }));
    expect(t("first-squares")).toBe("5 squares");
    expect(t("exit-needed-7")).toBe("$300M");
  });

  it("makes reserves buy more in a cold market", () => {
    render(<M7Price />);
    fireEvent.click(screen.getByRole("button", { name: "Cold market" }));
    expect(t("follow-squares-7")).toBe("3.33 squares");
    expect(t("crossover-7")).toBe("1 in 3");
  });

  it("states the rule", () => {
    render(<M7Price />);
    expect(screen.getByText("Paying up halves your squares and doubles the exit you need. Money held back is worth most when everyone else is scared.")).toBeTruthy();
  });

  it("shows the division behind every number", () => {
    render(<M7Price />);
    fireEvent.click(screen.getByRole("button", { name: "Hot deal" }));
    expect(t("first-working-7")).toBe("$1M ÷ $0.2M =");
    expect(t("share-end-7")).toBe("5 ÷ 150 = 3.33%");
    expect(t("napkin-7")).toBe("$10M ÷ 3.33% = $300M");
    fireEvent.click(screen.getByRole("button", { name: "Cold market" }));
    expect(t("follow-working-7")).toBe("$1M ÷ $0.3M =");
    expect(t("crossover-working-7")).toBe("$0.1M ÷ $0.3M = 1 in 3");
  });
});
